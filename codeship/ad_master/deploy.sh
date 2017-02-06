#!/bin/bash
#
# Build instructions for ap_master branch

# Move around the environment files on Codeship
#

# Sync files
# --delete will remove untracked files
# --exclude "path/to/exclude/directory" will exclude files in directory from sync recursively
rsync -az --delete -e "ssh" ~/clone/app/ root@aigachu.com:/root/apps/discord/sorabot
