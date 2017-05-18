const Command = require('../Command');

class EightBall extends Command {

  constructor(client) {

    super(client);

    this.key = '8ball';
    // this.help = "";
    // this.description = "";
    this.reqParams = 0;

  }

  tasks(data) {

    this.client.reply(data.msg, 'This is an EightBall command. :O Did you even know this existed?');

  }

}

module.exports = EightBall;