#!/bin/bash
#
# Copy settings for all maidens to the live environnement.

for maiden in ../node/app/maidens/*/ ; do
	m=$(basename ${maiden})
	echo "Deploying settings for ${m}..."
	# Deploy Settings.
	scp -r ../node/app/maidens/${m}/settings.js aigachu@138.197.174.254:~/nodejs/apps/discord-maidens/node/app/maidens/${m}/settings.js
	echo "Done."
done

# Re-Summon maidens.
echo "Re-summoning the Maidens on the live environnement."
ssh aigachu@138.197.174.254 'forever stopall;'
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; forever start summon.js;'
echo "Script execution done successfully."