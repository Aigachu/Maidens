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
class CommandManager {

  /**
   * Constructor for the CommandManager class.
   * Takes the client of the bot as an argument.
   */
  constructor(client) {

    // Instantiate the class properties.
    this.client = client;
    this.commands = this.__getCommands(this.client);

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

    // First, check if the message is a private message
    // We don't want regular commands to be triggered in PMs with Sora.
    // @todo : In the future, we'll work out how to treat commands differently when in PMs.
    if (msg.channel.isPrivate) {
      return false;
    }

    // Divide text into distinct parameters.
    var split = msg.content.split(" ");

    // Check if it contains the command syntax.
    if (split[0] != this.client.cprefix || split[1].length == 0) {
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
  discernCommand(message, key) {

    // For the help and description options, we will treat them here if they are present.
    // Nothing else happens if these options are found.
    if(message.content.includes("--help")) {
      this.commands[key].help(message);
      return;
    }

    if(message.content.includes("--desc")) {
      this.commands[key].desc(message);
      return;
    }

    // Analyze the command into it's different parts and process their syntactic roles.
    this.parseCommand(message, key);

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

    // If the command takes options, and options were submitted, compare the options inputted.
    // Invalid options should not pass through to the command.
    // @todo - show invalid options in error text.
    if (!_.isEmpty(command.options) && !_.isEmpty(input.options)) {
      var error = false;
      Object.keys(input.options).forEach(function(key) {
        if(!(key in command.options)) {
          error = "InvalidOption";
          return;
        }
        if (command.options[key].needs_input && input.options[key].constructor.name != "String") {
          error = "OptionGivenWithoutInput";
          return;
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

  getCommandInput(msg_content) {

    var input = {};

    // Array to store options keys found in the command message.
    var options = {};

    // Regex to get any input options in the message.
    var get_input_options_regex = /-([\w-]?)\"([^"]*)\"/g;
    var iopts = msg_content.match(get_input_options_regex);

    // If we find some input-options in the message... e.g. '$s ping -c"This is a custom message"'
    if(iopts != null) {
      // For each match, add the option to the options array and remove it from the message.
      // This will clean options out of the message so we're only left with the raw input (if needed)
      iopts.forEach(function(iopt){
        options[iopt.substr(0, 2).replace("-", "")] = iopt.substr(2, iopt.length).replace(/\"/g, "");
        msg_content = msg_content.replace(iopt, "");
      });
    }

    // Regex to get regular options in the message.
    var get_options_regex = /-([\w-]*)/g;
    var opts = msg_content.match(get_options_regex);

    // If we find some regular options in the message... e.g. '$s ping -c -d'
    if(opts != null) {
      // For each match, add the option to the options array and remove it from the message.
      // This will clean options out of the message so we're only left with the raw input (if needed)
      opts.forEach(function(opt){
        options[opt.replace("-", "")] = true;
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
   * Get Commands processor method.
   * This method reads all of the files in the "./commands" directory and turns them into commands.
   * @param  {[DiscordClient/BotClient]}  client            The client that will be used and given to commands.
   * @return                              {[Object/Array]}  An array of commands.
   */
  __getCommands(client) {

    var commands = {};

    commands.aliases = {};

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

    return commands;

  }
}

// Export the Command Manager.
module.exports = CommandManager;