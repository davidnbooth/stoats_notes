# stoats_notes
Barebones notes app


**Versions used:**
node 16.18.1
mariadb 10.6


**To set up for the first time:**
```
npm install
```
Install mariadb, or get the connection info for an existing deployment.  
Put a file in the root of the project workspace that looks like this:

secrets.json
```
{
    "sql_password": "<MY_SQL_PASSWORD>",
    "sql_user": "<MY_SQL_USERNAME>"
}
```
Make sure the user you're using can create, edit, and read tables and their data.
Make sure the MariaDB has a database called `stoats`.


**To run:**
```
npm run dev
```
Then you can open localhost:3000


**To debug:**
Start the launch process in vscode.


**To run not-as-debug:**
`npm run build`
`npm run start`

## How to deploy on NearlyFreeSpeech
`git remote -v` to see remotes verbosely.  
You can see the name of the nearlyfreespeech one.  
`git push <remote_name>`
  
ssh into the server.  
`cd /home/protected`. 
The new code will already be here from the push.
`npm install` (if needed)
`npm run build`

On the NFS console:
restart the daemon