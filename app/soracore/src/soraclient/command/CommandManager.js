class CommandManager {
  /**
   * Class constructor
   */
  constructor(client) {

    this.client = client;

    this.cprefix = client.cprefix;

    this.commands = this._getCommands(this.client);

  }

  _getCommands(client) {

    var commands = {};

    glob.sync( __dirname + '/commands**/*.js' ).forEach( function( file ) {

      var filename = file.replace(/^.*[\\\/]/, '');
      var commandkey = filename.replace(/\.[^/.]+$/, "").toLowerCase();
      var CommandClass = require('./commands/' + filename);
      commands[commandkey] = new CommandClass(client);
    });

    return commands;

  }

  interpret(msg) {

    if (!this.isCommand(msg)) {
      return;
    }

    this.processCommand(msg);

  }

  processCommand(msg) {

    // Initialize the parameters variable as an array with all words in the message seperate by a space.
    var sliced_message = msg.content.split(" ");

    var key = sliced_message[1].toLowerCase();;

    // Remove the first two elements of the array, which in the case that this is a command, are the following:
    // params[0] = {this.cprefix}.
    // params[1] = key of the command.
    var params = sliced_message.splice(0, 2);

    // Run Command if it passed approval.
    this.commands[key].execute(msg);

  }

  isCommand(msg) {

    // If this message comes from Sora, it's not a command!
    if(msg.author.id === this.client.user.id) {
      return false;
    }

    // First, check if the message is a private message
    // We don't want regular commands to be triggered in PMs with Sora.
    // In the future, we'll work out how to treat commands differently when in PMs.
    if(msg.channel.isPrivate) {
      return false;
    }

    // Divide text into distinct parameters.
    var split = msg.content.split(" ");

    // Check if it contains the command syntax.
    if(split[0] != this.cprefix || split[1].length == 0) {
      return false;
    }

    // Supposed Key
    var key = split[1].toLowerCase();

    // Check if the second word in the message is a command key.
    if(key in this.commands) {
      return true;
    }

    return false;
  }

}

module.exports = CommandManager;