const Command = require('../Command');

class SetName extends Command {

  constructor(client) {

    super(client);

    // this.help = "";
    // this.description = "";
    this.reqParams = 1;

  }

  tasks(data) {

    // Set username
    this.client.user.setUsername(data.params[0])
     .then(user => console.log(`My new username is ${user.username}`))
     .catch(console.error);

  }

}

module.exports = SetName;