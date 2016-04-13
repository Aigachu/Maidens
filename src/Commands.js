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
 * COMMANDS Object
 * Holds COMMANDS objects.
 * Defines actions taken when certain commands are called in chat.
 * @type {Array}
 */
var commands = {};

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
commands.ping = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Yes, " + tools.printUserTag(msg.author) + "? What can I do for you?");

  }
}

/**
 * Implements the *pong* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
commands.pong = {
  fn: function( bot, params, msg ) {

    bot.sendMessage(msg.channel, "Mm?...Anything you might need from me, " + tools.printUserTag(msg.author) + "?");

  }
}

/**
 * Implements the *chname* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.chname = {
  fn: function( bot, params, msg ) {
    if(tools.val(params)) {

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
commands.coin = {
  fn: function( bot, params, msg ) {
    if(tools.val(params, 0)) {
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
    } else {
      bot.sendMessage( msg.channel, "You seem to have made a mistake with your command. Try using the `help` command! I can remind you about the way a command is used.");
    }
  }
}

/**
 * Implements the *help* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.help = {
  fn: function( bot, params, msg ) {
    if(tools.val(params, 0)) {

      // Print general help text for all commands.
      bot.sendMessage(msg.channel, 'I *should* print the general help message, but Aigachu hasn\'t written it yet. Lazy bum!');

      return;

    } else if(tools.val(params)) {

      var command_config = tools.getCommandConfig();
      var command_object = command_config[params[0]];

      if(command_object == undefined) {
        bot.sendMessage(msg.channel, "I don't think that command exists...");

        return;
      }

      if(command_object['help_text'].length == 0) {

        bot.sendMessage(msg.channel, "This command doesn't seem to have help text set. Bummer! Hassle Aigachu and tell him to update the documentation! :scream:");

        return;

      } else {

        bot.sendMessage(msg.channel, command_object['help_text']);

        return;

      }

    } else {
      bot.sendMessage( msg.channel, "Hmm. That doesn't seem to be the proper use of the help command.");

      return;
    }
  }
}

/**
 * Implements the *dlist* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.dlist = {
  fn: function( bot, params, msg ) {
    // Servers Object
    var all_servers = bot.servers;

    var message = "Here is the list of all worlds I am linked to, as well as their channels!\n";

    message += '```\n';

    for( var server_key in all_servers ) {
      if( all_servers.hasOwnProperty(server_key) && server_key != 'limit' && server_key != 'length') {

        var server = all_servers[server_key];
        var server_all_channels = server.channels;
        message += server.name + "\n";

        for (var channel_key in server_all_channels ) {
          if( server_all_channels.hasOwnProperty(channel_key) && channel_key != 'limit' && channel_key != 'length' ) {

            var channel = server_all_channels[channel_key];
            message += '-- ' + channel.name + "\n";

          }
        }

        message += '\n'
      }
    }

    message += '```\n';

    bot.sendMessage( msg.channel, message);

    console.log(message);
  }
}


/**
 * Implements the *thirdeye* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.te = {
  fn: function( bot, params, msg ) {
    // First Param will be the server
    // Second Param
  }
}

/* === Commands End! === */

// Export the Commands object for use in `sora.js`
exports.commands = commands;
