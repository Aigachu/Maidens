/**
 * === Classes ===
 */

/**
 * === Discord Client Class ===
 * Discord implementation for the Maidens mainframe depends on Discord.js, created by hydrabolt.
 * Documentation: https://discord.js.org/#/
 */
global.DiscordClient = require('./node_modules/discord.js/src/client/Client');

/**
 * === Maiden Discord Client Class ===
 */
global.MaidenDiscordClient = require('./app/core/maidendiscord/MaidenDiscordClient');

/**
 * === Modules ===
 * Must run 'npm install' in the 'app' folder if any of these modules are not found.
 * It is important to user 'npm install --save' if new packages are added during development. This will update packages.json to include new dependencies.
 */

// Discord.Js library. Thank you Hydrabolt!
global.Discord = require("discord.js");

// Tmi.js Library (For Twitch Integration)
global.tmi = require("tmi.js");

// Get jsonfile module ; Used to facilitate json reading and writing.
global.jsonfile = require("jsonfile");

// Get filesystem
global.fs = require('fs');

// Node API: util
global.util = require('util');

// Glob for Node
global.glob = require('glob');

// Path Resolver
global.path = require('path');

// Underscore
global._ = require('underscore');

// Google
global.google = require('google');

// Moment - Time management
global.moment = require('moment');

/**
 * === Custom Modules ===
 * Modules that aren't available via NPM, but obtained online or coded by hand.
 */

// Name That Color
// http://chir.ag/projects/ntc
global.ntc = require('./custom_modules/ntc');