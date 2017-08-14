#!/bin/bash
#
# Copy settings to the live environnement.

for maiden in ../node/app/maidens/*/ ; do
	m=$(basename $maiden)
	# Deploy Settings.
	scp -r ../node/app/maidens/$m/settings.js aigachu@138.197.174.254:~/nodejs/apps/discord-maidens/node/app/maidens/$m/settings.js
done