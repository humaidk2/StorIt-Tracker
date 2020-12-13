export {}
import chai = require('chai')
import { create } from 'lodash'

// const chaiHttp = require('chai-http')
import createDb from './'
import file from './file'
const expect = chai.expect

// chai.use(chaiHttp)
let Backup: any, Chunk: any, Client: any, File: any, Server: any, sequelize: any
describe('Database tables testing', () => {
    before(async function () {
        // runs once before the first test in this block
        const db = await createDb('TestStorit')
        Backup = db.Backup
        Chunk = db.Chunk
        Client = db.Client
        File = db.File
        Server = db.Server
        sequelize = db.sequelize
        await sequelize.sync({ force: true })
    })
    describe('Testing Client Table', () => {
        // test status codes
        let user: any
        before(async function () {
            // runs once before the first test in this block
            user = await Client.create({ uId: 'client0', location: 'India' })
        })
        it('Mock Client is an instance of Client', () => {
            expect(user).to.be.instanceOf(Client)
        })
        it('Mock Client has location property', () => {
            expect(user).has.property('location')
        })
        it('Mock Client has uid property', () => {
            expect(user).has.property('location')
        })
        it('Mock Client properties are of appropriate type', () => {
            expect(user.location).to.be.a('string')
            expect(user.uId).to.be.a('string')
        })
        it('Mock Client has location set properly', () => {
            expect(user.location).to.equal('India')
        })
        it('Mock Client should update if key already exists', async () => {
            const post = {
                uId: 'client0',
                location: 'Germany',
            }
            await Client.upsert(post)
            const updatedClient = await Client.findByPk('client0')
            expect(updatedClient.location).to.equal('Germany')
        })
        it("Mock Client should insert if key doesn't exist", async () => {
            const post = {
                uId: 'client1',
                location: 'Denmark',
            }
            await Client.upsert(post)
            const updatedClient = await Client.findByPk('client1')
            expect(updatedClient.location).to.equal('Denmark')
        })
    })
    describe('Testing Server Table', () => {
        // test status codes
        let server: any
        before(async function () {
            // runs once before the first test in this block
            try {
                server = await Server.create({
                    Id: 'server0',
                    uId: 'humaidk2',
                    name: 'server0',
                    storage: 323242342,
                    availableStorage: 32423423,
                    location: 'Dubai',
                    status: 'down',
                    totalDownTime: 200,
                    currentDownTime: 100,
                    lastChecked: new Date('December 17, 1995 03:24:00'),
                })
            } catch (error) {
                console.log(error)
            }
        })
        it('Mock Server is an instance of Server', () => {
            expect(server).to.be.instanceOf(Server)
        })
        it('Mock Server has all server properties', () => {
            expect(server).has.property('Id')
            expect(server).has.property('uId')
            expect(server).has.property('name')
            expect(server).has.property('storage')
            expect(server).has.property('availableStorage')
            expect(server).has.property('location')
            expect(server).has.property('status')
            expect(server).has.property('totalDownTime')
            expect(server).has.property('currentDownTime')
            expect(server).has.property('lastChecked')
        })
        it('Mock Server properties are of appropriate type', () => {
            expect(server.Id).to.be.a('string')
            expect(server.uId).to.be.a('string')
            expect(server.name).to.be.a('string')
            expect(server.storage).to.be.a('number')
            expect(server.availableStorage).to.be.a('number')
            expect(server.location).to.be.a('string')
            expect(server.status).to.be.a('string')
            expect(server.totalDownTime).to.be.a('number')
            expect(server.currentDownTime).to.be.a('number')
            expect(server.lastChecked).to.be.a('Date')
        })

        it('Mock Server has properties set properly', () => {
            expect(server.uId).to.equal('humaidk2')
            expect(server.name).to.equal('server0')
            expect(server.storage).to.equal(323242342)
            expect(server.availableStorage).to.equal(32423423)
            expect(server.location).to.equal('Dubai')
            expect(server.status).to.equal('down')
            expect(server.totalDownTime).to.equal(200)
            expect(server.currentDownTime).to.equal(100)
            expect(server.lastChecked).to.deep.equal(
                new Date('December 17, 1995 03:24:00')
            )
        })
        it('Mock Server should update if key already exists', async () => {
            const post = {
                Id: 'server0',
                location: 'Germany',
            }
            await Server.upsert(post)
            const updatedServer = await Server.findByPk('server0')
            expect(updatedServer.location).to.equal('Germany')
        })
    })
    describe('Testing File Table', () => {
        // test status codes
        let file: any
        before(async function () {
            // runs once before the first test in this block
            try {
                file = await File.create({
                    Id: 'file0',
                    uId: 'humaidk2',
                })
            } catch (error) {
                console.log(error)
            }
        })
        it('Mock File is an instance of File', () => {
            expect(file).to.be.instanceOf(File)
        })
        it('Mock File has all File properties', () => {
            expect(file).has.property('Id')
            expect(file).has.property('uId')
        })
        it('Mock File properties are of appropriate type', () => {
            expect(file.Id).to.be.a('string')
            expect(file.uId).to.be.a('string')
        })

        it('Mock File has properties set properly', () => {
            expect(file.uId).to.equal('humaidk2')
        })
    })
    describe('Testing Chunk Table', () => {
        // test status codes
        let chunk: any
        before(async function () {
            // runs once before the first test in this block
            try {
                chunk = await Chunk.create({
                    Id: 'chunk0',
                    chunkSize: 125120,
                    FileId: 'file0',
                    ServerId: 'server0',
                })
                await Chunk.create({
                    Id: 'chunk1',
                    chunkSize: 50000,
                    FileId: 'file0',
                    ServerId: 'server0',
                })
            } catch (error) {
                console.log(error)
            }
        })
        it('Mock Chunk is an instance of Chunk', () => {
            expect(chunk).to.be.instanceOf(Chunk)
        })
        it('Mock Chunk has all Chunk properties', () => {
            expect(chunk).has.property('Id')
            expect(chunk).has.property('chunkSize')
            expect(chunk).has.property('FileId')
            expect(chunk).has.property('ServerId')
        })
        it('Mock Chunk properties are of appropriate type', () => {
            expect(chunk.Id).to.be.a('string')
            expect(chunk.chunkSize).to.be.a('number')
            expect(chunk.FileId).to.be.a('string')
            expect(chunk.ServerId).to.be.a('string')
        })

        it('Mock Chunk has properties set properly', () => {
            expect(chunk.chunkSize).to.equal(125120)
            expect(chunk.FileId).to.equal('file0')
            expect(chunk.ServerId).to.equal('server0')
        })
    })
    describe('Testing Backup Table', () => {
        // test status codes
        let backup: any
        before(async function () {
            // runs once before the first test in this block
            try {
                backup = await Backup.create({
                    ChunkId: 'chunk0',
                    BackupChunkId: 'chunk1',
                })
            } catch (error) {
                console.log(error)
            }
        })
        it('Mock Backup is an instance of Backup', () => {
            expect(backup).to.be.instanceOf(Backup)
        })
        it('Mock Backup has all Backup properties', () => {
            expect(backup).has.property('Id')
            expect(backup).has.property('ChunkId')
            expect(backup).has.property('BackupChunkId')
        })
        it('Mock Backup properties are of appropriate type', () => {
            expect(backup.Id).to.be.a('string')
            expect(backup.ChunkId).to.be.a('string')
            expect(backup.BackupChunkId).to.be.a('string')
        })

        it('Mock Backup has properties set properly', () => {
            expect(backup.ChunkId).to.equal('chunk0')
            expect(backup.BackupChunkId).to.equal('chunk1')
        })
    })
})
