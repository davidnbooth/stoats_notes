const mariadb = require("mariadb");
const fs = require("fs");
const os = require("os");

/*
    * This script creates the tables for the database.
    * It is run once when the server is first set up.
    * It will overwrite existing tables
    * It is not run when the server is started normally
    * The database "stoats" must already exist
*/

const mode = "development";

const dbHosts = {"development": "localhost", "production": "stoatsnotes.db"};
const secrets = JSON.parse(fs.readFileSync("secrets.json").toString());
const defaultMode = os.hostname().includes("nfshost") ? "production" : "development";

const dbHost = dbHosts[mode || defaultMode];

const pool = mariadb.createPool({
    host: dbHost,
    user: secrets.sql_user,
    password: secrets.sql_password,
    database: "stoats"
});

const schemas = {
    notes: [{id: "VARCHAR(36) PRIMARY KEY"}]
};

(async () => {
    const connection = await pool.getConnection();
    await connection.query("DROP DATABASE IF EXISTS stoats");
    await connection.query("CREATE DATABASE stoats");
    await connection.query("USE stoats");

    for (const table in schemas) {
        const tableDescription = schemas[table].reduce((acc, curr) => {
            return acc + Object.keys(curr)[0] + " " + Object.values(curr)[0] + ", ";
        }, "").slice(0, -2);

        await connection.query(`CREATE TABLE ${table} (${tableDescription})`);
    }


    // make a note
    // const crypto = require("crypto");
    // const noteId = crypto.randomUUID();
    // await connection.query(`INSERT INTO notes (id) VALUES ('${noteId}')`);
    // fs.writeFileSync(`notes/${noteId}`, "");

    await connection.end();
})().then(()=>{
    process.exit();
});

