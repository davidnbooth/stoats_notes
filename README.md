# stoats_notes
Barebones notes app


idk how to organize the folders yet


node 18


to set up:
```
npm install
```


To run:
```
node server.js
```
and open index.html


wanna do the joel spolsky hungarian thing for safe and unsafe strings




db:

I installed mysql and mysql workbench
in mysql workbench:
```
SHOW DATABASES
CREATE DATABASE stoats
USE stoats
CREATE TABLE Notes (
    NoteID int,
    Content varchar(10000)
)
```