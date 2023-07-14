import process from "process";
import pino from "pino";

// const Logger = pino();

                                    
import fs from "fs";

const fileName = "logs/log.txt";
const Logger = {
    warn: (input: string) => fs.appendFileSync(fileName, input),
    info: (input: string) => fs.appendFileSync(fileName, input),
    error: (input: string) => fs.appendFileSync(fileName, input),
};


// Nice exit handling (logs uncaught errors!)
// Taken from: https://blog.heroku.com/best-practices-nodejs-errors
const exitHandler = (code: number, reason: string) => (err: Error) => {
    if (err && err instanceof Error) {
        Logger.error((new Error(`exitError ${code}: ${reason}`)).toString()); //, {cause: err}))
    }

    // server.close(() => process.exit(code))  // attempt graceful shutdown
    setTimeout(() => process.exit(code), 500).unref();  /* if not shutdown in 0.5 seconds, just kill it (unref detaches the reference to this timer,
                                                            which would normally keep the process open, so that server.close() can kill the process itself) */
};
process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
process.on("SIGTERM", exitHandler(0, "SIGTERM"));
process.on("SIGINT", exitHandler(0, "SIGINT"));


export default Logger;
