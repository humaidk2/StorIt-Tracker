export default function (client: any, sequelize: any) {
    client.on('addclient', function (details: any) {
        const post = { uId: details.authId, location: details.id }
        const socketUpdate = {
            location: client.id,
        }
        try {
            sequelize.models.Client.upsert(post)
        } catch (error) {
            console.log(error)
        }
    })
}
