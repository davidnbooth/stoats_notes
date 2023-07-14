import DBConnection from "../../lib/DBConnection";
import Logger from "../../lib/Logger";

const tableName = "Notes";
const noteId = 1;

export async function POST(request: Request) {
    const body = await request.json();
    const usNoteContent = body.note;
    Logger.info(`${(new Date()).toISOString()}: Note save request recieved`);

    const db = await DBConnection.getConnection();
    try {
        await db.query(`UPDATE ${tableName} SET Content = '${usNoteContent}' WHERE NoteID = ${noteId}`);
    } catch (err) {
        const newErr = new Error(`${(new Date()).toISOString()}: Error in note save request`, {cause: err});
        Logger.error(newErr.toString());
        throw newErr;
    }
    Logger.info(`${(new Date()).toISOString()}: Note saved in db`);

    return new Response(usNoteContent);
}