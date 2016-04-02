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
  oplevel:            2,
  description:        '',
  allowed_channels:   'all',
  allowed_servers:    'all',
  excluded_channels:  'none',
  excluded_servers:   'none',
  cooldown:           'none',
  aliases:            'none'
};

/* === Commands Start! === */

/**
 * COMMANDS Object
 * Holds COMMANDS objects.
 * Defines actions taken when certain commands are called in chat.
 * @type {Array}
 */
var Commands = {};

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
Commands.ping = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Yes, " + tools.printUserTag(msg.author) + "? What can I do for you?");

  }
}

/**
 * Implements the *pong* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
Commands.pong = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Mm?...Anything you might need from me, " + tools.printUserTag(msg.author) + "?");

  }
}

/**
 * Implements the *chname* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
Commands.chname = {
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

/**
 * Implements the *coin* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
Commands.coin = {
  fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
    var flip = Math.floor(Math.random() * 2) + 1;

    flip = ((flip == 1) ? 'Heads' : 'Tails');

    var flip_types = [];
    flip_types.push({
      message: "_Coinflip emulation has begun. Just a moment..._",
      timeout: 2
    });
    flip_types.push({
      message: "_Coinflip emulation has begun. Looks like..._",
      timeout: 1
    });
    flip_types.push({
      message: "_Coinflip emulation has begun. The coin spins_\nWait for it...",
      timeout: 5
    });

    var rand = flip_types[Math.floor(Math.random() * flip_types.length)];

    bot.sendMessage(msg.channel, rand.message);
    bot.startTyping(msg.channel);

    setTimeout(function(){
      bot.sendMessage(msg.channel, "<@" + msg.author.id + "> obtained **" + flip + "** !");
      bot.stopTyping(msg.channel);
    }, 1000 * rand.timeout);
  }
}

/* === Commands End! === */

// Export the Commands object for use in `sora.js`
exports.Commands = Commands;

exports.CommandDefaultConfig = COMMANDS_DEFAULT_CONFIG;
