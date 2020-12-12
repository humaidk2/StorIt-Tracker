export default function (client: any, sequelize: any) {
    client.on('addserver', function (details: any) {
        const post = {
            serverId: details.deviceId + details.authId,
            uid: details.authId,
            name: details.name,
            storage: details.storage,
            availableStorage: details.storage,
            location: details.id,
            status: 'available',
            totalDownTime: 0,
            currentDownTime: 0,
            lastChecked: new Date(),
        }
        const socketUpdate = {
            location: client.id,
        }
        const sql = `INSERT INTO Server SET ? ON DUPLICATE KEY UPDATE ?;`
        const query = sequelize.query(
            sql,
            [post, socketUpdate],
            function (err: any, result: any) {
                if (err) {
                    // socket.emit('Error'+err);
                    console.log('Error' + err)
                } else {
                    console.log('server is Inserted into the database')
                }
            }
        )
    })
}
