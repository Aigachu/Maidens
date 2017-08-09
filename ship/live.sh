#!/bin/bash
#
# Build instructions for live environnement

# Clone repository if not present.
# Generate ssh key for aigachu user and put it in github.
ssh aigachu@138.197.174.254 'cd nodejs/apps; git clone git@github.com:Aigachu/discord-maidens.git'

# Make sure dependencies are installed.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; npm install;'

# Alert for settings.
# DO NOT track settings for each bot.
# Different environnements will have different settings and because github is public,
# people will have access to their tokens. You do NOT want that to happen!
ssh aigachu@138.197.174.254 'echo "Make sure settings.js is set for all maidens."'

# Stop any bot processes that may currently be running.
ssh aigachu@138.197.174.254 'forever stopall;'

# Checkout the proper branch and pull latest changes.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git checkout live; git pull;'

# Summon the bots.
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; forever start summon.js;'