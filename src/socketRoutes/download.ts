export default function (client: any, sequelize: any) {
    client.on('download', function (details: any) {
        // take file id and get all socket id for that file
        const sql = `SELECT socketId FROM Server S Inner JOIN Chunk C ON S.ServerID = C.ServerID Where C.FileID = ${details.fileId} `
        const query = sequelize.query(sql, function (err: any, result: any) {
            if (err) {
                console.log(err)
            } else {
                client.emit('downloadList', result)
                console.log(result)
            }
        })
    })
}
