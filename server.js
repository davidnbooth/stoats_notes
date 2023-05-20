const fs = require('fs');
const express = require('express'); 
const mysql = require('mysql2/promise');

const app = express();
const expressPort = 3000;
const noteId = 1;
const tableName = 'Notes';

const secrets = JSON.parse(fs.readFileSync('secrets.json').toString());

const mode = "production"; // "development" or "production"

const dbHost = mode === "production" ? "stoatsnotes.db" : "localhost";
const dbUser = mode === "production" ? "davidnbooth" : "root";

async function main() {
    ////// Set up MySQL /////
    const connection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: secrets.sql_password,
        database: 'stoats'
    })
    await connection.connect()


    ////// Set up Express /////
    // Body parsing middleware
    app.use(express.json());       
    app.use(express.urlencoded({extended: true}));

    // Logging middleware
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // CORS middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });


    ////// Set up routes /////
    app.get("/" , (req, res) => {
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stoats Notes</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
        }
        textarea {
            width: 80%;
            height: 500px;
            border: 1px solid #ccc;
            padding: 10px;
            font-size: 16px;
        }
        button {
            padding: 10px;
            font-size: 16px;
            background: #333;
            color: #fff;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h2>Welcome to Stoats Notes!</h2>
    <form>
        <textarea id="note" name="note">

        </textarea>
        <br>
        <button id="note-save" type="button">Save</button><span id="save-message"></span>
    </form>
    <script>
        fetch("http://localhost:3000/note")
        .then(res => res.json())
        .then(data => {
            document.getElementById("note").value = data.noteContent;
        });

        document.getElementById("note-save").addEventListener("click", (event) => {
            event.preventDefault();
            const note = document.getElementById("note").value;
            fetch("http://localhost:3000/note", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({note})
            }).then(res => {
                if (res.ok) {
                    document.getElementById("save-message").innerHTML = "Note saved!";
                    setTimeout(() => {
                        document.getElementById("save-message").innerHTML = "";
                    }, 3000);
                } else {
                    document.getElementById("save-message").innerHTML = "An unexpected error occurred.";
                    setTimeout(() => {
                        document.getElementById("save-message").innerHTML = "";
                    }, 10000);
                }
            });
        })
    </script>
</body>
</html>
`
        )
    });
    app.get('/note', async (req, res) => {
        const noteQueryResult = await connection.query(`SELECT * FROM ${tableName} WHERE NoteID = ${noteId}`);

        let noteContent = 'Your note here';
        if (noteQueryResult[0].length === 0) {
            await connection.query(`INSERT INTO ${tableName} (NoteID, Note) VALUES (${noteId}, ${noteContent})`);
        } 

        noteContent = noteQueryResult[0][0].Content;
        
        res.send({noteContent})
    });

    app.post('/note', async (req, res) => {
        const uNote = req.body.note;
        note = uNote;
        await connection.query(`UPDATE ${tableName} SET Content = '${uNote}' WHERE NoteID = ${noteId}`);

        res.send(204);
    });


    ////// Start server /////
    app.listen(expressPort, () => console.log(`Listening on port ${expressPort}`));
}

main();
