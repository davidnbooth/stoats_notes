import DBConnection from "../../lib/DBConnection";
import Logger from "../../lib/Logger";


export default async function Home({}) {
    // Uncomment the following lines and run the dev server (npm run dev) to see the error page
    // It won't show up in production, because the error is thrown during the build process
    // const db = await DBConnection.getConnection()
    // await db.query(`INSERT INTOzzzz Notes (NoteID, Content) VALUES (1, "Your note here")`);  // invalid SQL
    Logger.info("Broken page viewed");

    return (
        <main>
            <h2>Welcome to Stoats Notes!</h2>
            <div>
                This is a page for testing errors!
            </div>
        </main>
    );
}
