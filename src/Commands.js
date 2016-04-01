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

/* === Requires START === */

// Get custom coded functions saved in the `tools.js` file.
var tools = require("./tools.js");

// Get jsonfile module ; Used to facilitate json reading and writing.
var jsonfile = require("jsonfile");

/* === Requires END === */

/* === Default Command Configuration Paramater Values === */
// The default values for a new command.
// Commands that have no configuration declaration in the commands.json configuration file will be given these values by default.
var COMMANDS_DEFAULT_CONFIG = {
  oplevel: 2,
  description: '',
  allowed_channels: 'all',
  allowed_servers: 'all',
  excluded_channels: 'none',
  excluded_servers: 'none',
  cooldown: 'none',
  aliases: 'none'
};

/* === Commands Start! === */

/**
 * COMMANDS ARRAY
 * Holds COMMANDS objects.
 * Defines actions taken when certain commands are called in chat.
 * @type {Array}
 */
var Commands = [];

/**
 * Commands Description
 * -- oplevel: The restriction of who can use the command.
 *  - 0 -> Anyone can use the command.
 *  - 1 -> Only ADMINS can use the command. (All user IDs in the ADMINS array above)
 *  - 2 -> Only the GOD can use the command. (The GOD ID in the variable above)
 *
 * -- allowed_channels: Channels in which the command works.
 *  - 'all' -> Will work in all channels.
 *  - [CHANNEL_ID_1, CHANNEL_ID_2, ...] -> Array of all channel IDs where the command will work.
 *
 * -- allowed_servers: Servers in which the command works.
 *  - 'all' -> Will work in all servers.
 *  - [SERVER_ID_1, SERVER_ID_2, ...] -> Array of all server IDs where the command will work.
 *
 * -- cooldown: Cooldown time of the command (in seconds)
 *  - 20 -> 20 seconds.
 *  - 40 -> 40 seconds.
 *    - Any number here works.
 *
 * -- fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
 *      // Your code for the command goes here.
 *    }
 *  - bot -> Bot object to use for bot actions.
 *  - params -> Command parameter array.
 *    - If the command is  "!test 5 peach 8" ...
 *    - params[1] = 5,
 *    - params[2] = peach,
 *    - params[3] = 8.
 *   - msg -> Message object of the invoked message that triggered the command.
 *   - msgServer -> Server that the message arrived from.
 *   - serverRoles -> All roles of the server that the command was invoked from in an array.
 *   - authorRoles -> All roles of the author that invoked the command.
 */

/**
 * Implements the *ping* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
Commands[ "ping" ] = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Yes, " + tools.printUserTag(msg.author) + "? What can I do for you?");

  }
}

/**
 * Implements the *pong* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
Commands[ "pong" ] = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Mm?...Anything you might need from me, " + tools.printUserTag(msg.author) + "?");

  }
}

/**
 * Implements the *chname* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
Commands[ "chname" ] = {
  fn: function( bot, params, msg ) {
    if(tools.validate_parameters(params)) {

      var newName = msg.content.substring(msg.content.indexOf(params[0]), msg.content.length);

      bot.setUsername(newName).catch(function(err){
        if(err) {
          bot.sendMessage( msg.channel, "There seems to have been an error.\nAllow me to format it for you.\n\n```" + err + "```\nI have logged the console with more information.");
          console.log(err);
        } else {
          bot.sendMessage( msg.channel, "Got it! I'll change my name right now.");
        }
      });

    } else {
      bot.sendMessage( msg.channel, "You seem to have forgotten a parameter. Please tell me what to change my display name to!");
    }
  }
}

/* === Commands End! === */

/* === Command Properties Configuration === */

// Path to the commands configuration file.
// Use this file to configure command parameters from the list above.
var COMMANDS_CONFIGURATION_FILE = './conf/commands.json';

// Write new command configuration values to the JSON file.
jsonfile.readFile(COMMANDS_CONFIGURATION_FILE, function(err, obj) {
  if(err) { // If the file is not found or another error occurs...
    // This is most likely to happen if the file is not found.
    // In this case, log the error.
    console.log(err);

    // Friendly Message from Sora telling us that she will generate a commands configuration file.
    console.log("Sora: There doesn't seem to be a commands configuration file or there was an error reading it.\nSora: Not to worry, I will generate a default one. You can go ahead and set the command properties afterwards.");

    // We will now proceed to generate a default commands configuration file.
    var command_properties = {};

    // Loops in the Commands array and generates a default configuration entry for each of them.
    for (var key in Commands) {
      if(Commands.hasOwnProperty(key)) {
        command_properties[key] = COMMANDS_DEFAULT_CONFIG;
      }
    }

    jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE, command_properties, {spaces: 2}, function (err) {
      if(err) {
        console.error(err)
      }
    });
  } else { // If the file is found and successfully loaded...
    var command_properties = obj;

    // Loops in the Commands array and generates a default configuration entry for each command that does not yet have an entry.
    for (var key in Commands) {
      if(Commands.hasOwnProperty(key)) {
        if(command_properties[key] == null) {
          console.log("\nSora: The following command has no configuration definition: " + key + ".\nSora: I will give it a default definition in the configuration file.");
          command_properties[key] = COMMANDS_DEFAULT_CONFIG;
        }
      }
    }

    // Loops through the configurations object to tidy up before saving. 
    for (var key in command_properties) {
      if(command_properties.hasOwnProperty(key)) {
        // Deletes any command configuration declarations that are not for commands currently in the code.
        if(Commands[key] == null) {
          console.log("\nSora: The following command definition does not have a corresponding command in my code: " + key + ".\nSora: I will remove it from the configuration file.");
          delete command_properties[key];
        } else {
          // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
          // Parameters not in the default configuration will not be in *any* configuration.
          for (var param in command_properties[key]) {
            if(command_properties[key].hasOwnProperty(param)) {
              if(COMMANDS_DEFAULT_CONFIG[param] == null) {
                // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                delete command_properties[key][param];
              }
            }
          }

          // Loops through the default configuration object to set any new configuration parameters to older commands that may not have them.
          for (var param in COMMANDS_DEFAULT_CONFIG) {
            if(COMMANDS_DEFAULT_CONFIG.hasOwnProperty(param)) {
              if(command_properties[key][param] == null) {
                // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                command_properties[key][param] = COMMANDS_DEFAULT_CONFIG[param];
              }
            }
          }
        }
      }
    }

    jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE, command_properties, {spaces: 2}, function (err) {
      if(err) {
        console.error(err)
      }
    });
  }
})

/* === Command Properties End === */

// Export the Commands object for use in `sora.js`
exports.commands = Commands;
