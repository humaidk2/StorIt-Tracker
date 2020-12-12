import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface ChunkInstance extends Model {
    chunkId: string
    chunkSize: number
}

export default function (sequelize: Sequelize): ModelCtor<ChunkInstance> {
    return sequelize.define<ChunkInstance>('Chunk', {
        chunkId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        chunkSize: {
            type: DataTypes.INTEGER,
        },
    })
}

// 'Create table IF NOT EXISTS Chunk(' +
//         'chunkId int AUTO_INCREMENT,' +
//         'serverId varchar(100), ' +
//         'fileID int, ' +
//         'chunkSize int, ' +
//         'FOREIGN KEY (serverId) REFERENCES Server(serverId), ' +
//         'FOREIGN KEY (fileId) REFERENCES File(fileId), ' +
//         'PRIMARY KEY (chunkId) ' +
//         // ');'
