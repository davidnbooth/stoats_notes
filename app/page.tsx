import styles from './page.module.scss'

import DBConnection from '../lib/DBConnection'
import Logger from '../lib/Logger'

const noteId = 1;
const tableName = 'Notes';

export default async function Home({}) {
    const db = await DBConnection.getConnection("development")
    
    const noteQueryResult = await db.query(`SELECT * FROM ${tableName} WHERE NoteID = ${noteId}`);

    let noteContent = '"Your note here"';
    if (!noteQueryResult[0]?.Content) {
        await db.query(`INSERT INTO ${tableName} (NoteID, Content) VALUES (${noteId}, ${noteContent})`);
    } 

    noteContent = noteQueryResult[0].Content;

    return (
        <main>
            <h2>Welcome to Stoats Notes!</h2>
            <form>
                <textarea id={styles["note"]} name="note" defaultValue={noteContent}>
                </textarea>
                <br />
                <button id={styles["note-save"]} type="button">Save</button><span id={styles["save-message"]}></span>
            </form>
            <script src="/page.js" />
        </main>
    )
}
