const Command = require('../Command');

class RollDice extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "rd" , "roll"];
    
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
    this.options = {
      "n": {
        "readable_name" : "Number of dice",
        "description"   : "Customize the number of dice that will be thrown. If no number is specified, it will roll 2 dice instead of one.",
      },
      "d": {
        "readable_name" : "Number of faces",
        "description"   : "Customize the number of faces the dice you will throw will have.",
        "needs_text"   : true,
      }
    };

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

    // By default, Sora will roll 6-faced dice.
    var dice_faces = 6;

    // By default, Sora will only roll 1 die.
    var dice_count = 1;

    // Keeps a total.
    var total = 0;

    // Array to hold all of the rolls.
    var result = "";

    // If the "n" option is used, change the text Sora says.
    if ("n" in data.input.options) {

      // @todo - Throw an error if the data is not a number.
      // @todo - Throw an error if the number is too much.
      dice_count = (data.input.options["n"] == "n") ? 1 : data.input.options["n"];
    }

    // If the "c" option is used, change the text Sora says.
    if ("d" in data.input.options) {

      // @todo - Throw an error if the data is not a number.
      // @todo - Throw an error if the number is too much.
      dice_faces = (data.input.options["d"] == "d") ? 6 : data.input.options["d"];
    }

    // Roll the dice
    for (var i = 0; i < dice_count; i++) {
      var roll = (Math.floor(Math.random() * dice_faces) + 1);
      result += roll + ", ";
      total += roll;
    }

    result = result.substr(0, result.length - 2);

    var result_msg = " the result of your roll is: **" + result + "**!"

    if(dice_count > 1) {
      result_msg += "\nThis gives you a total of: **" + total + "**!";
    }

    var roll_types = [];

    roll_types.push({
      message: "_rolls the dice normally_",
      timeout: 1000
    });
    roll_types.push({
      message: "_rolls the dice violently_\n_the die falls on the ground_",
      timeout: 2000
    });
    roll_types.push({
      message: "_accidentally drops the dice on the ground while getting ready_\nOops! Still counts right...?",
      timeout: 2000
    });
    roll_types.push({
      message: "_spins the dice_\nWait for it...",
      timeout: 5000
    });

    var rand = roll_types[Math.floor(Math.random() * roll_types.length)];

    data.msg.channel.send(rand.message)
      .then(() => {
        this.client.startTyping(data.msg.channel, rand.timeout)
          .then(() => {
            data.msg.reply(result_msg);
          });
      });
  }

}

module.exports = RollDice;