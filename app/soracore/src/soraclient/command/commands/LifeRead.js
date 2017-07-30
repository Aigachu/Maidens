const Command = require('../Command');

class LifeRead extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "lr"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.help = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.description = "";
    
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

    var lifereadings = 0;
    var offline = 0;

    data.msg.guild.members.every((member) => {
      if (member.user.bot == true) {
        return true;
      }
      if (member.user.presence.status != 'offline') {
        lifereadings++;
      } else {
        offline++;
      }
      return true;
    });

    data.msg.reply(`_Scanning server life readings..._`)
      .then(() => {
        this.client.startTyping(data.msg.channel, 3000)
          .then(() => {
            data.msg.channel.send(`Life reading: **${lifereadings}**`);
            if(offline != 0) {
              data.msg.channel.send(`However...There seem to be **${offline}**...paranormal presences lurking about...`);
            }
          });
      });
  }

}

module.exports = LifeRead;