/**
 * Reminder Command
 *
 * @author Aigachu (aigachu.sama@gmail.com)
 * @comment By far the hardest thing I've had to do so far. :sweat:
 *
 * Management for reminders
 */
class Reminder extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		// this.aliases = [ "reminder" ];
    
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
      l: {
        readable_name : "List Reminders",
        description   : "List all reminders you have stored in the database.",
        needs_text   : true,
      },
      x: {
        readable_name : "Clear Reminders",
        description   : "Delete all of your defined reminders from the database.",
        needs_text   : true,
      }
    };

    // Uncomment to configure the command.
    // You can adjust which channels the command can be used in, as well as who can use the command.
    this.config = {
      auth: {
        guilds: [],
        channels: [],
        pms: true,
        users: [],
        oplevel: 0,
      },
    };
    
    // Uncomment to adjust the cooldown of the command.
    // The default cooldown is 5 seconds.
    this.cooldown = 0;

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

    // If the "l" option is used
    if ("l" in data.input.options) {
      // Send list of reminders to the user that called the command.
      this.client.reminder.sendList(data.msg, data.msg.author);
      return;
    }

    // If the "l" option is used
    if ("x" in data.input.options) {
      // Delete all reminders for the user that called the command, and send a confirmation.
      this.client.reminder.clear(data.msg.author.id);
      data.msg.channel.send(`I've successfully cleared all of your stored reminders, ${data.msg.author}!`);
      return;
    }

    return;

  }

}

module.exports = Reminder;