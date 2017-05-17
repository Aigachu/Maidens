const Command = require('../Command');

class Pong extends Command {

  constructor(client) {

    super(client);

    // this.help = "";

    // this.description = "";

  }

  tasks(data) {

    data.msg.author.send(`Sora, version 2.0, at your service. ;)`)
      .then((msg) => console.log(`Sent a reply to ${msg.author.username}.`))
      .catch(console.error);

  }

}

module.exports = Pong;