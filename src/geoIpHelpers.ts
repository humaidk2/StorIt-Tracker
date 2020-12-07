import geoip = require('geoip-lite')
import _ = require('lodash')
export function distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string
) {
    if (lat1 == lat2 && lon1 == lon2) {
        return 0
    } else {
        const radlat1 = (Math.PI * lat1) / 180
        const radlat2 = (Math.PI * lat2) / 180
        const theta = lon1 - lon2
        const radtheta = (Math.PI * theta) / 180
        let dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
        if (dist > 1) {
            dist = 1
        }
        dist = Math.acos(dist)
        dist = (dist * 180) / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == 'K') {
            dist = dist * 1.609344
        }
        if (unit == 'N') {
            dist = dist * 0.8684
        }
        return dist
    }
}

export function getIp(socket: any) {
    let ip = _.has(socket.handshake.address, 'address')
        ? socket.handshake.address.address
        : socket.handshake.address
    // since i have nginx setup i have to use this
    ip = _.has(socket.handshake.headers, 'x-real-ip')
        ? socket.handshake.headers['x-real-ip']
        : socket.handshake.headers['x-forwarded-for']
    return ip
}

export function calculateDistance(
    socketId: string,
    serverSocketId: string,
    io: any
) {
    const socket = io.sockets.connected[socketId]
    const serverSocket = io.sockets.connected[serverSocketId]
    const ip = getIp(socket)
    const serverip = getIp(serverSocket)
    const geo = geoip.lookup(ip) || { ll: [0, 0] }
    const serverGeo = geoip.lookup(serverip) || { ll: [0, 0] }
    const currDistance = distance(
        geo.ll[0],
        geo.ll[1],
        serverGeo.ll[0],
        serverGeo.ll[1],
        'K'
    )
    return currDistance
}

export function convertToContinent(country: string) {
    // prettier-ignore
    const ctryToCnt:any = {"EU":["AD","AL","AT","AX","BA","BE","BG","BY","CH","CZ","DE","DK","EE","ES","EU","FI","FO","FR","FX","GB","GG","GI","GR","HR","HU","IE","IM","IS","IT","JE","LI","LT","LU","LV","MC","MD","ME","MK","MT","NL","NO","PL","PT","RO","RS","RU","SE","SI","SJ","SK","SM","UA","VA"],
    "AS":["AF","AM","AP","AZ","BD","BN","BT","CC","CN","CX","GE","HK","ID","IN","IO","JP","KG","KH","KP","KR","KZ","LA","LK","MM","MN","MO","MV","MY","NP","PH","PK","PS","SG","TH","TJ","TL","TM","TW","UZ","VN"],
    "ME":["BH","CY","EG","IR","IQ","IL","JO","KW","LB","OM","QA","SA","SY","TR","AE","YE"],
    "NA":["AG","AI","AN","AW","BB","BL","BM","BS","BZ","CA","CR","CU","DM","DO","GD","GL","GP","GT","HN","HT","JM","KN","KY","LC","MF","MQ","MS","MX","NI","PA","PM","PR","SV","TC","TT","US","VC","VG","VI"],
    "AF":["AO","BF","BI","BJ","BW","CD","CF","CG","CI","CM","CV","DJ","DZ","EH","ER","ET","GA","GH","GM","GN","GQ","GW","KE","KM","LR","LS","LY","MA","MG","ML","MR","MU","MW","MZ","NA","NE","NG","RE","RW","SC","SD","SH","SL","SN","SO","ST","SZ","TD","TG","TN","TZ","UG","YT","ZA","ZM","ZW"],
    "AN":["AQ","BV","GS","HM","TF"],
    "SA":["AR","BO","BR","CL","CO","EC","FK","GF","GY","PE","PY","SR","UY","VE"],
    "OC":["AS","AU","CK","FJ","FM","GU","KI","MH","MP","NC","NF","NR","NU","NZ","PF","PG","PN","PW","SB","TK","TO","TV","UM","VU","WF","WS"],
    "--":["O1"]};
    for (const continent in ctryToCnt) {
        if (ctryToCnt[continent].indexOf(country) != -1) {
            return continent
        }
    }
    return 'AN'
}

export function getRegion(location: string, io: any) {
    const socket = io.sockets.connected[location]
    const ip = getIp(socket)
    const geo = geoip.lookup(ip) || { country: 'AE' }
    // var serverGeo = geoip.lookup(serverip);
    return convertToContinent(geo.country)
}
