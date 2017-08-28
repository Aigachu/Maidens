#!/bin/bash
#
# Build instructions for live environnement
# 

# Stop any bot processes that may currently be running.
ssh aigachu@138.197.174.254 'forever stopall;'

# Clone repository if not present.
# Generate ssh key for aigachu user and put it in github.
ssh aigachu@138.197.174.254 'cd nodejs/apps; git clone git@github.com:Aigachu/discord-maidens.git'

# Prune origin first
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git remote prune origin;'

# Checkout the proper.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git checkout live;'

# Pull latest changes.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git pull;'

# Make sure dependencies are installed.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; npm install;'

# Alert for settings.
# DO NOT track settings for each bot.
# Different environnements will have different settings and because github is public,
# people will have access to their tokens. You do NOT want that to happen!
ssh aigachu@138.197.174.254 'echo "Make sure settings.js is set for all maidens."'

# Summon the bots.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; forever start summon.js;'