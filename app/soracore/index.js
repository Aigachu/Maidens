// Project root relative path.
global.coreroot = __dirname + '/';

// Project source code relative path.
global.namespace = coreroot + 'src/';

// Project resources relative path.
// Images, icons, files, etc.
global.resources = coreroot + 'assets/';

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

/**
 * === Custom Modules ===
 * Modules that aren't available via NPM, but obtained online or coded by hand.
 */

// Name That Color
// http://chir.ag/projects/ntc 
global.ntc = require('./custom_modules/ntc');

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
  SoraClient: require('./src/soraclient/SoraClient'),
};