/**
 * Purge command.
 *
 * Purge messages from the given user.
 */
class Purge extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "pu" ];
    
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
    this.options = {
      n: {
        readable_name : "Number",
        description   : "Number of messages to purge.",
      }
    };

    // Uncomment to configure the command.
    // You can adjust which channels the command can be used in, as well as who can use the command.
    this.config = {
      auth: {
        guilds: [],
        channels: [],
        pms: false,
        users: [],
        oplevel: 1,
      },
    };
    
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

    // Variable containing the number of messages to purge.
    var count = 5;

    // If the "n" option is used, overwrite the count.
    if ("n" in data.input.options) {
      // Make sure the input is a number.
      // @TODO - Throw an error if it's not.
      if (!isNaN(data.input.options.d)) {
        count = data.input.options.n;
        if (count > 10)
          count = 10;
      }
    }

    // Trim given input for the user.
    data.input.full = data.input.full.trim();
    data.input.full = data.input.full.replace('<@', '');
    data.input.full = data.input.full.replace('>', '');
    data.input.full = data.input.full.replace('!', '');

    // Fetch the member object.
    var member = data.msg.guild.members.find('id', data.input.full);

    // If he can't be found, we can't do anything.
    // @TODO - Throw an error or something.
    if (member === null) {
      return false;
    }

    // Purge the member.
    this.client.watchdog.purge(member, count);
    
    // Send a nice message!
    data.msg.channel.send(`I could have sworn I just saw ${count} messages from ${member}...Now they're gone. :thinking:`);

    // Delete the caller's command. Remove all traces of the act...
    data.msg.delete();

  }

}

module.exports = Purge;