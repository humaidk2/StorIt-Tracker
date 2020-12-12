import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface FileInstance extends Model {
    fileId: string
}
export default function (sequelize: Sequelize): ModelCtor<FileInstance> {
    return sequelize.define<FileInstance>('File', {
        fileId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    })
}

// 'Create table IF NOT EXISTS File(' +
//     'fileId int AUTO_INCREMENT, ' +
//     'uid VARCHAR(50), ' +
//     'PRIMARY KEY (FileId) ' +
//     ');'
