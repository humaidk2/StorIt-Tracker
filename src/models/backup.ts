import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface BackupInstance extends Model {
    backupId: string
}

export default function (sequelize: Sequelize): ModelCtor<BackupInstance> {
    return sequelize.define<BackupInstance>('Backup', {
        Id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    })
}

// 'Create table IF NOT EXISTS Backup(' +
//         'backupId int AUTO_INCREMENT,' +
//         'chunkId int,' +
//         'backupChunkId VARCHAR(50), ' +
//         'FOREIGN KEY (chunkId) REFERENCES Chunk(chunkId),' +
//         'PRIMARY KEY (backupId) ' +
//         ');'
