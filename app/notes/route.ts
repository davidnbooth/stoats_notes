import DBConnection from '../../lib/DBConnection'
import Logger from '../../lib/Logger'

const tableName = "Notes"
const noteId = 1;

export async function POST(request: Request) {
    const body = await request.json();
    const usNoteContent = body.note;

    const db = await DBConnection.getConnection();
    await db.query(`UPDATE ${tableName} SET Content = '${usNoteContent}' WHERE NoteID = ${noteId}`);
    Logger.info(`note saved at ${(new Date()).toISOString()}`);

    return new Response(usNoteContent);
}