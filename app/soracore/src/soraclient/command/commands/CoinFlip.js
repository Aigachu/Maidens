const Command = require('../Command');

class CoinFlip extends Command {

  constructor(client) {

    super(client);

    // this.help = "";
    // this.description = "";
    // this.reqParams = 0;

  }

  tasks(data) {

    var flip = Math.floor(Math.random() * 2) + 1;

    var result = ((flip == 1) ? 'Heads' : 'Tails');

    var flip_types = [];

    flip_types.push({
      message: "_Coinflip emulation has begun. Just a moment..._",
      timeout: 2
    });

    flip_types.push({
      message: "_Coinflip emulation has begun. Looks like..._",
      timeout: 1
    });

    flip_types.push({
      message: "_Coinflip emulation has begun. The coin spins_\nWait for it...",
      timeout: 5
    });

    var rand = flip_types[Math.floor(Math.random() * flip_types.length)];

    this.client.im(data.msg.channel, rand.message);
    // this.client.startTyping(msg.channel);
    var client = this.client;
    setTimeout(function(){
      client.im(data.msg.channel, `<@${data.msg.author.id}> obtained **${result}** !`);
      // this.client.stopTyping(msg.channel);
    }, 1000 * rand.timeout);

  }

}

module.exports = CoinFlip;