import DBConnection from "../../../lib/DBConnection";
import Logger from "../../../lib/Logger";
import fs from "fs";

const tableName = "notes";

export async function POST(request: Request) {
    const body = await request.json();
    const usNoteContent = body.note;
    Logger.info("Note save request received");

    const dbConn = await DBConnection.getConnection();
    try {
        // await dbConn.query(`UPDATE ${tableName} SET Content = '${usNoteContent}' WHERE NoteID = ${noteId}`);
        const notes = await dbConn.query(`SELECT * FROM ${tableName}`);
        const noteId = notes[0].id;
        fs.writeFileSync(`notes/${noteId}`, usNoteContent);

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