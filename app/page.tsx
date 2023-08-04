import { PoolConnection } from "mariadb";
import styles from "./page.module.scss";

import DBConnection from "../lib/DBConnection";
import Logger from "../lib/Logger";

const noteId = 1;
const tableName = "Notes";

const defaultNoteContent = "\"Your note here\"";

export const revalidate = 0;  // don't cache this page!

export default async function Home({}) {
    Logger.info("Home - visited");

    let noteQueryResult: Array<{NoteId: number, Content: string}>;
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
        noteQueryResult = await dbConn.query(`SELECT * FROM ${tableName} WHERE NoteID = ${noteId}`);
        Logger.info(`Home - retrieved note content for note ${noteId} from table ${tableName}`);
        if (noteQueryResult[0]?.Content) {
            usNoteContent = noteQueryResult[0].Content;
        } else {
            await dbConn.query(`INSERT INTO ${tableName} (NoteID, Content) VALUES (${noteId}, ${defaultNoteContent})`);
            usNoteContent = defaultNoteContent;
            Logger.info(`Home - saved default note content into note ${noteId} from table ${tableName}`);
        }
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
            <h2>Welcome to Stoats Notes!  I&apos;m testing a change!!!</h2>
            <form>
                <textarea id={styles["note"]} name="note" defaultValue={usNoteContent}>
                </textarea>
                <br />
                <span id={styles["save-message"]}></span>
            </form>
            <script defer src="/page.js" />
        </main>
    );
}
