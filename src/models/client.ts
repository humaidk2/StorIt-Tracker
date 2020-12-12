import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface ClientInstance extends Model {
    uid: string
    location: string
}
export default function (sequelize: Sequelize): ModelCtor<ClientInstance> {
    return sequelize.define<ClientInstance>('Client', {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        location: {
            type: DataTypes.STRING,
        },
    })
}

// Create table IF NOT EXISTS Client(' +
//         'uid VARCHAR(50), ' +
//         'location VARCHAR(50), ' +
//         'PRIMARY KEY (uid) ' +
//         ');'
