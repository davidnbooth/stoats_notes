import { createPool, PoolConnection } from "mariadb";

const defaultTableName = 'Notes';
const dbHosts = {"development": "localhost", "production": "stoatsnotes.db"};

let defaultConnection: PoolConnection;


const dbConnection = {
    makeNewConnectionWithTable: async (mode: "development"|"production", secrets: {sql_user: string, sql_password: string}, tableName: string): Promise<PoolConnection> => {
        const dbHost = dbHosts[mode];
        const pool = await createPool({
            host: dbHost,
            user: secrets.sql_user,
            password: secrets.sql_password,
            database: 'stoats'
        });
        const connection = await pool.getConnection();
        await connection.query(`CREATE TABLE IF NOT EXISTS ${defaultTableName} (NoteID INT PRIMARY KEY, Content TEXT)`);
        return connection
    },

    getConnection: async (mode: "development"|"production", secrets: {sql_user: string, sql_password: string}) => {
        if (defaultConnection) {
            return defaultConnection;
        }

        defaultConnection = await dbConnection.makeNewConnectionWithTable(mode, secrets, defaultTableName);
        return defaultConnection
    },

}

export default dbConnection;
