/**
 * IronMan command.
 *
 * This command gives the caller a list of characters to use in an ironman against another character.
 *
 * Another command for fun stuff.
 */
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

    // Get all SSB4 character directories from the maiden's assets folder.
    let smash4_character_directories = fs.readdirSync(this.client.assets + "smash4-character-portraits");

    // Why the fuck is this a - 2?
    // Oh, right. There are two folders that aren't characters...
    // Misc...And MEMES...LMAO!
    // Anyways, this gets the roster size.
		let roster_size = smash4_character_directories.length - 2;

    // The input data should be a number.
    // @TODO - Check if the data is a number before even doing this check.
    if(data.input.full > roster_size) {

      // Send a message saying they fucked up.
      data.msg.channel.send("That number is too high! There are only **" + roster_size + "** characters in the Smash 4 roster you weenie! xD");
    
    // If the Input isn't empty and is actually a number.
    } else if(!_.isEmpty(data.input.full) && !isNaN(data.input.full)) {
      
      // Get the number of characters from the data.
			let number_of_characters = data.input.full;

      // Array to store the list of characters.
			let charlist = [];

      // Array to store the list of characters that are chosen for the caller.
			let chosen_characters = [];

      // For as many times as the given number from the input...
      for( let i = 0; i < number_of_characters; i++ ) {

        // Get a random character.
				let random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];

        // If the random character chosen is 'Misc', 'Meme' or already chosen, we re-select
        // @TODO - Load characters into an array, and when they are chosen, slice them.
        // Also, slice Misc and Memes before even looping into the array.
        while(random_character in chosen_characters || random_character === "Misc" || random_character === "Memes") {
          random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];
        }

        // Add character to the charlist.
        charlist[i] = random_character;

        // Add character to the chosen characters.
        chosen_characters[random_character] = random_character;
      }

      // Set message.
			let message = "Here's your list of iron man characters!\n\n";

      // Append characters the the list.
      charlist.every((char) => {
        message += `-- **${char}**\n`;
        return true;
      });

      message += "\nThere we go! Good luck against your challenger. ;)";

      data.msg.channel.send(message);

    } else {
      data.msg.channel.send("Hm?");
    }

  }

}

module.exports = IronMan;