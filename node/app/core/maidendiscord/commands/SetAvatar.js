/**
 * Set Avatar.
 *
 * Use this command to set the avatar for a maiden.
 *
 * This command is to make it easier for me. Shouldn't be usable by others.
 */
class SetAvatar extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
    this.aliases = [ "sa"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.helpText = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.descText = "";
    
    // Uncomment to declare that input is required for this command.
    // Follow the template here to assure functionality of the Synopsis.
    this.input = {
      avatar: {
        "type": "text", // Either text or plain.
        "name": "Avatar Integer",
        "description": "New Avatar that Sora will use."
      }
    };

    // Uncomment to permit different options in the command
    // Follow the template here to assure functionality of the Synopsis.
    // this.options = {
    //   d: {
    //     readable_name : "Direct Message",
    //     description   : "Send the ping via direct message instead of sending it in the chat.",
    //   },
    //   c: {
    //     readable_name : "Custom Message",
    //     description   : "Send a message defined on the fly instead of the default ping response.",
    //     needs_text   : true,
    //   }
    // };

    // Uncomment to configure the command.
    // You can adjust which channels the command can be used in, as well as who can use the command.
    this.config = {
      auth: {
        guilds: [],
        channels: [],
        pms: false,
        users: [],
        oplevel: 2,
      },
    };
	
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

    // Get avatar integer.
    // This is a "quickwin" command. I name the avatar files '1.jpg', '2.jpg', etc. Then I give it as input to fetch them.
    let avatar_i = data.input.full;

    // @TODO - Download avatar with a given URL, rename it, and save it to the maiden's files.

    // Set the avatar.
    this.client.user.setAvatar(this.client.assets + 'avatars/' + avatar_i + '.jpg')
     .then(() => console.log(`New avatar set.`))
     .catch(console.error);

  }

}

module.exports = SetAvatar;