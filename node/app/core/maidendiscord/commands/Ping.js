class Ping extends Command {

  constructor(client) {

    super(client);

    this.aliases = ["pi","pg", "p"];

    // this.helpText = "";
    // this.descText = "";
    
    // this.input = {
    //   "example": {
    //     "type": "text",
    //     "name": "An example of text input.",
    //     "description": "Example of input needed for the command to function."
    //   }
    // };

    this.options = {
      d: {
        readable_name : "Direct Message",
        description   : "Send the ping via direct message instead of sending it in the chat.",
      },
      c: {
        readable_name : "Custom Message",
        description   : "Send a message defined on the fly instead of the default ping response.",
        needs_text   : true,
      }
    };

    this.config = {
      auth: {
        guilds: ["314130398173069312"],
        channels: ["327535083164663808"],
        pms: false,
        users: ["77517077325287424", "82530619355037696", "83017457488363520"]
      }, 
    };

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   */
  tasks(data) {

    // Default reply for the ping command.
    var ping_message = `Pong! Maiden at your service. ;)`;

    // If the "c" option is used, change the text Sora says.
    if ("c" in data.input.options) {
      ping_message = data.input.options.c;
    }

    // If the "d" option is used, send the message through DMs instead of in the channel.
    if ("d" in data.input.options) {
      this.client.im(data.msg.author, ping_message);
      return;
    }

    // Send message normally.
    this.client.reply(data.msg, ping_message);

    // msg.reply(`Sora, version 2.0, at your service. ;)`)
    //   .then((msg) => console.log(`Sent a reply to ${msg.author.username}.`))
    //   .catch(console.error);

  }

}

module.exports = Ping;