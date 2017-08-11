class Timeout extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "time", "to"];
    
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
      d: {
        readable_name : "Duration",
        description   : "How long the person must be timed out.",
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

    var duration = 30;

    // If the "d" option is used, overwrite the duration.
    if ("d" in data.input.options) {
      if (!isNaN(data.input.options.d)) {
        duration = data.input.options.d;
      }
    }

    data.input.full = data.input.full.trim();
    data.input.full = data.input.full.replace('<@', '');
    data.input.full = data.input.full.replace('>', '');
    data.input.full = data.input.full.replace('!', '');

    var member = data.msg.guild.members.find('id', data.input.full);

    if (member === null) {
      return false;
    }
    
    this.client.watchdog.timeout(member, duration);
    
    data.msg.channel.send(`Uh oohhh! Someone was being bad!\nTake a quick **${duration} second** break, ${member}!`);

    data.msg.delete();

  }

}

module.exports = Timeout;