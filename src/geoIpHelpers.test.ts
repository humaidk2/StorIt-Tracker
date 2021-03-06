export {}
import chai = require('chai')

// const chaiHttp = require('chai-http')
import {
    calculateDistance,
    distance,
    getIp,
    convertToContinent,
    getRegion,
} from './geoIpHelpers'
const expect = chai.should()

// chai.use(chaiHttp)

describe('Geo Ip Helpers', () => {
    describe('Convert country code to Continent', () => {
        // test status codes
        it('it should GET correctly convert continent', () => {
            convertToContinent('AE').should.be.equal('ME')
        })
        // should match mock data
        // it('it should match test project', (done) => {
        //     chai.request(server)
        //         .get('/projects/humaidk2/5')
        //         .end((err, res) => {
        //             res.body.should.be.deep.equal(testProject)
        //             done()
        //         })
        // })
    })
})
