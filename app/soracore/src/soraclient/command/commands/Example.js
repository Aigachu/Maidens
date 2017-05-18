const Command = require('../Command');

class Example extends Command {

	constructor(client) {

		super(client);

    // this.help = "";
    // this.description = "";
    // this.reqParams = 0;

  }

  tasks(data) {

    this.client.reply(data.msg, 'This is an example command. :O Did you even know this existed?');

  }

}

module.exports = Example;