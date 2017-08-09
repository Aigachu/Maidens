const enabled_guilds_path = __dirname + '/guilds_enabled.json';;
const timeout_role_name = 'MaidenWatch::Timeout';

class Watchdog {

	constructor(client) {

		this.client = client;

		this.timeouts = {};

		// The watchdog immediatly creates the timeout functionality in all guilds that are configured to have it.
		this.guildconfig = this.__loadGuildConfig();

		// Role setup
		this.rebuild();

		// Set listener.
		this.listen();

	}

	listen() {
		this.client.listeners.push({
			listen: (client, message) => {

				if (message.author.id === this.client.user.id) {
					return false;
				}

				if (this.guildconfig[message.guild.id] === false) {
					return false;
				}

				this.watch(message);
			},
		});
	}

	watch(message) {
		console.log('This message has been watched.');
		// Watch messages and check if they're being sent too fast.
		// Search for optimal way to code this.
	}

	timeout(member, duration) {
		var timeout_role = member.guild.roles.find('name', timeout_role_name);

		if (timeout_role === null) {
			console.log('Timeout role not found in guild.');
			return false;
		}

		member.addRole(timeout_role);

    setTimeout(() => {
      member.removeRole(timeout_role);
    }, duration * 1000);
		return;
	}

	enable(guild) {
		this.guildconfig[guild.id] = true;
		fs.writeFileSync(enabled_guilds_path, JSON.stringify(this.guildconfig, null, 2));
	}

	disable(guild) {
		this.guildconfig[guild.id] = false;
		fs.writeFileSync(enabled_guilds_path, JSON.stringify(this.guildconfig, null, 2));
	}

	rebuild() {
		this.client.guilds.every((guild) => {
			var role = guild.roles.find('name', timeout_role_name);

			// Create the maiden timeout role.
			// For disabled guilds, remove the role as it is not needed.
			if (role === null) {
				guild.createRole({
		      name: timeout_role_name,
		      color: '#36393F',
		      mentionable: true,
		      permissions: 1049600,
		    }).then((new_role) => {
			    guild.channels.every((channel) => {
			    	channel.overwritePermissions(new_role, {'SEND_MESSAGES': false, 'ATTACH_FILES': false, });
			    	return true;
			    });
		    });
			} else {
				guild.channels.every((channel) => {
		    	channel.overwritePermissions(role, {'SEND_MESSAGES': false, 'ATTACH_FILES': false, });
		    	return true;
		    });
			}

			return true;
		});
	}

	__loadGuildConfig() {
		var config = {};

		if(fs.existsSync(enabled_guilds_path)) {
			config = JSON.parse(fs.readFileSync(enabled_guilds_path));
		}

		if (!_.isEmpty(config)) {
			console.log('Maiden Watchdog: Loaded guild config from files.');
			this.client.home.channel.send(`**Watchdog**: Enabled guilds configuration successfully loaded. @TODO - Show where watchdog is enabled.`);
			return config;
		}

		this.client.guilds.every((guild) => {
			config[guild.id] = false;
			return true;
		});

		console.log('Maiden Watchdog: Guild config not found. Created default guild config.');
		this.client.home.channel.send(`**Watchdog**: Enabled guilds for watchdog config file not found or empty. Created default file. Watchdog has been disabled in all guilds.`);

		fs.writeFileSync(enabled_guilds_path, JSON.stringify(config, null, 2));

		return config;
		
	}
}

module.exports = Watchdog;