#!/bin/bash
#
# Copy settings for all maidens to the live environnement.

for maiden in ../node/app/maidens/*/ ; do
	m=$(basename ${maiden})
	echo "Fetching settings for ${m}..."
	# Deploy Settings.
	scp -r aigachu@138.197.174.254:~/nodejs/apps/discord-maidens/node/app/maidens/${m}/settings.js ../node/app/maidens/${m}/settings.js
	echo "Done."
done