/**
 * Paint Command
 *
 * WARNING: THIS COMMAND CREATES MANY ROLES IN A SERVER. ACTIVATE ONLY IN SERVERS WHERE THIS ISN'T A PROBLEM.
 *
 * Currently, Sora needs to be at the top of the role list in the server for this to work. She also needs to be added to the
 * server with the right permissions.
 *
 * Features
 *  - Create new color roles in the server using the bot.
 *  - Set color roles to yourself
 *  - Unset color roles from yourself
 *  - List colors
 *  - Preview colors (NTH)
 *  - Mix colors (NTH)
 */
class PaintJob extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = ["paint", "color", "col", "pnt"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    this.helpText = 
    `This command can be used by anyone to customize their own colors!
    For this command to work properly, Sora's role must be at the top of the server.
    Check with the server admins to make sure it's the case!\n
     - \`color -c#124356\` - This creates a color in the server with the given hex value.
     - \`color -s#124356\` or \`color -sCOLORNAME\` - This sets the given color to yourself.
     - \`color -r\` - This removes your current color.
     - \`color -l\` - This lists all colors currently in the server.\n
    Happy Coloring!`;
    
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
      c: {
        readable_name : "Create",
        description   : "Send the ping via direct message instead of sending it in the chat.",
        needs_text   : true,
      },
      s: {
        readable_name : "Set",
        description   : "This will set a color to yourself. A user can only have one color set.",
        needs_text   : true,
      },
      r: {
        readable_name : "Remove",
        description   : "This will remove a color from yourself. Does nothing if a user doesn't have a color.",
      },
      l: {
        readable_name : "List",
        description   : "This will list all color roles in the current guild.",
      },
      x: { // @todo - should not be possible in pms and only be usable by admins
        readable_name : "Clear",
        description   : "This will remove all color roles from the given guild.",
        oplevel       : 1,
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

    // Uncomment to adjust the cooldown of the command.
    // The default cooldown is 5 seconds.
    this.cooldown = 2; // In seconds.

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

    // @todo - Check if Sora is at the top of the role list and has the proper permissions.
    // this.unitTests();

    // If the "c" option is used, a color role will be created.
    if ("c" in data.input.options) {
      this.createColor(data.input.options.c, data);
    }
    // If the "s" option is used, a color role will be set to the invoker.
    if ("s" in data.input.options) {
      this.setColor(data.input.options.s, data);
    }
    // If the "r" option is used, a color role will be removed from the invoker.
    if ("r" in data.input.options) {
      this.removeColorFromMember(data, data.msg.member);
    }
    // If the "l" option is used, list all color roles in the server.
    if ("l" in data.input.options) {
      this.listColorRolesInGuild(data);
    }
    // If the "x" option is used, delete all color roles in the server.
    if ("x" in data.input.options) {
      this.deleteAllColorRoles(data);
    }
  }

  createColor(input, data) {

    var color = this.getColorData(input, data);

    if(!color) {
      return false;
    }

    var found_color = this.findColorInCurrentGuild(color, data);

    // Check if the color already exists.
    if( found_color !== false) {
      data.msg.channel.send(`Seems like that color already exists! - <@&` + found_color.id + `>`);
      return false;
    }

    // Create the color role.
    data.msg.guild.createRole({
      name: color.name,
      color: data.input.options.c,
      mentionable: true,
      permissions: data.msg.guild.defaultRole.permissions,
    })
      .then((role) => {
        role.setPosition(data.msg.guild.roles.array().length - 2)
          .then(() => {
            data.msg.channel.send(`I've successfully created a new color in this server: ` + role);
          })
          .catch(() => {
            data.msg.author.send(`An error may have occured with the creation of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't deal well with roles that are above mine. :( You're going to have to move me to the top of your server role list!`);
            console.error;
          });
      })
      .catch(() => {
        data.msg.author.send(`An error may have occured with the creation of the color.\nI may not have permissions to create roles in this server. You will have to give me the **Manage Roles** permission!`);
        console.error;
      });

    return true;
  }

  setColor(input, data) {

    var color = this.getColorData(input, data);

    if (!color) {
      return false;
    }

    var color_role_to_set = this.findColorInCurrentGuild(color, data);

    // Check if the color exists.
    if (color_role_to_set === false) {
      data.msg.reply(`Seems like that color doesn't exist! You have to create it first. :O`);
      return false;
    }

    // Check if the member has a color.
    var member_current_color_role = this.getMemberColorInCurrentGuild(data.msg.member);
    
    // If someone tries to set the same color more than once...
    if (member_current_color_role !== false && member_current_color_role.id === color_role_to_set.id) {
      data.msg.reply(`hey, you already have that color! I can't paint you with the same color twice. xD`);
      return false;
    }

    // Remove color if the member has one already.
    if(member_current_color_role !== false) {
      // Remove color if one is set.
      this.removeColorFromMember(data, data.msg.member);
    }

    // Add the color to the member.
    data.msg.member.addRole(color_role_to_set)
      .then(() => {
        data.msg.reply(`all done! You look great in ${color_role_to_set}! ;) :sparkles:`);
      })
      .catch(() => {
        data.msg.author.send(`An error may have occured with the setting of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't set roles that are above mine. :( You're going to have to move me to the top of your server role list!`);
        console.error;
      });

    return true;

  }

  removeColorFromMember(data, member) {
    var member_current_color_role = this.getMemberColorInCurrentGuild(member);

    if (member_current_color_role === false) {
      return false;
    }

    member.removeRole(member_current_color_role)
      .then(() => {
        data.msg.channel.send(`You're all cleaned up! :sparkles:`);
      })
      .catch(() => {
        data.msg.author.send(`An error may have occured with the removing of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't set roles to users that have a role above mine. :( You're going to have to move me to the top of your server role list!`);
        console.error;
      });
  }

  getColorData(input, data) {

    // Try to get a color by name first if the input is a name.
    var found = data.msg.guild.roles.find('name', input + '.color');
    if (found !== null) {
      return {hex: found.hexColor, name: found.name, exists: true};
    }
    var found = data.msg.guild.roles.find('name', input);
    if (found !== null) {
      return {hex: found.hexColor, name: input, exists: true};
    }

    // At this point, we know the input is possibly a hex value.
    var colorHex = input;

    // Make sure the # is prepended.
    // Convenience. Users will be able to enter the rgb in hex without the # if they want.
    if (colorHex.indexOf("#") != 0) {
      colorHex = "#" + colorHex;
    }

    // Check if the hex color is valid.
    if(!this.isHexColor(colorHex)) {
      data.msg.reply(`That seems to be an invalid HEX value or color name!`)
      return false;
    }

    // Get a name for the color using the NTC library.
    var colorName = ntc.name(colorHex)[1] + ".color";

    return {hex: colorHex, name: colorName};
  }

  findColorInCurrentGuild(color, data) {
    var found_hex = data.msg.guild.roles.find('hexColor', color.hex);
    var found_name = data.msg.guild.roles.find('name', color.name);

    if (found_hex !== null) {
      return found_hex;
    }

    if (found_name !== null) {
      return found_name;
    }

    return false;
  }

  getMemberColorInCurrentGuild(member) {

    var colorFound = false;

    member.roles.every((role) => {
      if (role.name.includes('.color')) {
        colorFound = role;
        return false;
      }

      return true;
    });

    return colorFound;
  }

  listColorRolesInGuild(data) {
    var list_msg = `Here is the list of all colors in this server:\n\n`;

    data.msg.guild.roles.every((role) => {
      if(role.name.includes('.color')){
        list_msg += `  - ${role} \`${role.hexColor}\`\n`;
      }
      return true;
    });

    data.msg.channel.send(`_Scanning available colors in this server..._`)
      .then(() => {
        this.client.startTyping(data.msg.channel, 2500)
          .then(() => {
            if (list_msg == `Here is the list of all colors in this server:\n\n`) {
              data.msg.channel.send(`There are no colors in this server! Better start creating some. :)`);
            } else {
              data.msg.channel.send(list_msg);
            }
         });
      });

    return;
    
  }

  deleteAllColorRoles(data) {
    data.msg.guild.roles.every((role) => {
      if (role.name.includes('.color')) {
        role.delete()
          .then(r => console.log(`Deleted color role ${r}`))
          .catch(console.error);
      }
      return true;
    });

    data.msg.reply(`I have cleared all color roles from the server. :)`);

    return;
  }

  isHexColor(string) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string);
  }

}

module.exports = PaintJob;