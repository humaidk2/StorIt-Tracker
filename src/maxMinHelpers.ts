export function getMax(list: any, property: string, region: string): number {
    let max = 0
    for (let i = 0; i < list.length; i++) {
        if (list[i].region === region) {
            if (list[i][property] > max) {
                max = list[i][property]
            }
        }
    }
    return max
}
export function getMin(list: any, property: string, region: string): number {
    let min = list[0][property] || 0
    for (let i = 0; i < list.length; i++) {
        if (list[i].region === region) {
            if (list[i][property] < min) {
                min = list[i][property]
            }
        }
    }
    return min
}

export function reRange(
    serverList: any,
    maxValue: number,
    minValue: any,
    property: string
): void {
    // normalize all the data to between 0 and 100
    const newMin = 1,
        newMax = 100
    const oldRange = maxValue - minValue
    const newRange = newMax - newMin
    serverList.forEach((server: any) => {
        if (oldRange === 0) {
            if (property !== 'storage') {
                server[property] = minValue
            } else {
                server['newStorage'] = minValue
            }
        } else {
            if (property !== 'storage') {
                server[property] =
                    ((server[property] - minValue) * newRange) / oldRange +
                    newMin
            } else {
                server['newStorage'] =
                    ((server[property] - minValue) * newRange) / oldRange +
                    newMin
            }
        }
    })
}
export function reRangeInverse(
    serverList: any,
    maxValue: any,
    minValue: any,
    property: string
): void {
    // normalize all the data to between 0 and 100
    const newMin = 1,
        newMax = 100
    const oldRange = maxValue - minValue
    const newRange = newMax - newMin
    serverList.forEach((server: any) => {
        if (oldRange === 0) server[property] = minValue
        else {
            server[property] =
                ((server[property] - minValue) * newRange) / oldRange + newMin

            server[property] = newMax - server[property] + 1
        }
    })
}
