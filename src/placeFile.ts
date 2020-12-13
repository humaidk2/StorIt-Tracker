import { Op } from 'sequelize'
import sequelize = require('sequelize')
import { calculateDistance, getRegion } from './geoIpHelpers'
import placementAlgorithm from './placementAlgo'

const QueryTypes = sequelize.QueryTypes
export default async function placeFile(
    con: any,
    regions: any,
    userId: any,
    fileSize: any,
    client: { id: any; emit: (arg0: string, arg1: any) => void },
    io: any
) {
    const serverList = await con.query(
        'select * from Server where uid <> $1 for update skip locked;',
        { bind: [userId], type: QueryTypes.SELECT }
    )
    await serverList.forEach((server: any) => {
        // only check the socket ids that are currently connected
        // delete the rest
        // if(io.sockets.connected.hasOwnProperty(result0[i].location)) else delete/slice results[i]
        server.distance = calculateDistance(client.id, server.location, io)
        server.region = getRegion(server.location, io)
    })
    // [/*region1*/[[serverId, storage], [serverId, storage]],/*region2*/[[serverId, storage],[serverId, storage]]]
    const finalList = await placementAlgorithm(serverList, fileSize, regions)
    await console.log(finalList)
    try {
        const transactionResult = await con.transaction(async (t: any) => {
            // store the list of all final servers?
            const updatedServers: any[] = []
            for (let i = 0; i < finalList.length; i++) {
                for (let j = 0; j < finalList[i].length; j++) {
                    if (updatedServers.indexOf(finalList[i][j][0]) == -1) {
                        updatedServers.push(finalList[i][j][0])
                    }
                }
            }
            const availableServers = await con.models.Server.findAll({
                where: {
                    Id: {
                        [Op.or]: updatedServers,
                    },
                },
                transaction: t,
                lock: true,
                skipLocked: true,
            })
            if (updatedServers.length !== availableServers.length) {
                throw new Error('not enough servers')
            }
            const promiseList = []
            // for every in serverList
            for (let i = 0; i < serverList.length; i++) {
                if (updatedServers.indexOf(serverList[i].serverId) !== -1) {
                    promiseList.push(async function () {
                        con.models.Server.update(
                            { storage: serverList[i].storage },
                            {
                                where: {
                                    Id: serverList[i].serverId,
                                },
                            },
                            { transaction: t }
                        )
                    })
                }
            }
            await Promise.all(promiseList)
        })
    } catch (error) {
        console.log(error)
    }
    const file = await con.models.File.create({
        uId: userId,
    })
    const chunkInsertionPromises = finalList[0].map(async (regionList: any) => {
        const params = {
            ServerId: regionList[0],
            FileId: file.insertId,
            chunkSize: regionList[1],
        }
        return await con.models.Chunk.create(params)
    })
    const chunks: any = await Promise.all(chunkInsertionPromises)
    for (let i = 1; i < finalList.length; i++) {
        for (let j = 0; j < finalList[i].length; j++) {
            const chunkParams = {
                ServerId: finalList[i][j][0],
                FileId: file.insertId,
                chunkSize: finalList[i][j][1],
            }
            const backupChunk = await con.models.Chunk.create(chunkParams)
            const backupParams = {
                ChunkId: chunks[j].insertId,
                BackupChunkId: backupChunk.insertId,
            }
            await con.models.Backup.create(backupParams)
        }
    }
    await client.emit('uploadList', finalList)
}
