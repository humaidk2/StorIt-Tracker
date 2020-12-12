export default function (client: any, io: any) {
    client.on('message', function (details: any) {
        const otherClient = io.sockets.connected[details.to]
        if (!otherClient) {
            console.log('no such other client')
            return
        }
        delete details.to
        details.from = client.id
        otherClient.emit('message', details)
    })
}
