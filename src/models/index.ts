import { Sequelize } from 'sequelize'
import BackupCreator from './backup'
import ChunkCreator from './chunk'
import ClientCreator from './client'
import FileCreator from './file'
import ServerCreator from './server'
export default function () {
    const sequelize = new Sequelize('database', 'username', 'password', {
        database: 'StorIt',
        username: process.env.STORIT_DB_PASS,
        password: process.env.STORIT_DB_PASS,
        host: 'localhost',
        dialect:
            'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    })
    const Backup = BackupCreator(sequelize)
    const Chunk = ChunkCreator(sequelize)
    const Client = ClientCreator(sequelize)
    const File = FileCreator(sequelize)
    const Server = ServerCreator(sequelize)

    File.hasMany(Chunk)
    Chunk.belongsTo(File)

    Server.hasMany(Chunk)
    Chunk.belongsTo(Server)

    Chunk.hasMany(Backup)
    Backup.belongsTo(Chunk)

    sequelize.sync()
    return {
        Backup,
        Chunk,
        Client,
        File,
        Server,
        sequelize,
    }
}
