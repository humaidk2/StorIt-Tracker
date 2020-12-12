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
    // const serverList = await con.query(
    //     'select * from Server where uid <> $1 for update skip locked;',
    //     { bind: [userId], type: QueryTypes.SELECT }
    // )
    // await serverList.forEach((server: any) => {
    //     // only check the socket ids that are currently connected
    //     // delete the rest
    //     // if(io.sockets.connected.hasOwnProperty(result0[i].location)) else delete/slice results[i]
    //     server.distance = calculateDistance(client.id, server.location, io)
    //     server.region = getRegion(server.location, io)
    // })
    // const finalList = await placementAlgorithm(serverList, fileSize, regions)
    // await console.log(finalList)

    // const transactionResult = await con.transaction(async (t: any) => {
    //     // store the list of all final servers?
    //     const updatedServers: any[] = []
    //     for (let i = 0; i < finalList.length; i++) {
    //         for (let j = 0; j < finalList[i].length; j++) {
    //             if (updatedServers.indexOf(finalList[i][j][0]) == -1) {
    //                 updatedServers.push(finalList[i][j][0])
    //             }
    //         }
    //     }
    //     con.query()
    //     // let sql = 'select * from Server where ServerId=?'

    //     //             for (let i = 1; i < updatedServers.length; i++) {
    //     //                 sql += ' OR ServerId=? '
    //     //             }

    //     //             sql += ' for update skip locked;'

    //     //             const query = con.query(
    // })
    con.query(
        'select * from Server where uid <> ? for update skip locked;',
        [userId],
        (err: any, result0: any) => {
            if (err) {
                throw err
            } else {
                // for any server in serverlist // calculate and set distance
                console.log(result0.length)

                for (let i = 0; i < result0.length; i++) {
                    // only check the socket ids that are currently connected
                    // delete the rest
                    // if(io.sockets.connected.hasOwnProperty(result0[i].location)) else delete/slice results[i]
                    result0[i].distance = calculateDistance(
                        client.id,
                        result0[i].location,
                        io
                    )
                }
                for (let i = 0; i < result0.length; i++) {
                    result0[i].region = getRegion(result0[i].location, io) //result0[i].location);
                }
                console.log(result0)

                // console.log(placementAlgorithm(serverList, fileSize, regions));

                const finalList = placementAlgorithm(result0, fileSize, regions)
                console.log(finalList)

                // if it failed then rollback and call the function again

                // if(finalList == false) {
                //     return false;
                // }
                // get placement servers
                con.beginTransaction((err: any) => {
                    if (err) {
                        throw err
                    }
                    // try selecting for update
                    const updatedServers: any[] = []
                    for (let i = 0; i < finalList.length; i++) {
                        for (let j = 0; j < finalList[i].length; j++) {
                            if (
                                updatedServers.indexOf(finalList[i][j][0]) == -1
                            ) {
                                updatedServers.push(finalList[i][j][0])
                            }
                        }
                    }

                    let sql = 'select * from Server where ServerId=?'

                    for (let i = 1; i < updatedServers.length; i++) {
                        sql += ' OR ServerId=? '
                    }

                    sql += ' for update skip locked;'

                    const query = con.query(
                        sql,
                        updatedServers,
                        (err2: any, result2: any) => {
                            if (err2) {
                                console.log(err2)
                            } else {
                                console.log(result2)
                                console.log(result2.insertId)
                                // con.rollback((err)=>{
                                //     if(err) {throw err;}
                                //     con.end(function(err) {
                                //         console.log(err);
                                //     });
                                // });

                                if (updatedServers.length != result2.length) {
                                    // roll back
                                    // return false
                                    con.rollback((err: any) => {
                                        if (err) {
                                            throw err
                                        }
                                        placeFile(
                                            con,
                                            regions,
                                            userId,
                                            fileSize,
                                            client,
                                            io
                                        )
                                        // con.end(function(err) {
                                        //     console.log(err);
                                        // });
                                    })
                                } else {
                                    const promiseList = []
                                    // for every in serverList
                                    for (let i = 0; i < result0.length; i++) {
                                        // if the server is in updated servers
                                        if (
                                            updatedServers.indexOf(
                                                result0[i].serverId
                                            ) != -1
                                        ) {
                                            promiseList.push(
                                                new Promise(
                                                    (resolve, reject) => {
                                                        console.log('run')
                                                        const updateParam = [
                                                            result0[i].storage,
                                                            result0[i].serverId,
                                                        ]
                                                        const updateQuery =
                                                            'update server set storage = ? where ServerId = ? ;'
                                                        con.query(
                                                            updateQuery,
                                                            updateParam,
                                                            (
                                                                err4: any,
                                                                result4: any
                                                            ) => {
                                                                if (err4) {
                                                                    console.log(
                                                                        err4
                                                                    )
                                                                } else {
                                                                    resolve(
                                                                        'success'
                                                                    )
                                                                }
                                                            }
                                                        )
                                                    }
                                                )
                                            )
                                        }
                                    }
                                    // update server table update server set storage = serverList[i].storage where serverId = serverList[i].serverId;
                                    // once done commit
                                    // we only commit once all
                                    Promise.all(promiseList).then((values) => {
                                        console.log('values ' + values)
                                        con.commit((err: any) => {
                                            if (err) {
                                                return con.rollback(
                                                    function () {
                                                        throw err
                                                    }
                                                )
                                            } else {
                                                const InsertFileSql =
                                                    'Insert into File set ?'
                                                const InsertFilePost = {
                                                    fileId: 0,
                                                    uid: userId,
                                                }
                                                con.query(
                                                    InsertFileSql,
                                                    InsertFilePost,
                                                    (
                                                        err2: any,
                                                        result2: any
                                                    ) => {
                                                        console.log(result2)
                                                        if (err2) {
                                                            console.log(err2)
                                                        } else {
                                                            for (
                                                                let j = 0;
                                                                j <
                                                                finalList[0]
                                                                    .length;
                                                                j++
                                                            ) {
                                                                const insertChunkSql =
                                                                    'Insert into Chunk set ?'
                                                                const insertChunkPost = {
                                                                    chunkId: 0,
                                                                    serverId:
                                                                        finalList[0][
                                                                            j
                                                                        ][0],
                                                                    fileId:
                                                                        result2.insertId,
                                                                    chunkSize:
                                                                        finalList[0][
                                                                            j
                                                                        ][1],
                                                                }
                                                                con.query(
                                                                    insertChunkSql,
                                                                    insertChunkPost,
                                                                    (
                                                                        j: any,
                                                                        err3: any,
                                                                        result3: any
                                                                    ) => {
                                                                        console.log(
                                                                            result3
                                                                        )
                                                                        if (
                                                                            err3
                                                                        ) {
                                                                            console.log(
                                                                                err3
                                                                            )
                                                                        } else {
                                                                            // for every other entry
                                                                            for (
                                                                                let i = 1;
                                                                                i <
                                                                                finalList.length;
                                                                                i++
                                                                            ) {
                                                                                // insert in chunks table
                                                                                console.log(
                                                                                    'j = ' +
                                                                                        j +
                                                                                        ' i = ' +
                                                                                        i
                                                                                )
                                                                                const insertChunkSql =
                                                                                    'Insert into Chunk set ?'
                                                                                const insertChunkPost = {
                                                                                    chunkId: 0,
                                                                                    serverId:
                                                                                        finalList[
                                                                                            i
                                                                                        ][
                                                                                            j
                                                                                        ][0],
                                                                                    fileId:
                                                                                        result2.insertId,
                                                                                    chunkSize:
                                                                                        finalList[
                                                                                            i
                                                                                        ][
                                                                                            j
                                                                                        ][1],
                                                                                }
                                                                                con.query(
                                                                                    insertChunkSql,
                                                                                    insertChunkPost,
                                                                                    (
                                                                                        err2: any,
                                                                                        result4: any
                                                                                    ) => {
                                                                                        console.log(
                                                                                            result4
                                                                                        )
                                                                                        if (
                                                                                            err2
                                                                                        ) {
                                                                                            console.log(
                                                                                                err2
                                                                                            )
                                                                                        } else {
                                                                                            const insertBackupSql =
                                                                                                'Insert into Backup set ?'
                                                                                            const insertBackupPost = {
                                                                                                // chunkid, backupchunkid
                                                                                                backupId: 0,
                                                                                                chunkId:
                                                                                                    result3.insertId,
                                                                                                backupChunkId:
                                                                                                    result4.insertId,
                                                                                            }
                                                                                            con.query(
                                                                                                insertBackupSql,
                                                                                                insertBackupPost,
                                                                                                (
                                                                                                    err5: any,
                                                                                                    result5: any
                                                                                                ) => {
                                                                                                    if (
                                                                                                        err3
                                                                                                    ) {
                                                                                                        console.log(
                                                                                                            err5
                                                                                                        )
                                                                                                    }
                                                                                                    // done?
                                                                                                    console.log(
                                                                                                        'done'
                                                                                                    )
                                                                                                    if (
                                                                                                        i ==
                                                                                                            finalList.length -
                                                                                                                1 &&
                                                                                                        j ==
                                                                                                            finalList[
                                                                                                                i
                                                                                                            ]
                                                                                                                .length
                                                                                                    ) {
                                                                                                        // con.end((err)=>{});
                                                                                                        client.emit(
                                                                                                            'uploadList',
                                                                                                            finalList
                                                                                                        )
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        }
                                                    }
                                                )
                                            }
                                        })
                                    })
                                }
                            }
                        }
                    )
                })
            }
        }
    )
}
