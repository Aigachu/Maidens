/**
 * Love command.
 *
 * Determines the % of love between the caller and the input they give.
 *
 * Returns % of love.
 */
class Love extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		// this.aliases = [ "alias1", "alias2"];
    
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
		
		// Uncomment to adjust the cooldown of the command.
		// The default cooldown for users is 5 seconds.
		// By default, commands do not have a global cooldown.
		// this.cooldown = {
		// 	global: 0,
		// 	user: 5,
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

    // Variable to hold the message.
    let message = '';

    // Processes the command only if there's input.
    if(!_.isEmpty(data.input.full)) {
      
      // Get the thing the caller is getting love percentage for.
      // Lol Aiga naming your variable 'thing' really? xD
      let thing = data.input.full;

      // Calculate the percent.
      // It's completely random.
      // @TODO - Make it calculate a percent using an algorithm, so the result is always the same.
      let percent = Math.floor(Math.random() * 100);
      
      // Store the message to be returned.
      message = `There is __**${percent}%**__ love between ${data.msg.author} and **${thing}**!`;
    
    // I'll be honest, I forget the joke behind the message that is returned here. But it seems funny.
    } else {
      // Store the message to be returned.
      message = `${data.msg.author}, you have 100% for ZeRo & M2K's AS5es if you don't specify an object or person!`;
    }

    // Send the message.
    data.msg.channel.send(message);

  }

}

module.exports = Love;