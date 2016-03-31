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
 * Implements the *chcom* command.
 * @todo : documentation of this command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
Commands[ "chcom" ] = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Mm?...Anything you might need from me, " + tools.printUserTag(msg.author) + "?");

  }
}

/* === Commands End! === */

/* === Command Properties Configuration === */

var COMMANDS_CONFIGURATION_FILE = './conf/commands.json';

// Write new command configuration values to the JSON file.
jsonfile.readFile(COMMANDS_CONFIGURATION_FILE, function(err, obj) {
  if(err) { // If the file is not found or another error occurs...
    // This is most likely to happen if the file is not found.
    // In this case, log the error.
    console.log(err);

    // Friendly Message from Sora telling us that she will generate a commands configuration file.
    console.log("Sora: There doesn't seem to be a commands configuration file or there was an error reading it.\nSora: Not to worry, I will generate a default one. You can go ahead and set the command properties afterwards.")

    // We will now proceed to generate a default commands configuration file.
    var command_properties = {};

    var default_commands_object = {
      oplevel: 0,
      allowed_channels: 'all',
      allowed_servers: 'all',
      excluded_channels: 'none',
      excluded_servers: 'none',
      cooldown: 'none',
    };

    // Loops in the Commands array and generates a default configuration entry for each of them.
    for (var key in Commands) {
      if(Commands.hasOwnProperty(key)) {
        command_properties[key] = default_commands_object;
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
          console.log("\nSora: The following command has no configuration definition: " + key + ".\nSora: I will give it a default definition in the configuration file.")
          command_properties[key] = default_commands_object;
        }
      }
    }

    // Loops through the configurations object and deletes any command configuration declarations that are not for commands currently in the code.
    for (var key in command_properties) {
      if(command_properties.hasOwnProperty(key)) {
        if(Commands[key] == null) {
          console.log("\nSora: The following command definition does not have a corresponding command in my code: " + key + ".\nSora: I will remove it from the configuration file.")
          delete command_properties[key];
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
