class IronMan extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "iman", "ironman"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.helpText = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.descText = "";
    
    // Uncomment to declare that input is required for this command.
    // Follow the template here to assure functionality of the Synopsis.
    // this.input = {
    //   input_name: {
    //     type: "plain", // Either text or plain.
    //     name: "An example of plain input.",
    //     description: "Example of plain input needed for the command to function."
    //   }
    // };

    // Uncomment to permit different options in the command
    // Follow the template here to assure functionality of the Synopsis.
    // this.options = {
    //   d: {
    //     "readable_name" : "Direct Message",
    //     "description"   : "Send the ping via direct message instead of sending it in the chat.",
    //   },
    //   c: {
    //     readable_name : "Custom Message",
    //     description   : "Send a message defined on the fly instead of the default ping response.",
    //     needs_text   : true,
    //   }
    // };

    // Uncomment to configure the command.
    // You can adjust which channels the command can be used in, as well as who can use the command.
    // this.config = {
    //   auth: {
    //     guilds: [],
    //     channels: [],
    //     pms: false,
    //     users: [],
    //   },
    // };
    
    // Uncomment to adjust the cooldown of the command.
    // The default cooldown is 5 seconds.
    // this.cooldown = 5;

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

    var smash4_character_directories = fs.readdirSync(this.client.assets + "smash4-character-portraits");

    var roster_size = smash4_character_directories.length - 2;

    if(data.input.full > roster_size) {
      data.msg.channel.send("That number is too high! There are only **" + roster_size + "** characters in the Smash 4 roster you weenie! xD");
    } else if(!_.isEmpty(data.input.full) && !isNaN(data.input.full)) {
      // Get all images from Smash 4 resources folder.

      var number_of_characters = data.input.full;

      var charlist = [];

      var chosen_characters = [];

      for( var i = 0; i < number_of_characters; i++ ) {
        var random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];

        while(random_character in chosen_characters || random_character == "Misc" || random_character == "Memes") {
          random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];
        }

        charlist[i] = random_character;
        chosen_characters[random_character] = random_character;
      }

      var message = "Here's your list of iron man characters!\n\n";

      for (var key in charlist) {
        if(charlist.hasOwnProperty(key)) {
          message += "-- **" + charlist[key] + "**\n";
        }
      }

      message += "\nThere we go! Good luck against your challenger. ;)";

      data.msg.channel.send(message);

    } else {
      data.msg.channel.send("Hm?");
    }

  }

}

module.exports = IronMan;