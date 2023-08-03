import DBConnection from "../../../lib/DBConnection";
import Logger from "../../../lib/Logger";

const tableName = "Notes";
const noteId = 1;

export async function POST(request: Request) {
    const body = await request.json();
    const usNoteContent = body.note;
    Logger.info("Note save request received");

    const db = await DBConnection.getConnection();
    try {
        await db.query(`UPDATE ${tableName} SET Content = '${usNoteContent}' WHERE NoteID = ${noteId}`);
    } catch (err) {
        const newErr = new Error("Error in note save request", {cause: err});
        Logger.error(newErr);
        throw newErr;
    }
    Logger.info("Note saved in db");

    return new Response(usNoteContent);
}