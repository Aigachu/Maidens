// Project root relative path.
global.coreroot = __dirname + '/';

// Project source code relative path.
global.namespace = coreroot + 'src/';

// Project resources relative path.
// Images, icons, files, etc.
global.resources = coreroot + 'resources/';

/**
* === Modules ===
* Run 'npm install' in the 'app' folder if any of these modules are not found.
* It is important to run 'npm init' if new packages are added during development. This will update packages.json to include new dependencies
*/

// Must run `npm install` if this is not installed or found.
global.Discord = require("discord.js");

// Get jsonfile module ; Used to facilitate json reading and writing.
global.jsonfile = require("jsonfile");

// Get filesystem
global.fs = require('fs');

// Node API: util
global.util = require('util');

global.glob = require('glob');
global.path = require('path');

// Exports.
module.exports = {
  SoraClient: require('./src/soraclient/SoraClient'),
};