/**
 * Run File for Maiden main functionalities.
 *
 * Use these links to get others to add the maidens to their servers:
 *
 * {Sora Akanegasaki - The First Lady}
 * https://discordapp.com/oauth2/authorize?&client_id=344561767050903554&scope=bot&permissions=1546959939
 *
 * {Colette Brunel - The Goddess}
 * https://discordapp.com/oauth2/authorize?&client_id=344562549615755285&scope=bot&permissions=1546959939
 *
 * {Lady Maria - Lady Death}
 * https://discordapp.com/oauth2/authorize?&client_id=344885267808911360&scope=bot&permissions=1546959939
 *
 * {Plain Doll - Robo}
 * https://discordapp.com/oauth2/authorize?&client_id=352563648398360576&scope=bot&permissions=1546959939
 * 
 * {Mikuchu - The Devbot}
 * https://discordapp.com/oauth2/authorize?&client_id=344881699928145920&scope=bot&permissions=1546959939
 * 
 * Current valid permission bit: 1546959939
 * To calculate the permissions bit, go here: https://discordapi.com/permissions.html
 *
 * Last note - See README.md for more details!
 *
 * "Happy Blick Winkel! ;-) <3" - Sora
 *
 */

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
 * === Instantiation ===
 */

// Core JS file with all of Sora's Components.
global.sora = require('./app/maidens/sora');

// Core JS file with all of Colette's Components.
global.colette = require('./app/maidens/colette');

// Core JS file with all of Maria's Components.
global.maria = require('./app/maidens/maria');

// Core JS file with all of the Plain Doll's Components.
global.doll = require('./app/maidens/doll');
