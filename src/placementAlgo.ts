//                // change serverid to location?
//                // insert first entry to file table
//                // insert first entry to chunks table
//                // for every other entry
//                // insert in chunks table
//                // insert into backup table
// // select * from Server where ServerId=? or serverId=?...for every server in serverList[sid, sid, sid]
// // if any of the servers are missing
// // rollback
// // else   23r33

import { getMax, getMin, reRange, reRangeInverse } from './maxMinHelpers'
import {
    calculateQuality,
    checkFileFitPossible,
    getAvgQuality,
    getMinRegionLength,
    initializeNumberOfChunks,
    resetUsedStorage,
    sortServers,
} from './placementHelpers'

// // replace every server id with location in final list
// // update the server table
// // commit
// // replace every server id with location in final list
// // insert first entry to file table
// // insert first entry to chunks table
// // for every other entry
// // insert in chunks table
// // insert in backup table

// // send back to client

// console.log(JSON.stringify(serverList, null, 2));
export default function placementAlgorithm(
    serverList: any,
    fileSize: number,
    regions: string[]
): any {
    if (!checkFileFitPossible(serverList, regions, fileSize)) {
        console.log('file failed to fit')
        console.log('use aws instead')
        return []
    }
    const newServerList: any = {}
    regions.forEach((region: string) => (newServerList[region] = []))
    let initialNumChunks: number = initializeNumberOfChunks(
        serverList,
        fileSize
    )
    let fileFits = false
    let w1 = 0.2,
        w2 = 0.6,
        w3 = 0.2
    const maxList: any = {}
    const minList: any = {}
    newServerList.forEach((region: string) => {
        maxList[region] = {}
        minList[region] = {}
        maxList[region].distance = getMax(serverList, region, 'distance')
        maxList[region].storage = getMax(serverList, region, 'storage')
        maxList[region].downTime = getMax(serverList, region, 'totalDownTime')
        minList[region].maxDistance = getMin(serverList, region, 'distance')
        minList[region].storage = getMin(serverList, region, 'storage')
        minList[region].downTime = getMin(serverList, region, 'totalDownTime')
    })
    serverList.forEach((server: any) => {
        if (
            Object.prototype.hasOwnProperty.call(newServerList, server.region)
        ) {
            newServerList[server.region].push({
                distance: server.distance,
                storage: server.storage,
                currStorage: server.storage,
                downTime: server.totalDownTime,
                location: server.location,
                serverId: server.ServerId,
            })
        }
    })
    // pass newServerList[region], maxDistance, minDistance

    let minRegionLength = newServerList[0].length
    for (const region in newServerList) {
        reRangeInverse(
            newServerList[region],
            maxList[region].distance,
            minList[region].distance,
            'distance'
        )
        reRange(
            newServerList[region],
            maxList[region].storage,
            minList[region].storage,
            'storage'
        )
        reRangeInverse(
            newServerList[region],
            maxList[region].downTime,
            minList[region].downTime,
            'downTime'
        )
        // get minimum region server length
        if (newServerList[region].length < minRegionLength) {
            minRegionLength = newServerList[region].length
        }
    }
    // // calculate quality for each region
    // // calculate the avg quality across all the server regions across all regions
    // // sort the regions
    // // pick top n
    // // check if it fits across all regions
    // // repeat increasing w2 and num of chunks
    let finalList: any = {}

    while (!fileFits && initialNumChunks <= minRegionLength && w2 <= 1) {
        // calculate quality for each region
        for (const region in newServerList)
            calculateQuality(newServerList[region], w1, w2, w3)
        for (const region in newServerList)
            sortServers(newServerList[region], 'quality')

        // getMinRegionLength(newServerList)
        const minRegionLength = getMinRegionLength(newServerList)
        // for maybe the smallest region
        // from 0 - 4, add all quality and divide by 4
        // then from 0 - 4, add all quality and divide by 4
        // calculate the avg quality across all the server regions across all regions
        // getAvgQuality
        const avgList = getAvgQuality(newServerList, minRegionLength)
        fileFits = true
        finalList = []
        let qSum = 0
        for (let i = 0; i < initialNumChunks; i++) {
            qSum += avgList[i]
        }
        // we have set the avg q for each item
        // now we just copy the results to the finalList
        //and ensure it fits for all the regions
        for (let i = 0; i < regions.length; i++) {
            // recalculate quality
            calculateQuality(newServerList[regions[i]], w1, w2, w3)
            // sort each region descendingly by the quality
            sortServers(newServerList, 'quality')
            finalList[i] = []
            for (let j = 0; j < initialNumChunks; j++) {
                finalList[i].push([
                    newServerList[regions[i]][j].serverId,
                    Math.round((avgList[j] * fileSize) / qSum),
                ])
                if (finalList[i][j][1] > newServerList[regions[i]][j].storage) {
                    if (w2 < 1 && initialNumChunks < minRegionLength) {
                        initialNumChunks++
                        w2 = (w2 * 100 + 0.1 * 100) / 100
                        w1 = (w1 * 100 - 0.05 * 100) / 100
                        w3 = (w3 * 100 - 0.05 * 100) / 100
                    } else {
                        if (w2 === 1) {
                            initialNumChunks++
                        } else if (initialNumChunks === minRegionLength) {
                            w2 = (w2 * 100 + 0.1 * 100) / 100
                            w1 = (w1 * 100 - 0.05 * 100) / 100
                            w3 = (w3 * 100 - 0.05 * 100) / 100
                        }
                    }
                    fileFits = false
                    break
                } else {
                    // reduce the st
                    newServerList[regions[i]][j].storage -= finalList[i][j][1]
                }
            }
            if (!fileFits) {
                break
            }
        }
        // console.log(newServerList);
        // for every server in the final list
        // add the storage back to the server in newserverlist
        if (!fileFits) {
            resetUsedStorage(newServerList)
        }
    }
    if (fileFits) {
        // reduce any used memory
        for (let i = 0; i < serverList.length; i++) {
            for (let j = 0; j < finalList.length; j++) {
                for (let k = 0; k < finalList[j].length; k++) {
                    // console.log(location)
                    if (finalList[j][k][0] === serverList[i].serverId) {
                        serverList[i].storage -= finalList[j][k][1]
                    }
                }
            }
        }
    } else {
        console.log('file failed to fit')
        console.log('use aws instead')
        return {}
    }
    return finalList
}
