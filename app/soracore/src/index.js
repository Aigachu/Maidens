/**
* === Globals ===
*/

// Project root relative path.
global.rootdir = __dirname + '/';

// Project source code relative path.
global.namespace = rootdir + 'src/';

// Project resources relative path.
// Images, icons, files, etc.
global.resources = rootdir + 'resources/';

// Sora core files path.
global.soraspace = namespace + 'SoraClient/';

// Path to configuration files.
// @TODO - Change 'server' nomenclature to 'guild'
global.commands_configuration_path = soraspace + 'config/commands_config.json';
global.pmcommands_configuration_path = soraspace + 'config/pmcommands_config.json';
global.servers_configuration_path = soraspace + 'config/servers_config.json';


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