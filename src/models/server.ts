import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface ServerInstance extends Model {
    Id: string
    uId: string
    name: string
    storage: bigint
    availableStorage: bigint
    location: string
    status: string
    totalDownTime: number
    currentDownTime: number
    lastChecked: Date
}
export default function (sequelize: Sequelize): ModelCtor<ServerInstance> {
    return sequelize.define('Server', {
        Id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        uId: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        storage: {
            type: DataTypes.BIGINT,
        },
        availableStorage: {
            type: DataTypes.BIGINT,
        },
        location: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        totalDownTime: {
            type: DataTypes.INTEGER,
        },
        currentDownTime: {
            type: DataTypes.INTEGER,
        },
        lastChecked: {
            type: DataTypes.DATE,
        },
    })
}
// 'Create table IF NOT EXISTS Server(' +
//         'serverId varchar(100),' +
//         'uId VARCHAR(50),' +
//         'name VARCHAR(50),' +
//         'storage bigint, ' +
//         'availableStorage bigint,' +
//         'location VARCHAR(50), ' +
//         'status VARCHAR(50),' +
//         'totalDownTime int,' +
//         'currentDownTime int,' +
//         'lastChecked timestamp,' +
//         'PRIMARY KEY (serverId)' +
//         ');'
