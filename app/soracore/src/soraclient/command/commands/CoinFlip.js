const Command = require('../Command');

class CoinFlip extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
    this.aliases = [ "cf", "cflip"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.help = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.description = "";
    
    // Uncomment to declare that input is required for this command.
    // Follow the template here to assure functionality of the Synopsis.
    // this.input = {
    //   "input_name": {
    //     "type": "plain", // Either text or plain.
    //     "name": "An example of plain input.",
    //     "description": "Example of plain input needed for the command to function."
    //   }
    // };

    // Uncomment to permit different options in the command
    // Follow the template here to assure functionality of the Synopsis.
    // this.options = {
    //   "d": {
    //     "readable_name" : "Direct Message",
    //     "description"   : "Send the ping via direct message instead of sending it in the chat.",
    //   },
    //   "c": {
    //     "readable_name" : "Custom Message",
    //     "description"   : "Send a message defined on the fly instead of the default ping response.",
    //     "needs_input"   : true,
    //   }
    // };

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