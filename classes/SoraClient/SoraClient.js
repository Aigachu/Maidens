/**
 * @ref {K4Kheops} - https://bitbucket.org/K4Kheops/
 * -- If you see mention of {Sawako} anywhere, it's because of him. ;)
 *
 * Sora's Discord Client class.
 * Used to customize all of Discord Client functions and properties.
 */
function SoraClient() {

  /**
   * Class Constructor
   */
  SoraClient.super_.call(this);

  /**
   * Class Properties
   */

  // Get Sora's configuration details.
  // A real discord account must be created for the bot to run.
  // Put the credentials of the newly created account into `conf/main.json` found at the same level as this file.
  this.config = require(rootdir + 'config.js');

  // Sora commands.
  this.commands = require(soraspace + 'Commands.js').commands;

  // Sora commands configurations.
  this.commands_configs = require(commands_configuration_path);

  // Sora servers configurations.
  this.servers_configs = require(servers_configuration_path);

  // Sora Helper Functions
  this.helpers = require(soraspace + 'Helpers.js');

  // Sora Writer Script
  this.writer = require(soraspace + 'Writer.js');

  // Initiate Sora's Cooldown handling
  this.cooldowns = [];

  /**
   * Events Callbacks
   */
  // Event: When Sawako connects to Discord.
  this.on('ready', function() {

    // Assign to client to a variable.
    var sora = this;

    // Logs connection event in console.
    console.log("\nSora: I am now properly linked to the Discord infrastructure. Enjoy!");

    /* === On-Boot Tasks === */
    // Loads and modifies the command configuration file.
    sora.writer.loadCommConf(sora);
    sora.writer.loadServConf(sora);

    /**
     * Event that fires when Sora receives a message.
     * @param  {Object} msg)
     * @todo : add example msg object reference to Wiki.
     */
    sora.on("message", function (msg) {

      /* === COMMANDS TREATMENT START === */

      // Only hop in here and treat commands if this isn't Sora's own message!
      if(msg.author.id !== sora.user.id) {
        var key = "";

        if(key = sora.verifyIfMsgIsCommand(msg)) {

          // Initialize the parameters variable as an array with all words in the message seperate by a space.
          var params = msg.content.split(" ");

          // Remove the first two elements of the array, which in the case that this is a command, are the following:
          // params[0] = $sora.
          // params[1] = command_key.
          params.splice(0, 2);

          // Now, the params array only contains the parameters of the command.

          // Run Command if it passed approval.
          if(sora.authCommand(msg, key)) {
            sora.commands[key].fn(sora, params, msg);
          }

        }

        // LOL
        if(sora.THIRDEYE !== undefined && !sora.verifyIfMsgIsCommand(msg)) {
          sora.thirdeye(sora, msg, sora.THIRDEYE);
        }
      }

      /* === COMMANDS TREATMENT END === */
    });

  });

  // Event: When Sora disconnects from Discord.
  this.on('disconnected', function() {

    // Assign to client to a variable.
    var sora = this;

    // Logs disconnection event in console.
    console.log("Sora: I have been disconnected from the Discord infrastructure. See you soon!");

  });

  /**
   * SoraClient Class Methods
   */

  /**
   * [login description]
   * @return {[type]} [description]
   */
  this.login = function() {
    // Assign to client to a variable.
    var sora = this;

    sora.loginWithToken(sora.config.apptoken);
  }

  /**
   * [isCommand description]
   * @param  {[type]} command [description]
   * @param  {[type]} param   [description]
   * @param  {[type]} value   [description]
   * @return {[type]}         [description]
   */
  this.verifyIfMsgIsCommand = function(msg) {
    // Assign to client to a variable.
    var sora = this;

    // Get commands configuration properties.
    // You are now in tools.js, so you need to add a dot to indicate a return to the other directory.
    var commands_configuration = require(commands_configuration_path);

    // Get all defined commands in the `Commands.js` file.
    var commands = sora.commands;

    // Divide text into distinct parameters.
    var split = msg.content.split(" ");

    // Check if it contains the command syntax.
    if(split[0] == sora.config.prefix && split[1]) {

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
   * [authCommand description]
   * @param  {[type]} command [description]
   * @param  {[type]} param   [description]
   * @param  {[type]} value   [description]
   * @return {[type]}         [description]
   */
  this.authCommand = function(msg, key) {
    // Assign to client to a variable.
    var sora = this;

    // Get commands configuration properties.
    // Within the function, you are now in tools.js, so you need to add a dot to indicate a return to the other directory.
    var commands_configuration = require(commands_configuration_path);

    // Get servers configuration properties.
    // Within the function, you are now in tools.js, so you need to add a dot to indicate a return to the other directory.
    var servers_configuration = require(servers_configuration_path);

    // Load the command's configurations.
    var command_validation_obj = commands_configuration[key];

    // Check if the command is overriden in the current server.
    if(servers_configuration[msg.channel.server.id]['override_all_commands'] || servers_configuration[msg.channel.server.id]['commands'][key]['override']) {
      command_validation_obj = servers_configuration[msg.channel.server.id]['commands'][key];
    }

    // If the message author is a God, Sora will not verify anything. Auto-Auth.
    if(!(msg.author.id in sora.config.gods)) {
      // Check OP Level
      if(command_validation_obj.oplevel === 2) {
        return false;
      }

      if(command_validation_obj.oplevel === 1) {
        if(!(msg.author.id in sora.config.admins)) {
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
       if(sora.cooldowns[key]) {

        if(!sora.cooldowns['announce_cd_' + key]) {

          sora.sendMessage(msg.channel, "Hmm. The `" + key + "` command seems to be on cooldown.\nThe cooldown time is **" + command_validation_obj.cooldown + "** seconds. It will be available shortly.", function(error, message) {
            // Delete the cooldown warning after five seconds.
            setTimeout(function(){ sora.deleteMessage(message); }, 1000 * 5);
          });

          sora.cooldowns['announce_cd_' + key] = true;

          if(typeof sora.commands[key] !== 'undefined') {
            setTimeout(function(){ sora.cooldowns['announce_cd_' + key] = false; /* console.log("Removed cooldown for " + key); */ }, 1000 * command_validation_obj.cooldown);
          } else {
            setTimeout(function(){ sora.cooldowns['announce_cd_' + key] = false; /* console.log("Removed cooldown for " + key); */ }, 1000 * 15);
          }
        }

        sora.deleteMessage(msg);

        return false;

       } else {

        sora.cooldowns[key] = true;

          if(typeof Commands[key] !== 'undefined') {
            setTimeout(function(){ sora.cooldowns[key] = false; console.log("Removed cooldown for " + key); }, 1000 * command_validation_obj.cooldown);
          } else {
            setTimeout(function(){ sora.cooldowns[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
          }

       }
      }
    }

    // console.log("Sora: This command will not be authorized at this time.");
    return true;
  };

  /**
   * [thirdeye description]
   * @return {[type]} [description]
   */
  this.thirdeye = function(bot, msg, link) {
    var message = "";

    if(msg.channel.id == link.this_world['id']) {

      message += "**" + msg.author.name + "**";

      message += "  _{" + link.this_dimension.name + "}_\n";

      message += msg.content;

      bot.sendMessage(link.their_world, message);

    }

    if(msg.channel.id == link.their_world['id']) {

      message += "**" + msg.author.name + "**";

      message += "  _{" + link.their_dimension.name + "}_\n";

      message += msg.content;

      bot.sendMessage(link.this_world, message);
    }
  }

  /**
   * @ref {K4Kheops} - https://bitbucket.org/K4Kheops/
   * -- If you see mention of {Sawako} anywhere, it's because of him. ;)
   *
   * Simulates Sora typing a message in Discord.
   * The longer the message, the faster she types!
   * @param  {Client} client    The Discord Client object: Sora.
   * @param  {string} message   The message string to be written in chat.
   * @param  {string} recipient The message's recipient ID. Can be either a User ID or a Channel ID.
   * @param  {string} callback  The command name to be called once a message has been sent.
   */
  this.writeMessage = function(client, message, recipient, callback) {

    // Retrieve message characters length.
    var messageLength = message.length;

    // Define typing speed.
    var typingSpeed = 50;

    // The longer the message, the faster the speed.
    if(messageLength > 50) {
      typingSpeed = 15;
    } else if(messageLength > 100) {
      typingSpeed = 10;
    } else if(messageLength > 300) {
      typingSpeed = 5;
    } else if(messageLength > 500) {
      typingSpeed = 2;
    }

    // Calculate typing duration based on message lenth and typing speed.
    var typingDuration = messageLength * typingSpeed;

    // Simulate Sawako typing in Discord.
    this.startTyping(recipient);

    // Set typing simulation duration.
    setTimeout(function() {

      // Sawako stops typing in Discord.
      client.stopTyping(recipient);

      // Sawako sends the message to the recipient.
      client.sendMessage(recipient, message);

      // If callback command is set, call it.
      if(typeof callback !== 'undefined') {

        /**
         * @todo Would be nice to implement the command parameters here too.
         */
        client.commands[callback].fn(client);

      }

    }, typingDuration);

  }

};

/**
 * Discord Client class include.
 */
const DiscordClient = require(rootdir + 'node_modules/discord.js/lib/Client/Client');

/**
 * SawakoClient class inheritance.
 */
util.inherits(SoraClient, DiscordClient);

/**
 * SawakoClient class exports.
 */
module.exports = SoraClient;