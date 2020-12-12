import express = require('express')
import path = require('path')
import mysql = require('mysql')
import eventEmitter = require('events')
import admin = require('firebase-admin')
import request = require('request')
import serviceAccount from './storit-28df0-firebase-adminsdk-do5d6-b70edb80ff.json'
import password from './Password'
const app = express()
const PORT = 8000
// const http = require('https');
import http = require('http')
import fs = require('fs')
import socketIO = require('socket.io')
import createDb from './models'

//create instance access to the server
//const server = http.createServer(options, app);
// const io = socketIO(server);
const publicPath = path.join(__dirname, '/../StorIt-Tracker')
const socketHandler = './socketHandler'
const firebaseParams: any = serviceAccount // to make typescript happy

// app.use(express.static(publicPath));

// var sslPath = '/etc/letsencrypt/live/www.vrpacman.com/'
// var options = {
//     key: fs.readFileSync(sslPath + 'privkey.pem'),
//     cert: fs.readFileSync(sslPath + 'fullchain.pem'),
// }

const server = http.createServer(app)
// const server = http.createServer(app);
//Create app listener
const serverListener = server.listen(PORT, () => {
    console.log('Server running at: http://localhost:' + PORT)
})

//Initialize The Admin-SDK (configuration)
admin.initializeApp({
    credential: admin.credential.cert(firebaseParams),
    databaseURL: 'https://storit-28df0.firebaseio.com',
})

const { Backup, Chunk, Client, File, Server, sequelize } = createDb(
    process.env.STORIT_DB_NAME
)
sequelize.sync()
app.use(express.static('public'))
app.get('/createdb', async (req: any, res: any) => {
    await sequelize.sync({ force: true })
    await res.end()
})

// io.on('connection', socketHandler);

import socketStatic = require('socket.io')
const io = socketStatic.listen(serverListener)

import sHandler from './socketHandler'
sHandler(io, sequelize, admin)
