import { Sequelize } from 'sequelize'
import BackupCreator from './backup'
import ChunkCreator from './chunk'
import ClientCreator from './client'
import FileCreator from './file'
import ServerCreator from './server'
// const mysql = require('mysql2/promise')
export default function (dbName: any) {
    // // create db if it doesn't already exist
    // const { host, port, user, password, database } = config.database
    // const connection = await mysql.createConnection({
    //     host,
    //     port,
    //     user,
    //     password,
    // })
    // await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)
    const dbUsername: any = process.env.STORIT_DB_USER
    const dbPassword: any = process.env.STORIT_DB_PASS
    const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
        host: 'localhost',
        dialect:
            'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
        logging: false,
    })
    const Backup = BackupCreator(sequelize)
    const Chunk = ChunkCreator(sequelize)
    const Client = ClientCreator(sequelize)
    const File = FileCreator(sequelize)
    const Server = ServerCreator(sequelize)

    File.hasMany(Chunk, {
        foreignKey: { allowNull: false },
        onDelete: 'CASCADE',
    })
    Chunk.belongsTo(File)

    Server.hasMany(Chunk, {
        foreignKey: { allowNull: false },
        onDelete: 'CASCADE',
    })
    Chunk.belongsTo(Server)

    Chunk.hasMany(Backup, {
        foreignKey: { allowNull: false },
        onDelete: 'CASCADE',
    })
    Backup.belongsTo(Chunk)

    Chunk.hasOne(Backup, {
        foreignKey: { allowNull: false, name: 'BackupChunkId' },
        onDelete: 'CASCADE',
    })
    Backup.belongsTo(Chunk)

    // await sequelize.sync()
    return {
        Backup,
        Chunk,
        Client,
        File,
        Server,
        sequelize,
    }
}
