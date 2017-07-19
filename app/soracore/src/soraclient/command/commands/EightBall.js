const Command = require('../Command');

class EightBall extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "8ball", "8b"];
    
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

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   options => Contains all of the options organized in an object by key, similar to above.
   *   array => Contains the input seperated into an array. (Shoutouts to old params style)
   *   full => Contains the full input in a text string.
   * }
   */
  tasks(data) {

    if(!_.isEmpty(data.input.full)) {
      
      var answers = [];

      answers.push({
        message: "8ball says: \"_It is certain._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_It is decidedly so._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Without a doubt._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Yes, definitely._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_You may rely on it._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_As I see it, yes._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Most likely._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Outlook good._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Yes._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Signs point to yes._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Reply hazy try again._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Ask again later._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Better not tell you now._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Cannot predict now._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Concentrate and ask again._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Don't count on it._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_My reply is no._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_My sources say no._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Very doubtful._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Outlook not so good._\"",
        timeout: 2
      });

      var rand = answers[Math.floor(Math.random() * answers.length)];

      var client = this.client;
      setTimeout(function(){
        client.reply(data.msg, rand.message);
      }, 1000 * rand.timeout);
    } else {
      this.client.reply( data.msg, "8ball says: \"_Now now, ask me something. Don't be shy!_\"");
    }

  }

}

module.exports = EightBall;