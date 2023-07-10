import dbAccess from '../../lib/dbAccess'

const tableName = "Notes"
const noteId = 1;

export async function POST(request: Request) {
    const body = await request.json();
    const noteContent = body.note;

    const db = await dbAccess.getConnection("development", {sql_user: "davidnbooth", sql_password:"joecoolsunset"})
    await db.query(`UPDATE ${tableName} SET Content = '${noteContent}' WHERE NoteID = ${noteId}`);

    return new Response(noteContent)
}