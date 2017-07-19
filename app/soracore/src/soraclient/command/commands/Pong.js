const Command = require('../Command');

class Pong extends Command {

  constructor(client) {

    super(client);

    this.aliases = [
      "po"
    ];
    // this.help = "";
    // this.description = "";

    this.options = {
      "direct-message": {
        "readable_name" : "Direct Message",
        "description"   : "Send the ping via direct message instead of sending it in the chat.",
        "shortcuts"     : ["dm"],
      },
      "custom-message": {
        "readable_name" : "Custom Message",
        "description"   : "Send a message defined on the fly instead of the default ping response.",
        "shortcuts"     : ["cm"],
        "input"         : "yes",
      }
    };

  }

  tasks(data) {

    this.client.im(data.msg.author, `Pong! Sora, version 2.0, at your service. ;)`);

  }

}

module.exports = Pong;