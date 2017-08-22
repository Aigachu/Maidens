/**
 * Run File for Sora's main functionalities.
 *
 * Use these links to get others to add the maidens to their servers:
 *
 * {Sora Akanegasaki}
 * https://discordapp.com/oauth2/authorize?&client_id=344561767050903554&scope=bot&permissions=1546959939
 *
 * {Colette Brunel}
 * https://discordapp.com/oauth2/authorize?&client_id=344562549615755285&scope=bot&permissions=1546959939
 *
 * {Lady Maria}
 * https://discordapp.com/oauth2/authorize?&client_id=344885267808911360&scope=bot&permissions=1546959939
 * 
 * {Mikuchu the Devbot}
 * https://discordapp.com/oauth2/authorize?&client_id=344881699928145920&scope=bot&permissions=1546959939
 * 
 * Current valid permission bit: 1546959939
 * To calculate the permissions bit, go here: https://discordapi.com/permissions.html
 *
 * Last note - See README.md for more details!
 *
 * Happy Blick Winkel! ;-) <3
 *
 */

/**
 * === Classes ===
 */

/**
 * === Discord Client Class ===
 * Sora's mainframe depends on Discord.js, created by hydrabolt.
 * Documentation: https://discord.js.org/#/
 */
global.DiscordClient = require('./node_modules/discord.js/src/client/Client');

/**
 * === Discord Client Class ===
 * Sora's mainframe depends on Discord.js, created by hydrabolt.
 * Documentation: https://discord.js.org/#/
 */
global.MaidenDiscord = require('./app/core/maidendiscord/MaidenDiscord');

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

/**
 * === Instanciation ===
 */

// Core JS file with all of Sora's Components.
global.sora = require('./app/maidens/sora');

// Core JS file with all of Sora's Components.
global.colette = require('./app/maidens/colette');

// Core JS file with all of Sora's Components.
global.maria = require('./app/maidens/maria');
