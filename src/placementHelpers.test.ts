export {}
import chai = require('chai')

// const chaiHttp = require('chai-http')
import {
    checkFileFitPossible,
    initializeNumberOfChunks,
    calculateQuality,
    sortServers,
    getMinRegionLength,
    getAvgQuality,
    resetUsedStorage,
} from './placementHelpers'
const expect = chai.expect

// chai.use(chaiHttp)

describe('Placement Algorithm Helper Functions', () => {
    let list: any
    describe('Test if file can possibly fit in all available servers', () => {
        before(() => {
            list = [
                { storage: 200, region: 'ME' },
                { storage: 300, region: 'ME' },
                { storage: 50, region: 'ME' },
                { storage: 100, region: 'NA' },
                { storage: 50, region: 'NA' },
            ]
        })
        it('it should FIT for files smaller than total storage of all servers in a single region', () => {
            expect(checkFileFitPossible(list, ['ME'], 200)).to.equal(true)
        })
        it('it should not FIT for files larger than total available storage in a single region', () => {
            expect(checkFileFitPossible(list, ['ME'], 600)).to.equal(false)
        })
        it('it should not FIT for files larger than total available storage in a multiple regions', () => {
            expect(checkFileFitPossible(list, ['ME', 'NA'], 200)).to.equal(
                false
            )
        })
    })
    describe('Test if initialize number of chunks', () => {
        before(() => {
            list = [
                { storage: 200, region: 'ME' },
                { storage: 300, region: 'ME' },
                { storage: 50, region: 'ME' },
                { storage: 100, region: 'NA' },
                { storage: 50, region: 'NA' },
            ]
        })
        it('it should initialize to 1 chunk for files smaller than 50MB', () => {
            expect(initializeNumberOfChunks(list, 30000000)).to.equal(1)
        })
        it('it should initialize to 2 chunks for files between 50MB - 200MB', () => {
            expect(initializeNumberOfChunks(list, 100000000)).to.equal(2)
        })
        it('it should initialize to 3 chunk for files between 200MB - 500MB', () => {
            expect(initializeNumberOfChunks(list, 300000000)).to.equal(3)
        })
        it('it should initialize to 4 chunk for files between 500MB - 1GB', () => {
            expect(initializeNumberOfChunks(list, 600000000)).to.equal(4)
        })
        it('it should initialize to 1 chunk for files between 50MB - 200MB', () => {
            list = [
                { storage: 200, region: 'ME' },
                { storage: 300, region: 'ME' },
            ]
            expect(initializeNumberOfChunks(list, 1530000000)).to.equal(2)
        })
    })
    describe('Test calculate quality', () => {
        before(() => {
            list = [
                { newStorage: 200, distance: 150, downTime: 100, region: 'ME' },
                { newStorage: 300, distance: 150, downTime: 100, region: 'ME' },
                { newStorage: 50, distance: 150, downTime: 100, region: 'ME' },
                { newStorage: 100, distance: 150, downTime: 100, region: 'NA' },
                { newStorage: 50, distance: 150, downTime: 100, region: 'NA' },
            ]
        })
        it('it should calculate quality properly', () => {
            calculateQuality(list, 0.5, 0.5, 0.5)
            expect(list[0].quality).to.equal(225)
        })
    })
    describe('Sort servers by quality', () => {
        before(() => {
            list = [
                { newStorage: 200, distance: 150, downTime: 100, region: 'ME' },
                { newStorage: 300, distance: 150, downTime: 100, region: 'ME' },
                { newStorage: 50, distance: 150, downTime: 100, region: 'ME' },
                { newStorage: 100, distance: 150, downTime: 100, region: 'NA' },
                { newStorage: 50, distance: 150, downTime: 100, region: 'NA' },
            ]
            calculateQuality(list, 0.5, 0.5, 0.5)
        })
        it('it should be sorted by quality descendingly', () => {
            sortServers(list, 'quality')
            expect(list[0].quality).to.be.greaterThan(
                list[list.length - 1].quality
            )
        })
    })
    describe('Get min region length', () => {
        let regionList = {}
        before(() => {
            regionList = {
                ME: [
                    {
                        newStorage: 200,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    },
                    {
                        newStorage: 300,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    },
                    {
                        newStorage: 50,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    },
                ],
                NA: [
                    {
                        newStorage: 100,
                        distance: 150,
                        downTime: 100,
                        region: 'NA',
                    },
                    {
                        newStorage: 50,
                        distance: 150,
                        downTime: 100,
                        region: 'NA',
                    },
                ],
            }
        })
        it('it should get the region length of the region with the least amount of servers', () => {
            expect(getMinRegionLength(regionList)).to.equal(2)
        })
    })
    describe('Calculate average quality for across regions', () => {
        let regionList: any = {}
        before(() => {
            regionList = {
                ME: [
                    {
                        newStorage: 200,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    }, // 225
                    {
                        newStorage: 300,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    }, // 275
                    {
                        newStorage: 50,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    },
                ],
                NA: [
                    {
                        newStorage: 100,
                        distance: 150,
                        downTime: 100,
                        region: 'NA',
                    }, //175 200
                    {
                        newStorage: 50,
                        distance: 150,
                        downTime: 100,
                        region: 'NA',
                    }, // 150 212.5
                ],
            }
            for (const region in regionList)
                calculateQuality(regionList[region], 0.5, 0.5, 0.5)
        })
        it('it should calculate the average quality across regions', () => {
            const avgList = getAvgQuality(
                regionList,
                getMinRegionLength(regionList)
            )
            expect(avgList).to.deep.equal([200, 212.5])
        })
    })
    describe('Reset any used memory', () => {
        let regionList: any = {}
        before(() => {
            regionList = {
                ME: [
                    {
                        newStorage: 200,
                        storage: 100,
                        currStorage: 300,
                        distance: 150,
                        downTime: 100,
                        region: 'ME',
                    }, // 225
                    {
                        newStorage: 300,
                        distance: 150,
                        storage: 100,
                        currStorage: 300,
                        downTime: 100,
                        region: 'ME',
                    }, // 275
                    {
                        newStorage: 50,
                        distance: 150,
                        storage: 100,
                        currStorage: 300,
                        downTime: 100,
                        region: 'ME',
                    },
                ],
                NA: [
                    {
                        newStorage: 100,
                        distance: 150,
                        storage: 300,
                        currStorage: 300,
                        downTime: 100,
                        region: 'NA',
                    }, //175 200
                    {
                        newStorage: 50,
                        distance: 150,
                        storage: 300,
                        currStorage: 300,
                        downTime: 100,
                        region: 'NA',
                    }, // 150 212.5
                ],
            }
        })
        it('it should reset any used memory by using currStorage', () => {
            resetUsedStorage(regionList)
            expect(regionList['ME'][0].storage).to.equal(300)
        })
        it('it should not change any unchanged storage', () => {
            resetUsedStorage(regionList)
            expect(regionList['NA'][0].storage).to.equal(300)
        })
    })
})
