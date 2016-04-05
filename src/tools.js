// @TODO - DOCUMENTATION

/**
 * TO MODIFY
 * @fileOverview Sora's main file.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * Sora likes it when it's clean, so keep it tidy!
 */

/* === Requires Start === */

// Get Sora's configuration details.
// A real discord account must be created for the bot to run.
// Put the credentials of the newly created account into `conf/main.json` found at the same level as this file.
var config = require("../conf/main.json");

// Get jsonfile module ; Used to facilitate json reading and writing.
var jsonfile = require("jsonfile");

// Get all defined commands in the `Commands.js` file.
var commands = require("./commands.js").commands;

/* === Requires Stop === */

/* === Variables Start === */

// Path to the commands configuration file.
// Use this file to configure command parameters from the list above.
var COMMANDS_CONFIGURATION_FILE_PATH = './conf/commands_properties.json';

// Path to the commands configuration file.
// Use this file to configure server parameters from the list above.
var SERVERS_CONFIGURATION_FILE_PATH = './conf/servers_properties.json';

// Path to the commands file.
// Use this file to get the list of all commands object.
var COMMANDS_FILE_PATH = './commands.js';

// Command/Reactions Cooldowns Array
var COOLDOWNS = [];

/* === Variables End === */

/* === Functions Start === */

/**
 * [updateCommandConfig description]
 * @param  {[type]} command [description]
 * @param  {[type]} param   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
exports.updateCommandConfig = function(command, param, value) {
	jsonfile.readFile(COMMANDS_CONFIGURATION_FILE_PATH, function(err, obj) {
		if(err) { // THIS SHOULDN'T HAPPEN
			console.log(err);
		} else {
			properties = obj;

			properties[command][param] = value;

			jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE_PATH, properties, {spaces: 2}, function (err) {
	      if(err) {
	        console.error(err);
	      }
    	});
		}
	});
};

/**
 * [val description]
 * @param  {[type]} params [description]
 * @param  {[type]} count  [description]
 * @return {[type]}        [description]
 */
exports.val = function(params, count) {
  count = typeof count !== 'undefined' ? count : 1;

  if( count == 0 && params[count + 1] ) {
    return false;
  } else if(!params[count]) {
    return true;
  }
};

/**
 * Implements the custom function: extractID
 * @param  {[type]} tag [A discord string representing a user's Tag (highlighted string).]
 * @return {[type]}     [ID from the tag string.]
 */
exports.extractID = function(tag) {
  return tag.slice(2, -1);
};

/**
 * Implements the custom function: printUserTag
 * @param  {[object/string]} variable [Can be either a user object]
 * @return {[string]}                 [String that will be interpreted by discord to tag user. i.e. "<@77517077325287424>"]
 */
exports.printUserTag = function(variable) {
  // Conditional check to verify if the variable is an object (user) or not.
  if(variable.username) {
    return "<@" + variable.id + ">";
  } else {
    return "<@" + variable + ">";
  }
};

/**
 * [getCommandConfig description]
 * @return {[type]} [description]
 */
exports.getCommandConfig = function() {
  return require('.' + COMMANDS_CONFIGURATION_FILE_PATH);
}

/**
 * [getServerConfig description]
 * @return {[type]} [description]
 */
exports.getServerConfig = function() {
  return require('.' + SERVERS_CONFIGURATION_FILE_PATH);
}

/**
 * [isCommand description]
 * @param  {[type]} command [description]
 * @param  {[type]} param   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
exports.isCommand = function(msg) {
  // Get commands configuration properties.
  // You are now in tools.js, so you need to add a dot to indicate a return to the other directory.
  var commands_configuration = require('.' + COMMANDS_CONFIGURATION_FILE_PATH);

  // Get all defined commands in the `Commands.js` file.
  var commands = require(COMMANDS_FILE_PATH).commands;

  // Divide text into distinct parameters.
  var split = msg.content.split(" ");

  // Check if it contains the command syntax.
  if(split[0] == config.command_prefix && split[1]) {

    // Supposed Key
    var key = split[1].toLowerCase();

    // Loop through the command configurations and check if the key is an alias for a command.
    for (var command_key in commands_configuration) {
      if(commands_configuration.hasOwnProperty(command_key)) {

        // This will set the key variable to the key of the actual command that the alias is for.
        if(commands_configuration[command_key].aliases.indexOf(key) > -1) {
          key = command_key;
        }

      }
    }

    // Check if the second word in the message is
    if(key in commands) {
      // console.log("Sora: This is a command.");
      return key;
    }
  }

  // console.log("Sora: This is not a command.");
  return false;
};

/**
 * [removeCooldown description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
exports.removeCooldown = function(key) {
  if(typeof commands[key] !== 'undefined') {
    setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * commands[key].cooldown);
  } else {
    setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
  }
}

/**
 * [authCommand description]
 * @param  {[type]} command [description]
 * @param  {[type]} param   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
exports.authCommand = function(bot, msg, key) {

  // Get commands configuration properties.
  // Within the function, you are now in tools.js, so you need to add a dot to indicate a return to the other directory.
  var commands_configuration = require('.' + COMMANDS_CONFIGURATION_FILE_PATH);

  // Get servers configuration properties.
  // Within the function, you are now in tools.js, so you need to add a dot to indicate a return to the other directory.
  var servers_configuration = require('.' + SERVERS_CONFIGURATION_FILE_PATH);

  // Load the command's configurations.
  var command_validation_obj = commands_configuration[key];

  // Check if the command is overriden in the current server.
  if(servers_configuration[msg.channel.server.id]['override_all_commands'] || servers_configuration[msg.channel.server.id]['commands'][key]['override']) {
    command_validation_obj = servers_configuration[msg.channel.server.id]['commands'][key];
  }

  // If the message author is a God, Sora will not verify anything. Auto-Auth.
  if(!(msg.author.id in config.gods)) {

    // Check OP Level
    if(command_validation_obj.oplevel === 2) {
      return false;
    }

    if(command_validation_obj.oplevel === 1) {
      if(!(msg.author.id in config.admins)) {
        return false;
      }
    }

    // Check Allowed Channels
    if(command_validation_obj.allowed_channels !== 'all') {
      if(!(msg.channel.id in command_validation_obj.allowed_channels)) {
        return false;
      }
    }

    // Check Excluded Channels
    if(command_validation_obj.excluded_channels !== 'all') {
      if((msg.channel.id in command_validation_obj.excluded_channels)) {
        return false;
      }
    }

    // Check Cooldown (if any)
    if(command_validation_obj.cooldown !== 'none') {
     if(COOLDOWNS[key]) {

      if(!COOLDOWNS['announce_cd_' + key]) {

        bot.sendMessage(msg.channel, "Hmm. The `" + key + "` command seems to be on cooldown.\nThe cooldown time is **" + command_validation_obj.cooldown + "** seconds. It will be available shortly.", function(error, message) {
          // Delete the cooldown warning after five seconds.
          setTimeout(function(){ bot.deleteMessage(message); }, 1000 * 5);
        });

        COOLDOWNS['announce_cd_' + key] = true;

        if(typeof Commands[key] !== 'undefined') {
          setTimeout(function(){ COOLDOWNS['announce_cd_' + key] = false; /* console.log("Removed cooldown for " + key); */ }, 1000 * command_validation_obj.cooldown);
        } else {
          setTimeout(function(){ COOLDOWNS['announce_cd_' + key] = false; /* console.log("Removed cooldown for " + key); */ }, 1000 * 15);
        }
      }

      bot.deleteMessage(msg);

      return false;

     } else {

      COOLDOWNS[key] = true;

        if(typeof Commands[key] !== 'undefined') {
          setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * command_validation_obj.cooldown);
        } else {
          setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
        }

     }
    }
  }

  // console.log("Sora: This command will not be authorized at this time.");
  return true;
};

/* === Functions End === */


