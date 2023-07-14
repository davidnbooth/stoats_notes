import process from "process";
import pino from "pino";
import fs from "fs";
// const Logger = pino();

const fileName = "logs/log.log";

/**
 * makes an error object (potentially with nested "cause" objects) into one big string
 * @param {Error} error the error object 
 * @param {number} [recursionLevel] internal use for recursion, should be zero or undefined when you call this
 * @returns {string}
 */
const errorStringAssembler = (error: Error, recursionLevel?: number) => {
    recursionLevel = recursionLevel || 0;
    let outString = "";

    // If we called this recursively (to handle error causes) these strings are used for the formatting
    const indentation = "\t".repeat(recursionLevel);
    const stringStart = recursionLevel ? "\n" + indentation + "-> cause: " : "";

    // Default output for any non-errors or errors without a stack
    if (!error.stack) {
        outString += error.message;

    // If we have a stack, print it with formatting.  We don't need to print the level/message because the stack will include it
    } else {
        outString += `${stringStart}${error.stack.replace(/\n/g, "\n" + indentation)}`;
    }

    // Recursive call for handling Error causes
    if (error.cause) {
        outString += errorStringAssembler(error.cause, recursionLevel + 1);
    }
    return outString;
};


const logMessage = (input: string | Error, level: "INFO"|"WARN"|"ERROR") => {
    const constantLengthLevel = level !== "ERROR" ? level + "-" : level;
    const startString = `${constantLengthLevel}-${(new Date()).toISOString()}- `;
    const message = input instanceof Error ? errorStringAssembler(input) : input;
    const output = startString + message + "\n";
    fs.appendFileSync(fileName, output);
};

const Logger = {
    warn: (input: string | Error) => {
        logMessage(input, "WARN");
    },
    info: (input: string | Error) => {
        logMessage(input, "INFO");
    },
    error: (input: string | Error) => {
        logMessage(input, "ERROR");
    },
};


// Nice exit handling (logs uncaught errors!)
// Taken from: https://blog.heroku.com/best-practices-nodejs-errors
const exitHandler = (code: number, reason: string) => (err: Error) => {
    if (err && err instanceof Error) {
        Logger.error((new Error(`exitError ${code}: ${reason}`, {cause: err})));
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
