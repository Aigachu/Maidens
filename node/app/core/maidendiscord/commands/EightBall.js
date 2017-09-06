/**
 * 8ball command.
 *
 * This command emulates the 8ball we know and love, answering any given question.
 *
 * Returns an answer to a question.
 */
class EightBall extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "8ball", "8b"];
    
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
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   (Object) options => Contains all of the options organized in an object by key, similar to above.
   *   (Array)  input   => Contains the input seperated into an array. (Shoutouts to old params style)
   *     (String) full    => Contains the full input in a text string.
   *     (Array)  array   => Contains the input seperated in an array.
   *     (String) raw     => Contains the input without any modifications made to it. Useful for some commands.
   * }
   */
  tasks(data) {

    // If some input was actually given, we can process the command.
    // @TODO - Check if the input is actually a question.
    if(!_.isEmpty(data.input.full)) {
      
      // We'll store all possible answers in an array.
      var answers = [];

      answers.push({
        message: `8ball says: _**"It is certain."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"It is decidedly so."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Without a doubt."**_`,
        timeout: 3000
      });
      answers.push({
        message: `8ball says: _**"Yes, definitely."**_`,
        timeout: 4000
      });
      answers.push({
        message: `8ball says: _**"You may rely on it."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"As I see it, yes."**_`,
        timeout: 3000
      });
      answers.push({
        message: `8ball says: _**"Most likely."**_`,
        timeout: 4000
      });
      answers.push({
        message: `8ball says: _**"Outlook good."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Yes."**_`,
        timeout: 4000
      });
      answers.push({
        message: `8ball says: _**"Signs point to yes."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Reply hazy try again."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Ask again later."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Better not tell you now."**_`,
        timeout: 3000
      });
      answers.push({
        message: `8ball says: _**"Cannot predict now."**_`,
        timeout: 4000
      });
      answers.push({
        message: `8ball says: _**"Concentrate and ask again."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Don't count on it."**_`,
        timeout: 3000
      });
      answers.push({
        message: `8ball says: _**"My reply is no."**_`,
        timeout: 4000
      });
      answers.push({
        message: `8ball says: _**"My sources say no."**_`,
        timeout: 2000
      });
      answers.push({
        message: `8ball says: _**"Very doubtful."**_`,
        timeout: 4000
      });
      answers.push({
        message: `8ball says: _**"Outlook not so good."**_`,
        timeout: 2000
      });

      // The 'rand' variable will contain the answer chosen.
      // We'll use a random number for the array key.
      var rand = answers[Math.floor(Math.random() * answers.length)];

      // Start typing with the chosen answer's timeout, then send the reply to the user.
      this.client.startTyping(data.msg.channel, rand.timeout)
        .then(() => {
          data.msg.reply(rand.message);
        });
        
    // If no input is given, then no question was actually asked.
    } else {
      this.client.reply( data.msg, "8ball says: \"_Now now, ask me something. Don't be shy!_\"");
    }

  }

}

module.exports = EightBall;