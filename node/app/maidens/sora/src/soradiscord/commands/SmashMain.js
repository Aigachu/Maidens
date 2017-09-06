/**
 * Implements the main command.
 * Randomly selects a main from Super Smash Brothers for Wii U/3DS, for the user of the command.
 * Posts the image of the main.
 * Color Palette Randomization too!
 *
 * IF BAYONIGGA IS CHOSEN, POP OUT THE "OH NON" MEME AS WELL FOR FUNNIES.
 *
 * THIS IS A NICE TO HAVE - NOT A TOP PRIORITY.
 * SAVES LAST 10 MAINS.
 *
 * MP3 FILES OF THE ANNOUNCER SAYING THE NAME OF THE CHARACTER IN A VOICE CHANNEL ONCE THE COMMAND IS USED.
 *
 * @TODO - FIX THIS COMMAND. IT IS CURRENTLY NOT WORKING BECAUSE OF THIS ISSUE.
 * https://github.com/Aigachu/discord-maidens/issues/12
 */
class SmashMain extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
    this.aliases = [ "s4main", "smain", "main"];
    
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

    // Get all images from Smash 4 resources folder.
    // var smash4_character_directories = fs.readdirSync(this.client.assets + "smash4-character-portraits");

    // var character_name = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];

    // var character_images = fs.readdirSync(this.client.assets + "smash4-character-portraits/" + character_name);

    // var random_image = character_images[Math.floor(Math.random() * character_images.length)];

    // this.client.reply(data.msg, "! Your new main is..._drumroll_");

    // console.log(this.client.assets + 'smash4-character-portraits/' + character_name + "/" + random_image);
    
    // data.msg.channel.send('Test file.', { 
    //   files: [
    //     this.client.assets + 'smash4-character-portraits/' + character_name + "/" + random_image
    //   ],
    // });

    data.msg.channel.send('This command is temporarily disabled. :( Pester Aiga to fix it!');

  }

}

module.exports = SmashMain;