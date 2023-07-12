import { createPool, PoolConnection, PoolConfig } from "mariadb";
import fs from "fs";
import os from "os";

const dbHosts = {"development": "localhost", "production": "stoatsnotes.db"};

const defaultTableName = "Notes";
const defaultSecrets = JSON.parse(fs.readFileSync("secrets.json").toString());
const defaultMode = os.hostname().includes("nfshost") ? "production" : "development";

let defaultConnection: PoolConnection;


const DBConnection = {
    makeNewConnectionWithTable: async (mode?: "development"|"production", secrets?: {sql_user: string, sql_password: string}, tableName?: string): Promise<PoolConnection> => {
        const dbHost = dbHosts[mode || defaultMode];

        const connectionOptions: PoolConfig = {
            host: dbHost,
            user: secrets ? secrets.sql_user : defaultSecrets.sql_user,
            password: secrets ? secrets.sql_password : defaultSecrets.sql_password,
            database: "stoats"
        };

        console.log(JSON.stringify(connectionOptions));
        const pool = await createPool(connectionOptions);
        const connection = await pool.getConnection();
        await connection.query(`CREATE TABLE IF NOT EXISTS ${tableName || defaultTableName} (NoteID INT PRIMARY KEY, Content TEXT)`);
        return connection;
    },

    getConnection: async (mode?: "development"|"production", secrets?: {sql_user: string, sql_password: string}) => {
        if (defaultConnection) {
            return defaultConnection;
        }

        defaultConnection = await DBConnection.makeNewConnectionWithTable(mode, secrets, defaultTableName);
        return defaultConnection;
    },

};

export default DBConnection;
