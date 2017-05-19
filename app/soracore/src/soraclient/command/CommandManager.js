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

  }

  /**
   * Interpret method.
   * Determines what to do with a message that has been heard.
   * @param  {[type]} msg Message received (or heard) in Discord.
   */
  interpret(msg) {

    if(!this._getCommand(msg)) {
      return;
    }

    // Discerns the command.
    this._do(this._getCommand());

  }

  /**
   * Discern Command method.
   * This determines what to do with a command that has been heard.
   * Depending on options of parameters, the outcome may be different.
   *
   * @param  {[Message]} msg Message heard or received that has been identified as a command.
   * @todo  : Make the IsCommand() function return a command key and parameters. We'll eliminate some duplicate splicing and fiddling.
   */
  _do(command) {

    // Now we know it's a command. So we gotta compare to see if the provided orders
    // comply with the given command's signature.
    console.log(command.key);
    console.log(command.params);

    // // Run Command if it passed throw all previous checks.
    // this.commands[command.key].execute(msg, params);

  }

  /**
   * IsCommand method.
   * Simple. Checks if the message heard is a command or not.
   * @param  {[Message]}  msg Message received (or heard) in Discord.
   * @return {Boolean}        Whether or not the message is a command.
   */
  _getCommand(msg) {

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
    var divided_msg = msg.content.split(" ");

    // Check if it contains the command syntax.
    if (divided_msg[0] != this.client.cprefix || !divided_msg[1]) {
      return false;
    }

    // Supposed Key
    var provided_key = divided_msg[1].toLowerCase();

    // Check if the second word in the message is a command key.
    if (provided_key in this.commands) {
      return {
        'key'     :  provided_key,
        'params'  :  this._ratifyCommand(msg, provided_key, divided_msg),
        'msg'     :  msg
      };
    }

    return false;

  }

  /**
   * Ratify Command method.
   * Use this to validate the orders given with a command and extract parameters from it.
   * Words surrounded by "" should be treated as one parameter.
   * @param  {[Message]} message  The message object of the message heard as a command.
   * @return {[string]}           Array of parameters arranged by the order they appear in.
   */
  _ratifyCommand(message, command_key, divided_msg) {

    // @TODO - If the command contains a text component at the end, but it's not supposed to, fire a TextNotNeeded exception to the command.
    // @TODO - If the command does not contain a text component, but it needs one, fire a TextNotFound exception to the command.
    // @TODO - Cover what parameters to send when there is no text needed.
    // @TODO - Cover what parameters to send when there is text needed.

    // Remove the first two elements of the divided message array, which in the case that this is a command, are the following:
    // params[0] = {this.client.cprefix}.
    // params[1] = key of the command.
    divided_msg.splice(0, 2);

    var parameters = divided_msg;

    // First, we need to check if there is a part of the command that is a string of text.
    var regex = /\{([^{^}]+)\}/;

    var matches = regex.exec(message);

    console.log(matches);

    if()

    sliced_message.forEach(function(component){
      if(component.indexOf('{') == 0 && matches[1]) {
        params = matches[1];
      }
    });

    // Initialize the parameters array. This should only contain the parameters by now.
    var params = sliced_message;

    return parameters;
  }

  /**
   * Get Commands processor method.
   * This method reads all of the files in the "./commands" directory and turns them into commands.
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
}

// Export the Command Manager.
module.exports = CommandManager;