import DBConnection from "../../../lib/DBConnection";
import Logger from "../../../lib/Logger";

const tableName = "Notes";
const noteId = 1;

export async function POST(request: Request) {
    const body = await request.json();
    const usNoteContent = body.note;
    Logger.info("Note save request received");

    const dbConn = await DBConnection.getConnection();
    try {
        await dbConn.query(`UPDATE ${tableName} SET Content = '${usNoteContent}' WHERE NoteID = ${noteId}`);
    } catch (err) {
        const newErr = new Error("Error in note save request", {cause: err});
        Logger.error(newErr);
        throw newErr;
    } finally {
        if (dbConn)
            dbConn.release();
    }
    Logger.info("Note saved in db");

    return new Response(usNoteContent);
}