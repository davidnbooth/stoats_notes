import { createPool, Pool, PoolConfig } from "mariadb";
import fs from "fs";
import os from "os";

const dbHosts = {"development": "localhost", "production": "stoatsnotes.db"};

const defaultSecrets = JSON.parse(fs.readFileSync("secrets.json").toString());
const defaultMode = os.hostname().includes("nfshost") ? "production" : "development";

let defaultPool: Pool;


const DBConnection = {
    makeNewPool: async (mode?: "development"|"production", secrets?: {sql_user: string, sql_password: string}): Promise<Pool> => {
        const dbHost = dbHosts[mode || defaultMode];

        const connectionOptions: PoolConfig = {
            host: dbHost,
            user: secrets ? secrets.sql_user : defaultSecrets.sql_user,
            password: secrets ? secrets.sql_password : defaultSecrets.sql_password,
            database: "stoats"
        };

        const pool = await createPool(connectionOptions);
        return pool;
    },

    getConnection: async (mode?: "development"|"production", secrets?: {sql_user: string, sql_password: string}) => {
        if (!defaultPool)
            defaultPool = await DBConnection.makeNewPool(mode, secrets);

        const connection = await defaultPool.getConnection();
        return connection;
    },

};

export default DBConnection;
