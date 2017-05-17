const Command = require('../Command');

class Example extends Command {

	constructor(client) {

		super(client);

    // this.help = "";

    // this.description = "";

    // this.reqParams = 0;

  }

  tasks(data) {

    this.client.reply('This is an example command. :O Did you even know this existed?', data.msg);

  }

}

module.exports = Example;