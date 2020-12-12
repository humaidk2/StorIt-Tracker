export default function (client: any, sequelize: any) {
    client.on('addclient', function (details: any) {
        const post = { uid: details.authId, location: details.id }
        const socketUpdate = {
            location: client.id,
        }
        const sql = `INSERT INTO Client SET ? ON DUPLICATE KEY UPDATE ?;`
        const query = sequelize.query(
            sql,
            [post, socketUpdate],
            function (err: any, result: any) {
                if (err) {
                    // socket.emit('Error'+err);
                    console.log('Error' + err)
                } else {
                    console.log('client is Inserted into the database')
                }
            }
        )
    })
}
