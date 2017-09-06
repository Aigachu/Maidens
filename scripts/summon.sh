# Re-Summon maidens.
echo "Re-summoning the Maidens on the live environnement."
ssh aigachu@138.197.174.254 'forever stopall;'
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; forever start summon.js;'
echo "Script execution done successfully."