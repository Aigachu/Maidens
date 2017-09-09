#!/usr/bin/env bash

cd ./app/maidens/mikuchu/src/mikuchudiscord/commands;

for maiden in ../../../../* ; do
	m=$(basename ${maiden})

	if [ ${m} != "mikuchu" ]; then
	    echo "Symlinking commands from ${m} to mikuchu..."
        # Symlink all commands.
        ln -s ../../../../${m}/src/${m}discord/commands/* ./
        echo "Done."
        echo "----------------------------------------"
	fi
done