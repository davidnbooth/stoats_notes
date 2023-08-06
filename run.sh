#!/bin/bash
echo "$(date) - run.sh started"
npm run start --run-in-foreground

# Path to the file you want to watch
file_to_watch="/home/protected/latestCommit.txt"

# Get the initial checksum of the file
initial_checksum=$(md5 -q "$file_to_watch")

while true; do
    # Avoid excessive checking
    sleep 5

    # Get the current checksum of the file
    current_checksum=$(md5 -q "$file_to_watch")

    # Compare the current checksum with the initial checksum
    if [ "$current_checksum" != "$initial_checksum" ]; then
        echo "$(date) - File $file_to_watch has changed. Restarting server..."
        npm run start --run-in-foreground

        # Update the initial_checksum to the current_checksum for the next iteration
        initial_checksum="$current_checksum"
    fi
done