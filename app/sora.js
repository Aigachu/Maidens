/**
 * Run File for Sora's main functionalities.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * We will also be setting globals in this file for use across the application.
 *
 * Sora likes it when it's clean, so keep it tidy!
 *
 * UPDATE 4/20/2016 BLAZE IT!!!
 * Sora is now using Discord's main API!
 *
 * Use this link to get others to add her to their servers:
 * https://discordapp.com/oauth2/authorize?&client_id=172474398308040704&scope=bot&permissions=0
 *
 * Last note - See README.md for more details!
 *
 * Happy Blick Winkel! ;-) <3
 *
 */

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
global.commands_configuration_path = soraspace + 'configurations/commands_config.json';
global.pmcommands_configuration_path = soraspace + 'configurations/pmcommands_config.json';
global.servers_configuration_path = soraspace + 'configurations/servers_config.json';


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

/**
 * === Instanciation ===
 */

// Sora class.
var SoraClient = require(soraspace + 'SoraClient');

// Sora instance.
var sora = new SoraClient();

// Login to Discord after processing all the code above.
sora.soraLogin();
