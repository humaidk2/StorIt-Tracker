export default function (client: any) {
    client.on('disconnect', function () {
        // client.emit('Disconnected');
        console.log('user disconnected from the server')
    })
}
