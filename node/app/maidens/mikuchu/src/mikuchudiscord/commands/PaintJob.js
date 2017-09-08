/**
 * Paint Command
 *
 * WARNING: THIS COMMAND CREATES MANY ROLES IN A SERVER. ACTIVATE ONLY IN SERVERS WHERE THIS ISN'T A PROBLEM.
 *
 * ANOTHER WARNING: Currently, The Bot needs to be at the top of the role list in the server for this to work.
 * She also needs to be added to the server with the right permissions. For this, a permission bit was set in
 * the bot adding links so that all maidens have great power in a server.
 *
 * Features
 *  - Create new color roles in the server using the bot.
 *  - Set color roles to yourself
 *  - Unset color roles from yourself
 *  - List colors
 *
 * Future Features (@TODO)
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
    For this command to work properly, my role must be at the top of the server.
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
				oplevel      : 1,
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
		
		// @todo - Check if the bot is at the top of the role list and has the proper permissions.
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
	
	/**
	 * Create a color with the given input.
	 * @param  {String} input Input given for the color to create.
	 * @param  {Object} data  Command data retrieved through parsing.
	 * @return {Boolean}      True upon success. False upon failure.
	 */
	createColor(input, data) {
		
		// Get the Color data.
		let color = this.getColorData(input, data);
		
		// If the color data wasn't properly fetched.
		if(!color) {
			return false;
		}
		
		// Get the color role in the current guild if it exists already.
		let found_color = this.findColorInCurrentGuild(color, data);
		
		// Check if the color already exists.
		if( found_color !== false) {
			data.msg.channel.send(`Seems like that color already exists! - <@&` + found_color.id + `>`);
			return false;
		}
		
		// Create the color role with the proper values.
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
					.catch((error) => {
						data.msg.author.send(`An error may have occured with the creation of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't deal well with roles that are above mine. :( You're going to have to move me to the top of your server role list!`);
						console.error(error);
					});
			})
			.catch((error) => {
				data.msg.author.send(`An error may have occured with the creation of the color.\nI may not have permissions to create roles in this server. You will have to give me the **Manage Roles** permission!`);
				console.error(error);
			});
		
		return true;
	}
	
	/**
	 * Set Color to a member.
	 * @param 	{String} input 	Input from the user issuing the command.
	 * @param 	{Object} data  	Data obtained from parsing the command.
	 * @return 	{Boolean}				True upon success. False upon failure.
	 */
	setColor(input, data) {
		
		// Get the color data.
		let color = this.getColorData(input, data);
		
		// If a color wasn't obtained, we do nothing.
		if (!color) {
			return false;
		}
		
		// Get the color role that will be set.
		let color_role_to_set = this.findColorInCurrentGuild(color, data);
		
		// Check if the color exists.
		// If it doesn't, we can't set it. We'll tell the user that they must create it.
		if (color_role_to_set === false) {
			data.msg.reply(`Seems like that color doesn't exist! You have to create it first. :O`)
				.then((reply) => {
					// Do nothing with reply.
				}).catch(console.error);
			return false;
		}
		
		// Check if the member currently has a color.
		let member_current_color_role = this.getMemberColorInCurrentGuild(data.msg.member);
		
		// If someone tries to set the same color more than once...
		if (member_current_color_role !== false && member_current_color_role.id === color_role_to_set.id) {
			data.msg.reply(`hey, you already have that color! I can't paint you with the same color twice. xD`)
				.then((reply) => {
					// Do nothing with reply.
				}).catch(console.error);
			return false;
		}
		
		// Remove color if the member has one already.
		if (member_current_color_role !== false) {
			// Remove color if one is set.
			this.removeColorFromMember(data, data.msg.member);
		}
		
		// Add the color to the member.
		data.msg.member.addRole(color_role_to_set)
			.then(() => {
				data.msg.reply(`all done! You look great in ${color_role_to_set.name.replace('.color', '')}! ;) :sparkles:`)
					.then((reply) => {
						// Do nothing with reply.
					}).catch(console.error);
			})
			.catch((error) => {
				data.msg.author.send(`An error may have occured with the setting of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't set roles that are above mine. :( You're going to have to move me to the top of your server role list!`);
				console.error(error);
			});
		
		return true;
		
	}
	
	/**
	 * Remove color from a member.
	 * Color doesn't need to be specified because users can only have 1 color at once.
	 * @param  {Object}               data    Data from the parsed command.
	 * @param  {GuildMember} member  Guild member to clean color from.
	 */
	removeColorFromMember(data, member) {
		
		// Fetch color role from the member.
		let member_current_color_role = this.getMemberColorInCurrentGuild(member);
		
		// If there's no color to remove, then we can just return. Nothing to do.
		if (member_current_color_role === false) {
			return false;
		}
		
		// Remove the role and send confirmation message.
		// Error message if something went wrong.
		// If an error happens, the bot may not have permissions to tamper with the member's roles.
		member.removeRole(member_current_color_role)
			.then(() => {
				data.msg.channel.send(`You're all cleaned up! :sparkles:`);
			})
			.catch((error) => {
				data.msg.author.send(`An error may have occured with the removing of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't set roles to users that have a role above mine. :( You're going to have to move me to the top of your server role list!`);
				console.error(error);
			});
		
	}
	
	/**
	 * Try to find the color in the given guild and get the data.
	 * @param  {string} input Input obtained from the command. This SHOULD be a Hex value of a color.
	 * @param  {Object} data  Data obtained from parsing the command.
	 * @return {Object}       An object containing the HEX value of the color and the name of the color.
	 */
	getColorData(input, data) {
		
		// Try to get a color by name first if the input is a name.
		// If it's found, we'll return the values and mark it as existing.
		let color = data.msg.guild.roles.find('name', input + '.color');
		if (color !== null) {
			return {hex: color.hexColor, name: color.name, exists: true};
		}
		
		// Try to get a color by role name if they enter the complete role name.
		// If it's found, we'll return the values and mark it as existing.
		color = data.msg.guild.roles.find('name', input);
		if (color !== null) {
			return {hex: color.hexColor, name: input, exists: true};
		}
		
		// At this point, we know the input is possibly a hex value.
		let colorHex = input;
		
		// Make sure the # is prepended.
		// Convenience. Users will be able to enter the rgb in hex without the # if they want.
		if (colorHex.indexOf("#") !== 0) {
			colorHex = "#" + colorHex;
		}
		
		// Check if the hex color is valid.
		if(!this.isHexColor(colorHex)) {
			data.msg.reply(`That seems to be an invalid HEX value or color name!`)
				.then((reply) => {
					// Do nothing with reply.
				}).catch(console.error);
			return false;
		}
		
		// Get a name for the color using the NTC library.
		let colorName = ntc.name(colorHex)[1] + ".color";
		
		// Return the color data.
		return {hex: colorHex, name: colorName};
	}
	
	/**
	 * Attempt to find a color in the current guild.
	 * @param  {Object} colorData	Object containing color hex and color name.
	 * @param  {Object} data 			Command data obtained from parsing.
	 * @return {Role|Boolean}			Return the role object if found, else return FALSE.
	 */
	static findColorInCurrentGuild(colorData, data) {
		
		// Try to find the color through Hex Value.
		let color = data.msg.guild.roles.find('hexColor', colorData.hex);
		if (color !== null) {
			return color;
		}
		
		// Try to find the color through name.
		color = data.msg.guild.roles.find('name', colorData.name);
		if (color !== null) {
			return color;
		}
		
		// If we reach here, color was not found. We'll return false.
		return false;
		
	}
	
	/**
	 * Get color assigned to a member in the current guild.
	 * @param  {GuildMember} member	Member discord object.
	 * @return {Role/Boolean}           		Role Discord Object of the color found.
	 */
	getMemberColorInCurrentGuild(member) {
		
		// Variable to store the color role. The False by default.
		let color = false;
		
		// Loop into all roles of the given member and attempt to find a color role.
		// Color roles all have the '.color' suffix.
		member.roles.every((role) => {
			if (role.name.includes('.color')) {
				color = role;
				return false; // This ends execution of the .every() function.
			}
			
			return true;
		});
		
		// Return whatever is in the color variable at this point.
		// Will be false if none were found.
		return color;
	}
	
	/**
	 * List all color roles in the given guild.
	 * @param  {Object} data Data from the parsed command.
	 * @return {[type]}      [description]
	 */
	listColorRolesInGuild(data) {
		
		// Variable that will store the message to be sent, listing all color roles in the guild.
		let list_msg = `Here is the list of all colors in this server:\n\n`;
		
		// Loop in the guild's roles and check for all color roles.
		data.msg.guild.roles.every((role) => {
			
			// If a color role is found, we'll append it to the list.
			if (role.name.includes('.color')){
				list_msg += `  - ${role.name.replace('.color', '')} \`${role.hexColor}\`\n`;
			}
			
			return true;
			
		});
		
		// Send the text to the channel.
		// We add a delay for some flavor. Don't actually need it.
		data.msg.channel.send(`_Scanning available colors in this server..._`)
			.then(() => {
				this.client.startTyping(data.msg.channel, 2500)
					.then(() => {
						if (list_msg === `Here is the list of all colors in this server:\n\n`) {
							data.msg.channel.send(`There are no colors in this server! Better start creating some. :)`);
						} else {
							data.msg.channel.send(list_msg);
						}
					});
			});
		
	}
	
	/**
	 * Delete all color roles for a given guild.
	 * @param  {Object} data Data from the parsed command.
	 */
	deleteAllColorRoles(data) {
		
		// Loops into the roles of the guild and deletes all color roles.
		data.msg.guild.roles.every((role) => {
			if (role.name.includes('.color')) {
				role.delete()
					.then(r => console.log(`Deleted color role ${r}`))
					.catch(console.error);
			}
			return true;
		});
		
		data.msg.reply(`I have cleared all color roles from the server. :)`)
			.then((reply) => {
				// Do nothing with reply.
			}).catch(console.error);
	}
	
	/**
	 * Returns whether or not the given string is a Hex value.
	 * @param  {String}  string Supposed Hex Value.
	 * @return {Boolean}        True if it's a valid Hex Value. False if it's not.
	 */
	static isHexColor(string) {
		return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string);
	}
	
}

module.exports = PaintJob;