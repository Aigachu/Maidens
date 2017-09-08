class ThirdEye extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		// this.aliases = [ "alias1", "alias2"];
    
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
        readable_name : "List dimensions",
        description   : "List all servers and their channels (including all ids)",
      },
      s: {
        readable_name : "Start listening",
        description   : "Start the thirdeye functionality.",
        needs_text   : true,
      },
      q: {
        readable_name : "Quit listening",
        description   : "Stop the thirdeye functionality completely.",
        needs_text   : true,
      },
      a: {
        readable_name : "Add a link",
        description   : "Add a link from the current server to another server.",
        needs_text   : true,
      },
      d: {
        readable_name : "Remove a link",
        description   : "Remove a link from the current server.",
        needs_text   : true,
      },
      x: {
        readable_name : "Clear all dimension links.",
        description   : "Clear all dimension links from all servers!",
        needs_text   : true,
      },
    };

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
    
    // This command extends Sora's basic client, adding dimensions_links to her.
    this.client.dimension_links = {};

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {Object} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   options => Contains all of the options organized in an object by key, similar to above.
   *   array => Contains the input separated into an array. (Shoutouts to old params style)
   *   full => Contains the full input in a text string.
   * }
   */
  tasks(data) {

    // if(!_.isEmpty(data.input.full)) {
    //   this.client.dimension_links[data.msg.guild.id] = data.input.full;
    //   console.log(this.client.dimension_links);
    // }

    // // If the "l" option is used, list dimensions Sora is a part of, as well as their text channels.
    // if ("l" in data.input.options) {
    //   this.listDimensions(data);
    // }
    // // If the "s" option is used, activate the thirdeye functionality.
    // if ("s" in data.input.options) {
    //   this.startListening(data);
    // }
    // // If the "q" option is used, deactivate the thirdeye functionality.
    // if ("q" in data.input.options) {
    //   this.stopListening(data);
    // }
    // // If the "l" option is used, list all color roles in the server.
    // if ("l" in data.input.options) {
    //   this.listColorRolesInGuild(data);
    // }
    // // If the "x" option is used, delete all color roles in the server.
    // if ("x" in data.input.options) {
    //   this.deleteAllColorRoles(data);
    // }
  }

  listLinks() {

  }

  startListening(data) {

    if (_.isEmpty(this.client.dimension_links)) {
      data.msg.reply(`I couldn't start the ThirdEye experiment...There doesn't seem to be any dimension links in place.`);
      return false;
    }

    this.client.listeners.thirdeye = {
      listen: (client, msg) => {
        if (!(msg.guild.id in client.dimension_links)) {
          // Nothing to do
          return false;
        }


      },
    }
  }

  stopListening(data) {
    if (!('thirdeye' in this.client.listeners)) {
      data.msg.channel.send(`The thirdeye functionality isn't activated. :o`);
      return false;
    }

    delete this.client.listeners.thirdeye;

    data.msg.channel.send(`Phew...That was fun. All done now!`);

    return true;
  }

  listDimensions(data) {

    var list_msg = `Here is the list of all dimensions I can see:\n\n`;

    this.client.guilds.every((guild) => {
      list_msg += `  - **[${guild.name}]**\n`;
      guild.channels.every((channel) => {
        if(channel.type == 'text')
          list_msg += `   + *${channel.name}* \`(${channel.id})\`\n`;
        return true;
      });
      list_msg += `\n`;
      return true;
    });    

    data.msg.channel.send(`_Scanning available dimensions..._`)
      .then(() => {
        this.client.startTyping(data.msg.channel, 3500)
          .then(() => {
            data.msg.channel.send(list_msg);
            data.msg.channel.send(`Try adding one of the channel ids after \`thirdeye\` in the command...`);
          });
      });

    return;
  }

}

module.exports = ThirdEye;