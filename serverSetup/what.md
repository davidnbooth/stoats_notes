The post-recieve hook distributes the new files into the /home/protected directory.

The post-update hook runs the build process for the new files, and then updates a "latestCommit.txt" file when its done.
The daemon that runs the server can watch the latestCommit file for changes and restart itself automatically