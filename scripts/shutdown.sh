# Shut down maidens.
echo "Shutting down the Maidens on the live environnement."
ssh aigachu@138.197.174.254 'forever stopall;'
echo "Script execution done successfully."