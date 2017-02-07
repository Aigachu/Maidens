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
 * Happy Dimension Traveling! :-) <3
 *
 */

/* === Globals === */

// Project root relative path.
global.rootdir = __dirname + '/';

// Project classes relative path.
global.namespace = rootdir + 'classes/';

// Project resources relative path.
global.resources = rootdir + 'resources/';

// Project classes relative path.
global.soraspace = namespace + 'SoraClient/';

// Project classes relative path.
global.commands_configuration_path = soraspace + 'configurations/commands_config.json';

// Project classes relative path.
global.pmcommands_configuration_path = soraspace + 'configurations/pmcommands_config.json';

// Project classes relative path.
global.servers_configuration_path = soraspace + 'configurations/servers_config.json';


// Must run `npm install --save discord.js` if this is not installed or found.
global.Discord = require("discord.js");

// Get jsonfile module ; Used to facilitate json reading and writing.
global.jsonfile = require("jsonfile");

// Get filesystem
global.fs = require('fs');

// Node API: util
global.util = require('util');

/**
 * Instanciation.
 */
// Sawako class.
var SoraClient = require(soraspace + 'SoraClient');

// Sawako instance.
var sora = new SoraClient();

// Login to Discord after processing all the code above.
sora.loginSora();
