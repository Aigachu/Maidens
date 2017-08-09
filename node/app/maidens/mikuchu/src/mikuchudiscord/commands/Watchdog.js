class Watchdog extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "watch", "wd"];
    
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
      e: {
        readable_name : "Enable",
        description   : "Enable the watchdog in the current guild.",
      },
      d: {
        readable_name : "Disable",
        description   : "Disable the watchdog in the current guild.",
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
        oplevel: 2,
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

    // If the "e" option is used
    if ("e" in data.input.options) {
      this.client.watchdog.enable(data.msg.guild);
      data.msg.channel.send('Enabled the watchdog in this server!');
      return;
    }

    // If the "d" option is used
    if ("d" in data.input.options) {
      this.client.watchdog.disable(data.msg.guild);
      data.msg.channel.send('Disabled the watchdog in this server!');
      return;
    }

    // Enable by default.
    this.client.watchdog.enable(data.msg.guild);
    data.msg.channel.send('Enabled the watchdog in this server!');
    
  }

}

module.exports = Watchdog;