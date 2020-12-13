export default function (client: any, sequelize: any) {
    client.on('addserver', function (details: any) {
        const post = {
            Id: details.deviceId + details.authId,
            uId: details.authId,
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
        try {
            sequelize.models.Server.upsert(post)
        } catch (error) {
            console.log(error)
        }
    })
}
