export {}
import chai = require('chai')
import { create } from 'lodash'

// const chaiHttp = require('chai-http')
import createDb from './'
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
            user = await Client.create({ location: 'India' })
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
            console.log(user.uId)
        })
        it('Mock Client has location set properly', () => {
            expect(user.location).to.equal('India')
        })
    })
    describe('Testing Server Table', () => {
        // test status codes
        let server: any
        before(async function () {
            // runs once before the first test in this block
            try {
                server = await Server.create({
                    uId: 'humaidk2',
                    name: 'server0',
                    storage: 323242342,
                    availableStorage: 32423423,
                    location: 'Dubai',
                    status: 'down',
                    totalDownTime: 200,
                    currentDownTime: 100,
                    lastChecked: new Date(),
                })
            } catch (error) {
                console.log(error)
            }
            //         'uid VARCHAR(50),' +
            //         'name VARCHAR(50),' +
            //         'storage bigint, ' +
            //         'availableStorage bigint,' +
            //         'location VARCHAR(50), ' +
            //         'status VARCHAR(50),' +
            //         'totalDownTime int,' +
            //         'currentDownTime int,' +
            //         'lastChecked timestamp,' +
        })
        it('Mock Server is an instance of Server', () => {
            expect(server).to.be.instanceOf(Server)
        })
        it('Mock Server has userId property', () => {
            expect(server).has.property('uId')
        })
        it('Mock Server has name property', () => {
            expect(server).has.property('name')
        })
        it('Mock Server has storage property', () => {
            expect(server).has.property('storage')
        })
        it('Mock Server has availableStorage property', () => {
            expect(server).has.property('availableStorage')
        })
        it('Mock Server has location property', () => {
            expect(server).has.property('location')
        })
        it('Mock Server has status property', () => {
            expect(server).has.property('status')
        })
        it('Mock Server has totalDownTime property', () => {
            expect(server).has.property('totalDownTime')
        })
        it('Mock Server has currentDownTime property', () => {
            expect(server).has.property('currentDownTime')
        })
        it('Mock Server has lastChecked property', () => {
            expect(server).has.property('lastChecked')
        })
        it('Mock Server properties are of appropriate type', () => {
            expect(server.location).to.be.a('string')
            expect(server.uId).to.be.a('string')
        })

        it('Mock Server has location set properly', () => {
            expect(server.location).to.equal('Dubai')
        })
    })
})
