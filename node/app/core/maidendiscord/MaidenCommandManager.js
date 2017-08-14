/**
 * Class [CommandManager]
 *
 * This class defines the properties of a [CommandManager] object.
 * The CommandManager is the interpreter for commands, and will read every message
 * received in Discord and determine if there's anything to do with them. Directly
 * related to [Command] type objects, that can be found in the file in the same folder.
 *
 * === Properties ===
 * - {client}     : The Discord Bot client.
 * - {commands}   : Commands retrieved from reading all files in the "./commands" folder.
 */
class MaidenCommandManager {

  /**
   * Constructor for the CommandManager class.
   * Takes the client of the bot as an argument.
   */
  constructor(client) {

    // Instantiate the class properties.
    this.client = client;

    // Instantiate the client with core commands.
    this.build(client);

  }

  /**
   * Interpret method.
   * Determines what to do with a message that has been heard.
   * @param  {[type]} msg Message received (or heard) in Discord.
   */
  interpret(msg) {

    // Detect command from message
    var key = this.detectCommand(msg);

    // Checks if a command is heard. If not, get out.
    if (key) {
      // Discerns the command.
      this.discernCommand(msg, key);
    }

  }

  /**
   * IsCommand method.
   * Simple. Checks if the message heard is a command or not.
   * @param  {[Message]}  msg Message received (or heard) in Discord.
   * @return {Boolean}        Whether or not the message is a command.
   */
  detectCommand(msg) {

    // If this message comes from the bot, it's not a command!
    if (msg.author.id === this.client.user.id) {
      return false;
    }

    // Divide text into distinct parameters.
    var split = msg.content.split(" ");

    if(split[1] == null || split[1].length == 0) {
      return false;
    }

    // Check if it contains the command syntax.
    if (split[0] != this.client.cprefix && split[0] != `<@${this.client.user.id}>` && split[0] != `<@!${this.client.user.id}>`) {
      return false;
    }

    // If the command is in the list of command definitions, return it
    if (split[1].toLowerCase() in this.commands) {
      return split[1].toLowerCase();
    }

    // Check if the second word in the message is a command alias, and return the key of the parent command.
    if (split[1].toLowerCase() in this.commands.aliases) {
      return this.commands.aliases[split[1].toLowerCase()];
    }

    return false;
  }

  /**
   * Discern Command method.
   * This determines what to do with a command that has been heard.
   * Depending on options of parameters, the outcome may be different.
   *
   * @param  {[Message]} msg Message heard or received that has been identified as a command.
   * @todo  : Make the IsCommand() function return a command key and parameters. We'll eliminate some duplicate splicing and fiddling.
   */
  discernCommand(msg, key) {

    var command = this.commands[key];

    // We're gonna need to do a couple of extra checks to make sure that whoever invoked the command
    // is allowed to use it in this given context.

    // Check if the command is allowed by this user.
    if (!_.isEmpty(command.config.auth.users) && _.indexOf(command.config.auth.users, msg.author.id) < 0) {
      return false;
    }

    if ("oplevel" in command.config.auth) {
      if ( command.config.auth.oplevel == 1 && !(msg.author.id in this.client.admins)) {
        return false;      
      }
      if ( command.config.auth.oplevel == 2 && !(msg.author.id in this.client.gods)) {
        return false;      
      }
    }

    // Check if the command is being called in PMs and if it's allowed to be.
    if (msg.channel.type == "dm" && !command.config.auth.pms) {
      return false;
    }

    // Check if the command is allowed in this guild.
    if (!_.isEmpty(command.config.auth.guilds) && _.indexOf(command.config.auth.guilds, msg.guild.id) < 0) {
      return false;
    }

    // Check if the command is allowed in this channel.
    if (!_.isEmpty(command.config.auth.channels) && _.indexOf(command.config.auth.channels, msg.channel.id) < 0) {
      return false;
    }

    // For the help and description options, we will treat them here if they are present.
    // Nothing else happens if these options are found.
    if (msg.content.includes("--help")) {
      command.help(msg);
      return;
    }

    if (msg.content.includes("--desc")) {
      command.desc(msg);
      return;
    }

    // Analyze the command into it's different parts and process their syntactic roles.
    this.parseCommand(msg, key);

  }

  /**
   * Extract Parameters method.
   * Use this to extract parameters from a heard command.
   * Words surrounded by "" should be treated as one parameter.
   * @param  {[Message]} message  The message object of the message heard as a command.
   * @return {[string]}           Array of parameters arranged by the order they appear in.
   */
  parseCommand(message, key) {

    // Adding extra documentation here because the parsing of commands has undergone quite a change.
    // Follow through properly!

    // The command that will be parsed.
    var command = this.commands[key];

    // First, we check if the command is a Simple command.
    // Simple commands don't have any input, or options. You simply enter the
    // command key, and it'll handle the rest.
    // If any input is given, an error should be thrown.
    // if (_.isEmpty(command.input) && _.isEmpty(command.options) && message.content.trim().replace(/\s{2,}/g, ' ').split(" ").length > 2) {
    //   command.error(message.content, "InputGivenWhenSimpleCommand", message);
    //   return;
    // }

    // Regex to get regular options in the message.
    var get_options_regex = /-([\w-]*)/g;

    // Now we check if the command is optionless. If it is, then no options should be given.
    if (_.isEmpty(command.options) && message.content.match(get_options_regex) !== null) {
      command.error(message.content, "OptionsGivenWhenOptionlessCommand", message);
      return;
    }

    // To do any following checks, we need the input of the command.
    
    var input = this.getCommandInput(message.content);

    var client = this.client;

    // If the command takes options, and options were submitted, compare the options inputted.
    // Invalid options should not pass through to the command.
    // @todo - show invalid options in error text.
    if (!_.isEmpty(command.options) && !_.isEmpty(input.options)) {
      var error = false;
      Object.keys(input.options).forEach(function(key) {
        if (!(key in command.options)) {
          error = "InvalidOption";
          return;
        }
        if (command.options[key].needs_text && input.options[key].constructor.name != "String") {
          error = "OptionGivenWithoutInput";
          return;
        }
        if ("oplevel" in command.options[key]) {
          if ( command.options[key].oplevel == 1 && !(message.author.id in client.admins)) {
            delete input.options[key];      
          }
          if ( command.options[key].oplevel == 2 && !(message.author.id in client.gods)) {
            delete input.options[key];      
          }
        }
      });
      if (error) {
        command.error(key, error, message);
        return;
      }
    }

    // If the command takes input, check to see if the command's input was entered.
    // if (!_.isEmpty(command.input) && _.isEmpty(input.array)) {
    //   command.error(message.content, "InputRequiredButNotEntered", message);
    //   return;
    // }

    // Run Command if it passed through the parsing.
    command.execute(message, input);
  }

  /**
   * [getCommandInput description]
   * @param  {[type]} msg_content [description]
   * @return {[type]}             [description]
   */
  getCommandInput(msg_content) {

    var input = {};

    // Array to store options keys found in the command message.
    var options = {};

    // Regex to get any input options in the message.
    var get_options_with_text_regex = /-([\w-]?)\"([^"]*)\"/g;
    var t_opts = msg_content.match(get_options_with_text_regex);

    // If we find some input-options in the message... e.g. '$s ping -c"This is a custom message"'
    if(t_opts != null) {
      // For each match, add the option to the options array and remove it from the message.
      // This will clean options out of the message so we're only left with the raw input (if needed)
      t_opts.forEach(function(t_opt){
        options[t_opt.substr(0, 2).replace("-", "")] = t_opt.substr(2, t_opt.length).replace(/\"/g, "");
        msg_content = msg_content.replace(t_opt, "");
      });
    }

    // Regex to get regular options in the message.
    var get_options_regex = /-([\w-#!$%?]*)/g;
    var opts = msg_content.match(get_options_regex);

    // If we find some regular options in the message... e.g. '$s ping -c -d'
    if(opts != null) {
      // For each match, add the option to the options array and remove it from the message.
      // This will clean options out of the message so we're only left with the raw input (if needed)
      opts.forEach(function(opt){
        options[opt.charAt(1)] = (opt.substr(2, opt.length)) ? opt.substr(2, opt.length) : opt.charAt(1);
        msg_content = msg_content.replace(opt, "");
      });
    }

    // Assign the options array to the input object.
    input.options = options;

    // At this point, the message is stripped of any sort of options.
    // e.g. -d -c"This is custom input in an option."
    // Things like the example up above are removed.

    // Remove any extra whitespace in the message.
    // Extra whitespace can be user inputted or can be the result of removing others
    msg_content = msg_content.replace(/\s{2,}/g, ' ');

    // Get an array with all words in the message seperate by a space.
    var raw_input_array = msg_content.trim().split(" ");

    input.array = raw_input_array;

    raw_input_array.splice(0, 2);

    input.full = raw_input_array.join(' ').trim();

    return input;
  }

  /**
   * Build all commands into the manager.
   * This method reads all of the files in the "./commands" directory and turns them into commands.
   * @param  {[DiscordClient/BotClient]}  client            The client that will be used and given to commands.
   * @return                              {[Object/Array]}  An array of commands.
   */
  build(client) {

    var commands = {};

    commands.aliases = {};

    // Get General Commands
    glob.sync( __dirname + '/commands**/*.js' ).forEach( function( file ) {

      // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
      var filename = file.replace(/^.*[\\\/]/, '');

      // Get the key of the command by interpreting the filename.
      var command_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

      // Require the Command's Class.
      var CommandClass = require('./commands/' + filename);

      // Instantiate the [Command] and store it in the {commands} array.
      commands[command_key] = new CommandClass(client);

      if (typeof commands[command_key].aliases !== 'undefined' && commands[command_key].aliases.length > 0) {
        commands[command_key].aliases.forEach( function(alias) {
          commands.aliases[alias] = command_key;
        });
      }

    });

    // Get Maiden Specific Commands
    glob.sync( client.namespace + 'commands**/*.js' ).forEach( function( file ) {

      // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
      var filename = file.replace(/^.*[\\\/]/, '');

      // Get the key of the command by interpreting the filename.
      var command_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

      // Require the Command's Class.
      var CommandClass = require(client.namespace + 'commands/' + filename);

      // Instantiate the [Command] and store it in the {commands} array.
      commands[command_key] = new CommandClass(client);

      if (typeof commands[command_key].aliases !== 'undefined' && commands[command_key].aliases.length > 0) {
        commands[command_key].aliases.forEach( function(alias) {
          commands.aliases[alias] = command_key;
        });
      }

    });

    // Get Commands from plugins
    this.client.plugins.every((plugin) => {
      glob.sync( plugin.path + '/commands**/*.js' ).forEach( function( file ) {

        // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
        var filename = file.replace(/^.*[\\\/]/, '');

        // Get the key of the command by interpreting the filename.
        var command_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

        // Require the Command's Class.
        var CommandClass = require(plugin.path + '/commands/' + filename);

        // Instantiate the [Command] and store it in the {commands} array.
        commands[command_key] = new CommandClass(client);

        if (typeof commands[command_key].aliases !== 'undefined' && commands[command_key].aliases.length > 0) {
          commands[command_key].aliases.forEach( function(alias) {
            commands.aliases[alias] = command_key;
          });
        }

      });

      return true;
    });

    this.commands = commands;

    return true;

  }
}

// Export the Command Manager.
module.exports = MaidenCommandManager;