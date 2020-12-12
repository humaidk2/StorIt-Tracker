import socketIO = require('socket.io')
import handleClient from './socketRoutes/addClient'
import handleServer from './socketRoutes/addServer'
import handleDisconnect from './socketRoutes/disconnect'
import handleDownload from './socketRoutes/download'
import handleMessage from './socketRoutes/message'
import handleMiddleware from './socketRoutes/middleware'
import handleUpload from './socketRoutes/upload'

export default function (io: socketIO.Server, sequelize: any, admin: any) {
    io.on('connection', function (client) {
        console.log('client with id ' + client.id + ' is connected')
        handleMiddleware(client, admin)
        handleClient(client, sequelize)
        handleServer(client, sequelize)
        handleMessage(client, io)
        handleUpload(client, io, sequelize)
        handleDownload(client, sequelize)
        handleDisconnect(client)
    })
}
