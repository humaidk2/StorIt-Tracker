export default function (client: any, sequelize: any) {
    client.on('download', async function (details: any) {
        // take file id and get all socket id for that file
        const sql = `SELECT socketId FROM Server S Inner JOIN Chunk C ON S.ServerID = C.ServerID Where C.FileID = ${details.fileId} `
        try {
            const result = await sequelize.query(sql)
            client.emit('downloadList', result)
        } catch (error) {
            console.log(error)
        }
    })
}
