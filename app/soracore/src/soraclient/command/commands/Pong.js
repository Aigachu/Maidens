const Command = require('../Command');

class Pong extends Command {

  constructor(client) {

    super(client);

    // this.help = "";
    // this.description = "";
    // this.reqParams = 0;

  }

  tasks(data) {

    this.client.im(data.msg.author, `Sora, version 2.0, at your service. ;)`);

  }

}

module.exports = Pong;