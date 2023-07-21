import { PoolConnection } from "mariadb";
import styles from "./page.module.scss";

import DBConnection from "../lib/DBConnection";
import Logger from "../lib/Logger";

const noteId = 1;
const tableName = "Notes";

export default async function Home({}) {
    Logger.info("Home - visited");
    let db: PoolConnection;
    try {
        db = await DBConnection.getConnection();
    } catch (err) {
        const newErr = new Error("Home - error connecting to DB", {cause: err});
        Logger.error(newErr);
        throw newErr;
    }
    Logger.info("Home - connected to DB");
    
    let noteQueryResult: any;  // TODO
    try {
        noteQueryResult = await db.query(`SELECT * FROM ${tableName} WHERE NoteID = ${noteId}`);
    } catch (err) {
        const newErr = new Error("Home - error querying DB for note content", {cause: err});
        Logger.error(newErr);
        throw newErr;
    }

    let usNoteContent = "\"Your note here\"";
    if (!noteQueryResult[0]?.Content) {
        await db.query(`INSERT INTO ${tableName} (NoteID, Content) VALUES (${noteId}, ${usNoteContent})`);
    } 
    usNoteContent = noteQueryResult[0].Content;
    Logger.info("Home - established note content, rendering view");

    return (
        <main>
            <h2>Welcome to Stoats Notes!</h2>
            <form>
                <textarea id={styles["note"]} name="note" defaultValue={usNoteContent}>
                </textarea>
                <br />
                <button id={styles["note-save"]} type="button">Save</button><span id={styles["save-message"]}></span>
            </form>
            <script defer src="/page.js" />
        </main>
    );
}
