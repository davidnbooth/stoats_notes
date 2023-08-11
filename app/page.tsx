import { PoolConnection } from "mariadb";
import styles from "./page.module.scss";

import DBConnection from "../lib/DBConnection";
import Logger from "../lib/Logger";
import fs from "fs";

const tableName = "notes";

const defaultNoteContent = "File created by Stoats Notes";

export const revalidate = 0;  // don't cache this page!

export default async function Home({}) {
    Logger.info("Home - visited");

    let noteQueryResult: Array<{id: number}>;
    let usNoteContent: string;
    
    // Open a connection to the database
    let dbConn: PoolConnection;
    try {
        dbConn = await DBConnection.getConnection();
        Logger.info("Home - connected to DB");
    } catch (err) {
        const newErr = new Error("Home - error connecting to DB", {cause: err});
        Logger.error(newErr);
        throw newErr;
    }

    // Get the note content, or create it using the default content if it doesn't exist
    try {
        noteQueryResult = await dbConn.query(`SELECT * FROM ${tableName}`);
        const noteId = noteQueryResult[0]?.id;
        Logger.info(`Home - retrieved note content for note ${noteId} from table ${tableName}`);

        if (!fs.existsSync(`notes/${noteId}`)) {
            fs.writeFileSync(`notes/${noteId}`, defaultNoteContent);
            Logger.info(`Home - saved default note content into note ${noteId} from table ${tableName}`);
        }

        usNoteContent = fs.readFileSync(`notes/${noteId}`, "utf-8");

    } catch (err) {
        const newErr = new Error("Home - error querying for note content", {cause: err});
        Logger.error(newErr);
        throw newErr;
    } finally {
        if (dbConn)
            dbConn.release();
    }

    Logger.info("Home - established note content, rendering view");

    return (
        <main>
            <h2>Welcome to Stoats Notes!!</h2>
            <form>
                <textarea id={styles["note"]} name="note" defaultValue={usNoteContent}>
                </textarea>
                <br />
                <span id={styles["save-message"]}></span>
            </form>
            <script
                id="note-page-js"
                defer
                src="/page.js"
                data-textarea-id={styles["note"]}
                data-saving-style={styles["saving"]}
                data-saved-style={styles["saved"]}
                data-error-style={styles["error"]}
                data-editing-style={styles["editing"]}
            />
        </main>
    );
}
