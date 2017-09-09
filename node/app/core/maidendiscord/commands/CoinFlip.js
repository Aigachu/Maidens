/**
 * Coinflip command.
 *
 * Allows a user to emulate a coinflip.
 *
 * Returns either 'Heads' or 'Tails' !
 */
class CoinFlip extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
    this.aliases = [ "cf", "flip"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.helpText = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.descText = "";
    
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
    //     "needs_text"   : true,
    //   }
    // };

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {Object} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   (Object) options => Contains all of the options organized in an object by key, similar to above.
   *   (Array)  input   => Contains the input separated into an array. (Shoutouts to old params style)
   *     (String) full    => Contains the full input in a text string.
   *     (Array)  array   => Contains the input separated in an array.
   *     (String) raw     => Contains the input without any modifications made to it. Useful for some commands.
   * }
   */
  tasks(data) {

    // Get the value of the flip. Returns either 0 or 1.
    let flip = Math.floor(Math.random() * 2);

    // The flip result is determined by the returned value.
    // 0 is Tails.
    // 1 is Heads.
    let result = ((flip === 0) ? 'Tails' : 'Heads');

    // This command will have different types of flips. It will be selected by random.
    // Each 'flip type' will take different amounts of time and print different messages.
    // We'll store these in an array.
    let flip_types = [];

    // Setting the flip types.
    flip_types.push({
      message: "_Coinflip emulation has begun. Just a moment..._",
      timeout: 2000
    });

    flip_types.push({
      message: "_Coinflip emulation has begun. Looks like..._",
      timeout: 1000
    });

    flip_types.push({
      message: "_Coinflip emulation has begun. The coin spins_\nWait for it...",
      timeout: 5000
    });

    // The 'rand' variable will store the flip type.
    // We get it by generating a random number when choosing which key to get from the array.
    let rand = flip_types[Math.floor(Math.random() * flip_types.length)];

    // Send the flip to the channel.
    data.msg.channel.send(rand.message)
      .then(() => {
        // Start typing for the amount of time the flip_type is set to.
        this.client.startTyping(data.msg.channel, rand.timeout)
          .then(() => {
            data.msg.channel.send(`<@${data.msg.author.id}> obtained **${result}** !`);
          });
      });
  }

}

module.exports = CoinFlip;