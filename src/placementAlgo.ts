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
    fileSize: any,
    regions: any
) {
    // for every region
    // sum up the storage

    const sumRegion: any = {}
    // iterate user defined regions
    for (let i = 0; i < regions.length; i++) {
        // this is to ensure if a region appears twice,
        // then only the first instance will be initialized
        if (i === regions.indexOf(regions[i])) {
            sumRegion[regions[i]] = 0
        }
    }

    for (let i = 0; i < serverList.length; i++) {
        sumRegion[serverList[i].region] += serverList[i].storage
    }
    // ensure file can be stored
    for (let i = 0; i < regions.length; i++) {
        sumRegion[serverList[i].region] -= fileSize
        if (sumRegion[serverList[i].region] < 0) {
            console.log('file failed to fit')
            console.log('use aws instead')
            return []
        }
    }
    let initialNumChunks = 0
    const newServerList: any = []
    if (fileSize <= 50000000) {
        initialNumChunks = 1
    } else if (fileSize <= 200000000) {
        initialNumChunks = 2
    } else if (fileSize <= 500000000) {
        initialNumChunks = 3
    } else if (fileSize <= 1000000000) {
        initialNumChunks = 4
    } else {
        initialNumChunks = 4
    }
    if (initialNumChunks > serverList.length) {
        initialNumChunks = serverList.length
    }
    // let maxStorage = 0,
    //     maxDistance = 0,
    //     maxDownTime = 0
    // let minStorage = serverList[0].storage,
    //     minDownTime = serverList[0].totalDownTime
    // let minDistance = 20000
    let fileFits = false
    let w1 = 0.2,
        w2 = 0.6,
        w3 = 0.2
    const maxList = []
    const minList = []
    // create a list for each region
    for (let i = 0; i < regions.length; i++) {
        if (i == regions.indexOf(regions[i])) {
            newServerList.push([])
            maxList.push([0, 0, 0])
            minList.push([10000000000, 200000, 20000])
        }
    }
    // forget optimization and focus on readability
    // modularize find max for region in distance, storage, downtime
    // modularize normalize field name, oldmin, oldmax, new min, new max
    // pls create separate files for each of these methods
    // find all maximum and minimums
    // when we copy to newserverlist, we need to copy only unique regions
    for (let i = 0; i < serverList.length; i++) {
        const currIndex = regions.indexOf(serverList[i].region)
        if (currIndex != -1) {
            // calculate distance
            const servDistance = serverList[i].distance //calculateDistance(details.id, serversList[i].location);
            const storage = serverList[i].storage
            const downTime = serverList[i].totalDownTime
            const location = serverList[i].location
            const serverId = serverList[i].serverId
            // storage
            // max server downtime
            newServerList[currIndex].push({
                distance: servDistance,
                storage: storage,
                currStorage: storage,
                downTime: downTime,
                location: location,
                serverId: serverId,
            })
            if (servDistance > maxList[currIndex][2]) {
                maxList[currIndex][2] = servDistance
            }
            if (servDistance < minList[currIndex][2]) {
                minList[currIndex][2] = servDistance
            }
            if (storage > maxList[currIndex][0]) {
                maxList[currIndex][0] = storage
            }
            if (storage < minList[currIndex][0]) {
                minList[currIndex][0] = storage
            }
            if (downTime > maxList[currIndex][1]) {
                maxList[currIndex][1] = downTime
            }
            if (downTime < minList[currIndex][1]) {
                minList[currIndex][1] = downTime
            }
        }
    }
    // normalize all the data to between 0 and 100
    const newMin = 1,
        newMax = 100
    let minRegionLength = newServerList[0].length
    for (let i = 0; i < newServerList.length; i++) {
        const maxDistance = maxList[i][2],
            minDistance = minList[i][2]
        const maxStorage = maxList[i][0],
            minStorage: any = minList[i][0]
        const maxDownTime = maxList[i][1],
            minDownTime: any = minList[i][1]
        const oldDistanceRange = maxDistance - minDistance
        const oldStorageRange = maxStorage - minStorage
        const oldDownTimeRange = maxDownTime - minDownTime
        for (let j = 0; j < newServerList[i].length; j++) {
            if (oldDistanceRange == 0)
                newServerList[i][j].distance = minDistance
            else {
                const newRange = newMax - newMin
                newServerList[i][j].distance =
                    newMax -
                    ((newServerList[i][j].distance - minDistance) * newRange) /
                        oldDistanceRange +
                    newMin
                // newServerList[i][j].distance = newServerList[i][j].distance
            }
            if (oldStorageRange == 0)
                newServerList[i][j].newStorage = minStorage
            else {
                const newRange = newMax - newMin
                newServerList[i][j].newStorage =
                    ((newServerList[i][j].storage - minStorage) * newRange) /
                        oldStorageRange +
                    newMin
                // newServerList[i][j].newStorage = newServerList[i][j].newStorage
            }
            if (oldDownTimeRange == 0)
                newServerList[i][j].downTime = minDownTime
            else {
                const newRange = newMax - newMin
                newServerList[i][j].downTime =
                    newMax -
                    (((newServerList[i][j].downTime - minDownTime) * newRange) /
                        oldDownTimeRange +
                        newMin)
                // newServerList[i][j].downTime = newServerList[i][j].downTime
            }
        }
        // get minimum region server length
        if (newServerList[i].length < minRegionLength) {
            minRegionLength = newServerList[i].length
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
        for (let i = 0; i < newServerList.length; i++) {
            for (let j = 0; j < newServerList[i].length; j++) {
                newServerList[i][j].quality =
                    newServerList[i][j].distance * w1 +
                    newServerList[i][j].newStorage * w2 +
                    newServerList[i][j].downTime * w3
            }
            // sort each region descendingly
            newServerList[i].sort((a: any, b: any) => b.quality - a.quality)
        }
        // for maybe the smallest region
        // from 0 - 4, add all quality and divide by 4
        // then from 0 - 4, add all quality and divide by 4
        const avgList = []
        // calculate the avg quality across all the server regions across all regions
        for (let i = 0; i < minRegionLength; i++) {
            let avg = 0
            for (let j = 0; j < newServerList.length; j++) {
                avg += newServerList[j][i].quality
            }
            avg /= newServerList.length
            for (let j = 0; j < newServerList.length; j++) {
                newServerList[j][i].averageQuality = avg
            }
            avgList.push(avg)
        }
        fileFits = true
        // console.log(newServerList)
        finalList = []
        let qSum = 0
        for (let i = 0; i < initialNumChunks; i++) {
            qSum += avgList[i]
        }
        // we have set the avg q for each item
        // now we just copy the results to the finalList
        //and ensure it fits for all the regions
        for (let i = 0; i < regions.length; i++) {
            const index = regions.indexOf(regions[i])
            if (index != i) {
                // recalculate quality
                for (let j = 0; j < newServerList[index].length; j++) {
                    newServerList[index][j].quality =
                        newServerList[index][j].distance * w1 +
                        newServerList[index][j].newStorage * w2 +
                        newServerList[index][j].downTime * w3
                }
                // sort each region descendingly by the quality
                newServerList[index].sort(
                    (a: any, b: any) => b.quality - a.quality
                )
            }
            finalList[i] = []
            for (let j = 0; j < initialNumChunks; j++) {
                finalList[i].push([
                    newServerList[index][j].serverId,
                    Math.round((avgList[j] * fileSize) / qSum),
                ])
                if (finalList[i][j][1] > newServerList[index][j].storage) {
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
                    newServerList[index][j].storage -= finalList[i][j][1]
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
            for (let i = 0; i < newServerList.length; i++) {
                for (let j = 0; j < newServerList[i].length; j++) {
                    newServerList[i][j].storage =
                        newServerList[i][j].currStorage
                }
            }
        }
        //can u put newserverlist back to it's original stuff
        //how?
        // option 1 make a copy and just set it to that
        // option 2 add the subtracted value from finallist back to newserverlist
        // option 3 copy it from serverList
        //option 2 looks the best!!!!!!!
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
