export function checkFileFitPossible(
    serverList: any,
    regions: any,
    fileSize: number
): boolean {
    const sumRegion: any = {}
    // iterate user defined regions
    for (let i = 0; i < regions.length; i++) {
        sumRegion[regions[i]] = 0
    }

    // sum up storage in each region
    for (let i = 0; i < serverList.length; i++) {
        sumRegion[serverList[i].region] += serverList[i].storage
    }
    // ensure file can be stored for every selected region
    for (let i = 0; i < regions.length; i++) {
        sumRegion[regions[i]] -= fileSize
        if (sumRegion[regions[i]] < 0) {
            return false
        }
    }
    return true
}
export function initializeNumberOfChunks(
    serverList: any,
    fileSize: number
): number {
    let initialNumChunks = 0
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
    return initialNumChunks
}

export function calculateQuality(
    serverList: any,
    w1: number,
    w2: number,
    w3: number
): void {
    serverList.forEach((server: any) => {
        server.quality =
            server.distance * w1 + server.newStorage * w2 + server.downTime * w3
    })
}
export function sortServers(serverList: any, property: string): void {
    serverList.sort((a: any, b: any) => b[property] - a[property])
}

export function getMinRegionLength(serverList: any): number {
    let minRegionLength = 100000000
    for (const region in serverList) {
        if (serverList[region].length < minRegionLength) {
            minRegionLength = serverList[region].length
        }
    }
    return minRegionLength
}
export function getAvgQuality(
    serverList: any,
    minRegionLength: number
): number[] {
    const avgList = []
    for (let i = 0; i < minRegionLength; i++) {
        let avg = 0
        let serverListLength = 0
        for (const region in serverList) {
            avg += serverList[region][i].quality
            serverListLength++
        }
        avg /= serverListLength
        for (const region in serverList) {
            serverList[region][i].averageQuality = avg
        }
        avgList.push(avg)
    }
    return avgList
}

export function resetUsedStorage(serverList: any): void {
    for (const region in serverList) {
        for (let j = 0; j < serverList[region].length; j++) {
            serverList[region][j].storage = serverList[region][j].currStorage
        }
    }
}
