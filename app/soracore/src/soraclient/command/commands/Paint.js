const Command = require('../Command');

/**
 * Paint Command
 *
 * WARNING: THIS COMMAND CREATES MANY ROLES IN A SERVER. ACTIVATE ONLY IN SERVERS WHERE THIS ISN'T A PROBLEM.
 *
 * Features
 *  - Create new color roles in the server using the bot.
 *  - Set color roles to yourself
 *  - Unset color roles from yourself
 *  - List colors
 *  - Preview colors (NTH)
 *  - Mix colors (NTH)
 */
class Paint extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = ["pnt"];
    
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
    this.options = {
      c: {
        readable_name : "Create",
        description   : "Send the ping via direct message instead of sending it in the chat.",
      },
      s: {
        readable_name : "Set",
        description   : "This will set a color to yourself. A user can only have one color set.",
        needs_text   : true,
      },
      r: {
        readable_name : "Remove",
        description   : "This will remove a color from yourself. Does nothing if a user doesn't have a color.",
        needs_text   : true,
      }
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

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   * (Object) input {
   *   options => Contains all of the options organized in an object by key, similar to above.
   *   array => Contains the input seperated into an array. (Shoutouts to old params style)
   *   full => Contains the full input in a text string.
   * }
   */
  tasks(data) {
    // If the "c" option is used, a color role will be created.
    if ("c" in data.input.options) {
      this.createColor(data.input.options.c, data);
    }
    // If the "c" option is used, a color role will be created.
    if ("s" in data.input.options) {
      this.setColor(data.input.options.s, data);
    }
  }

  createColor(hex, data) {

    var color = this.getColorData(hex, data);

    if(!color) {
      return false;
    }

    // Check if the color already exists.
    if(this.findColorInCurrentGuild(color.hex, data) !== false) {
      data.msg.channel.send(`Seems like that color already exists! - <@&` + data.msg.guild.roles.find('hexColor', color.hex).id + `>`);
      return false;
    }

    // Create the color role.
    data.msg.guild.createRole({
      name: color.name + " (" + color.hex + ")",
      color: data.input.options.c,
      mentionable: true,
      permissions: data.msg.guild.defaultRole.permissions,
      position: 999,
    })
    .then( (role) => {
      data.msg.channel.send(`I've successfully created a new color in this server: ` + role);
      console.log(`Created color ${role}`);
    })
    .catch( () => {
      console.error;
    });
  }

  setColor(hex, data) {
    var inputted_color = this.getColorData(hex, data);

    if (!inputted_color) {
      return false;
    }

    var color_to_set = this.findColorInCurrentGuild(color.hex, data);

    // Check if the color exists.
    if (color_to_set === false) {
      data.msg.channel.send(`Seems like that color doesn't exist! You have to create it first. :O`);
      return false;
    }


  }

  getColorData(hex, data) {
    var colorHex = hex;

    // Make sure the # is prepended.
    // Convenience. Users will be able to enter the rgb in hex without the # if they want.
    if (colorHex.indexOf("#") != 0) {
      colorHex = "#" + colorHex;
    }

    // Check if the hex color is valid.
    if(!this.isHexColor(colorHex)) {
      data.msg.reply(`That seems to be an invalid HEX value!`)
      console.log("Invalid Hex Color: " + colorHex);
      return false;
    }

    // Get a name for the color using the NTC library.
    var colorName = ntc.name(colorHex)[1];

    return {hex: colorHex, name: colorName};
  }

  findColorInCurrentGuild(hex, data) {
    var colorFound = data.msg.guild.roles.find('hexColor', hex);

    if (colorFound === null) {
      return false;
    }

    var getColorRegex = /[0-9A-F#]{7}/gi;

    var matches = colorFound.name.match(getColorRegex);

    if(matches != null) {
      return colorFound;
    }

    return false;
  }

  getAllColorRoles(guild) {
    return guild.roles.findAll();
  }

  isHexColor(string) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string);
  }

}

module.exports = Paint;