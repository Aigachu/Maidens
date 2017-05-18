const Command = require('../Command');

class Ping extends Command {

  constructor(client) {

    super(client);

    // this.help = "";
    // this.description = "";
    // this.reqParams = 0;

  }

  tasks(data) {

    // msg.reply(`Sora, version 2.0, at your service. ;)`)
    //   .then((msg) => console.log(`Sent a reply to ${msg.author.username}.`))
    //   .catch(console.error);

    this.client.reply(data.msg, 'Sora, version 3.0, at your service. ;)');

  }

}

module.exports = Ping;