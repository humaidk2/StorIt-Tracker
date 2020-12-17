export {}
import chai = require('chai')

// const chaiHttp = require('chai-http')
import { getMax, getMin, reRange, reRangeInverse } from './maxMinHelpers'
const expect = chai.expect

// chai.use(chaiHttp)

describe('Min Max Helper Functions', () => {
    let list: any
    before(() => {
        list = [
            { distance: 2, region: 'ME' },
            { distance: 3, region: 'ME' },
            { distance: 1, region: 'ME' },
        ]
    })
    describe('Test getMax', () => {
        it('it should GET the max value for a distance with defined region', () => {
            expect(getMax(list, 'distance', 'ME')).to.equal(3)
        })
        it('it should GET a zero max value for a selected property in an undefined region', () => {
            expect(getMax(list, 'distance', 'NA')).to.equal(0)
        })
        it('it should GET a zero max value for an undefined property in an defined region', () => {
            expect(getMax(list, 'storage', 'ME')).to.equal(0)
        })
    })
    describe('Test getMin', () => {
        it('it should GET the min property value for a distance with defined region', () => {
            expect(getMin(list, 'distance', 'ME')).to.equal(1)
        })
        it('it should GET the first property value for a selected property in an undefined region', () => {
            expect(getMin(list, 'distance', 'NA')).to.equal(2)
        })
        it('it should GET a zero min value for an undefined property in an defined region', () => {
            expect(getMin(list, 'storage', 'ME')).to.equal(0)
        })
    })
    describe('Test reRange', () => {
        it('it should reRange the values between 1 and 100', () => {
            const property = 'distance'
            reRange(
                list,
                getMax(list, property, 'ME'),
                getMin(list, property, 'ME'),
                property
            )
            list.forEach((elem: any) => {
                expect(elem[property]).to.be.within(1, 100)
            })
        })
        it('it should have a maxValue of 100', () => {
            expect(getMax(list, 'distance', 'ME')).to.equal(100)
        })
        it('it should have a minValue of 1', () => {
            expect(getMin(list, 'distance', 'ME')).to.equal(1)
        })
        it('it should have a 100 at the position of the previous maxValue', () => {
            expect(list[1]['distance']).to.equal(100)
        })
        it('it should have a newStorage property to store the new storage', () => {
            list = [
                { storage: 200, region: 'ME' },
                { storage: 300, region: 'ME' },
                { storage: 100, region: 'ME' },
            ]
            reRange(
                list,
                getMax(list, 'storage', 'ME'),
                getMin(list, 'storage', 'ME'),
                'storage'
            )
            list.forEach((elem: any) => {
                expect(elem['newStorage']).to.be.within(1, 100)
            })
        })
        it('it should not change the storage property', () => {
            list = [
                { storage: 200, region: 'ME' },
                { storage: 300, region: 'ME' },
                { storage: 100, region: 'ME' },
            ]
            reRange(
                list,
                getMax(list, 'storage', 'ME'),
                getMin(list, 'storage', 'ME'),
                'storage'
            )
            list.forEach((elem: any, index: number) => {
                expect(elem['storage']).to.equal(list[index].storage)
            })
        })
    })
    describe('Test reRangeInverse', () => {
        it('it should reRange the values between 100 and 1 for values less than range', () => {
            list = [
                { distance: 2, region: 'ME' },
                { distance: 3, region: 'ME' },
                { distance: 1, region: 'ME' },
            ]
            const property = 'distance'
            reRangeInverse(
                list,
                getMax(list, property, 'ME'),
                getMin(list, property, 'ME'),
                property
            )
            list.forEach((elem: any) => {
                expect(elem[property]).to.be.within(1, 100)
            })
        })
        it('it should have a maxValue of 100', () => {
            expect(getMax(list, 'distance', 'ME')).to.equal(100)
        })
        it('it should have a minValue of 1', () => {
            expect(getMin(list, 'distance', 'ME')).to.equal(1)
        })
        it('it should have a 1 at the position of the previous maxValue', () => {
            expect(list[1]['distance']).to.equal(1)
        })
        it('it should reRange the values between 100 and 1 for values larger than range', () => {
            list = [
                { distance: 200000, region: 'ME' },
                { distance: 30000000, region: 'ME' },
                { distance: 100000, region: 'ME' },
            ]
            const property = 'distance'
            reRangeInverse(
                list,
                getMax(list, property, 'ME'),
                getMin(list, property, 'ME'),
                property
            )
            list.forEach((elem: any) => {
                expect(elem[property]).to.be.within(1, 100)
            })
        })
    })
})
