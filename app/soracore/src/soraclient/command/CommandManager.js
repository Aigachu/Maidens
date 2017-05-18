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
    this.commands = this._getCommands(this.client);
    this._debug();

  }

  /**
   * Interpret function.
   * Determines what to do with a message that has been heard.
   * @param  {[type]} msg Message received (or heard) in Discord.
   */
  interpret(msg) {

    // Checks if a command is heard. If not, get out.
    if (this.isCommand(msg)) {
      // Discerns the command.
      this.discernCommand(msg);
    }

  }

  /**
   * Discern Command function.
   * This determines what to do with a command that has been heard.
   * Depending on options of parameters, the outcome may be different.
   *
   * @param  {[Message]} msg Message heard or received that has been identified as a command.
   * @todo  : Make the IsCommand() function return a command key and parameters. We'll eliminate some duplicate splicing and fiddling.
   */
  discernCommand(msg) {

    // Get the parameters arranged by order of appearance.
    var params = this._extractParams(msg);

    // If the first parameter is '--help', we print the help() function of the command.
    // @todo : If --help is found anywhere in the command, do this.
    if (params[0] && params[0] == '--help') {
      this.commands[key].help(msg);
      return;
    }

    // If the first parameter is '--desc', we print the desc() function of the command.
    // @todo : If --desc is found anywhere in the command, do this.
    if (params[0] && params[0] == '--desc') {
      this.commands[key].desc(msg);
      return;
    }

    // Throw an exception if the parameters given do not match the configured {reqParameters} value in the command's definition.
    if (params.length != this.commands[key].reqParams) {
      this.commands[key].error(params.length, 'ParamsException', msg);
      return;
    }

    // Run Command if it passed throw all previous checks.
    this.commands[key].execute(msg, params);

  }

  /**
   * IsCommand function.
   * Simple. Checks if the message heard is a command or not.
   * @param  {[Message]}  msg Message received (or heard) in Discord.
   * @return {Boolean}        Whether or not the message is a command.
   */
  isCommand(msg) {

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

    // Supposed Key
    var key = split[1].toLowerCase();

    // Check if the second word in the message is a command key.
    if (key in this.commands) {
      return true;
    }

    return false;
  }

  /**
   * Extract Parameters function.
   * Use this to extract parameters from a heard command.
   * Words surrounded by "" should be treated as one parameter.
   * @param  {[Message]} message  The message object of the message heard as a command.
   * @return {[string]}           Array of parameters arranged by the order they appear in.
   */
  _extractParams(message) {

    // First, we need to check if there is a part of the command that is a string of text.
    var regex = /\"([^"]+)\"/;

    var matches = regex.exec("$s lol \"text inside if the shit\" lmao");

    console.log(matches);

    // Get an array with all words in the message seperate by a space.
    var sliced_message = message.content.split(" ");

    var key = sliced_message[1].toLowerCase();;

    // Remove the first two elements of the array, which in the case that this is a command, are the following:
    // params[0] = {this.client.cprefix}.
    // params[1] = key of the command.
    sliced_message.splice(0, 2);

    // Initialize the parameters array. This should only contain the parameters by now.
    var params = sliced_message;

    return params;
  }

  /**
   * Get Commands processor function.
   * This function reads all of the files in the "./commands" directory and turns them into commands.
   * @param  {[DiscordClient/BotClient]}  client            The client that will be used and given to commands.
   * @return                              {[Object/Array]}  An array of commands.
   */
  _getCommands(client) {

    var commands = {};

    glob.sync( __dirname + '/commands**/*.js' ).forEach( function( file ) {

      // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
      var filename = file.replace(/^.*[\\\/]/, '');

      // Get the key of the command by interpreting the filename.
      var commandkey = filename.replace(/\.[^/.]+$/, "").toLowerCase();

      // Require the Command's Class.
      var CommandClass = require('./commands/' + filename);

      // Instantiate the [Command] and store it in the {commands} array.
      commands[commandkey] = new CommandClass(client);

    });

    return commands;

  }

  _debug() {
    console.log("--------------START DEBUGGER--------------");
    // First, we need to check if there is a part of the command that is a string of text.
    var regex = /\"([^"]+)\"/;

    var matches = regex.exec("$s lol \"text inside if the shit\" lmao");

    console.log(matches);
    console.log("--------------END DEBUGGER--------------");
  }

}

// Export the Command Manager.
module.exports = CommandManager;