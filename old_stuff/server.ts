// Node
import fs from "fs";
import os from "os";

// npm
import Next from "next";

// Local
import dbAccess from "./dbAccess";
const secrets = JSON.parse(fs.readFileSync('secrets.json').toString());


///// Initialize Server Things /////
const logger = {
    error: console.error,
    warn: console.warn,
    info: console.log
}
const next = Next({dev: process.env.NODE_ENV !== "production"});


///// Set up environment - needs to be modified if run in new environments /////
const mode = os.hostname().includes("nfshost") ? "production" : "development";
const noteId = 1;


async function main() {
    await dbAccess.initDB(mode, secrets);
    await next.prepare();

    // Nice exit handling (logs uncaught errors!)
    // Taken from: https://blog.heroku.com/best-practices-nodejs-errors
    const exitHandler = (code: number, reason: string) => (err: Error) => {
        if (err && err instanceof Error) {
            logger.error(new Error(`exitError ${code}: ${reason}`)) //, {cause: err}))
        }

        // server.close(() => process.exit(code))  // attempt graceful shutdown
        setTimeout(() => process.exit(code), 500).unref()  /* if not shutdown in 0.5 seconds, just kill it (unref detaches the reference to this timer,
                                                                which would normally keep the process open, so that server.close() can kill the process itself) */
    }
    process.on("uncaughtException", exitHandler(1, "Unexpected Error"))
    process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"))
    process.on("SIGTERM", exitHandler(0, "SIGTERM"))
    process.on("SIGINT", exitHandler(0, "SIGINT"))

    /*
    ////// Set up Express /////
    // Body parsing middleware
    app.use(express.json());       
    app.use(express.urlencoded({extended: true}));

    // Logging middleware
    app.use((req, res, next)  => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // CORS middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });


    ////// Set up routes /////
    app.get("/" , (req, res) => {
        res.send(next.getRequestHandler()(req, res))
    });

    app.get('/note', async (req, res) => {
        const noteQueryResult = await connection.query(`SELECT * FROM ${tableName} WHERE NoteID = ${noteId}`);

        let noteContent = '"Your note here"';
        if (!noteQueryResult[0]?.Content) {
            await connection.query(`INSERT INTO ${tableName} (NoteID, Content) VALUES (${noteId}, ${noteContent})`);
        } 

        noteContent = noteQueryResult[0].Content;
        
        res.send({noteContent})
    });

    app.post('/note', async (req, res) => {
        const uNote = req.body.note;
        await connection.query(`UPDATE ${tableName} SET Content = '${uNote}' WHERE NoteID = ${noteId}`);

        res.send(204);
    });


    ////// Start server /////
    const server = app.listen(expressPort, () => console.log(`Listening on port ${expressPort}`));

    */
}

main();
