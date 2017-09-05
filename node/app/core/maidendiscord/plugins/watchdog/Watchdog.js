const timeout_role_name = 'Colette::Timeout';

// @TODO - Documentation

class Watchdog {

	constructor(client) {

		this.client = client;

		this.timeouts = {};

		this.logs = {};

		this.maxSpree = 3;

		// Role and configuration setup
		this.build();

		// Set listener.
		this.listen();

	}

	listen() {
		this.client.on('ready', () => {
			this.client.listeners.push({
				listen: (client, message) => {

					// Don't watch the message if it's in a PMChannel.
					if (message.channel.type == 'dm') {
						return false;
					}

					// Don't watch the message if the message comes from this client.
					if (message.author.id === this.client.user.id) {
						return false;
					}

					// Don't watch the message if the watchdog isn't enabled in this guild.
					if (this.guilds[message.guild.id] === false) {
						return false;
					}

					// Watch.
					this.watch(message);

					return;
				},
			});
		});
	}

	watch(message) {
		// console.log('This message has been watched.');
		// Watch messages and check if they're being sent too fast.
		// Search for optimal way to code this.
		var guildlog = this.logs[message.guild.id];

		if (!(message.author.id in guildlog)) {
			guildlog[message.author.id] = {
				spree: 1,
				cache: [],
				spitfire: [],
			};
		}

		var memberlog = guildlog[message.author.id];

		// Wat
		if(message.author.id === '84100810870358016') {
			// Let's ban em.
		}

		// Timeout users that have sent more than 4 messages in less than a second.
		memberlog.spitfire.push(message);

		if (memberlog.spitfire.length >= 4) {
			this.timeout(message.member, 10);
			message.channel.send(`${message.member} Take your face off your keyboard bud~ :yum:\nNo but SERIOUSLY! Relax. :)`);
			memberlog.spitfire.every((msg) => {
				msg.delete();
				return true;
			});
			
			this.resetlog(memberlog);

			return;
		}

		memberlog.spitclear = setTimeout(() => {
			memberlog.spitfire = [];
		}, 750);

		// Timeout users that type the same message more than 4 times!
		// Add message to cache
		memberlog.cache.push(message);

		// Increment spree if the content is the same as the last message.
		if (memberlog.cache.length > 1 && message.content === memberlog.cache[memberlog.cache.length - 2].content) {
			memberlog.spree++;
		}

		// If the spree hits the max...
		if (memberlog.spree === this.maxSpree) {
			this.timeout(message.member, 10);
			message.channel.send(`Oops! Dropped my banhammer on ${message.member}...ACCIDENTALLY of course! :yum:\nNO SPAM BUDDY! Watch yourself! :angry:`);
			// message.channel.send(`?`, {files: [this.client.assets + 'watchdog/banhammer.png']});
			memberlog.cache.slice(Math.max(memberlog.cache.length - this.maxSpree)).every((msg) => {
				msg.delete();
				return true;
			});

			this.resetlog(memberlog);

			return;
		}

		memberlog.spreeclear = setTimeout(() => {
			memberlog.spree = 1;
		}, 2000);
		
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

	clear(member) {
		var timeout_role = member.guild.roles.find('name', timeout_role_name);

		if (timeout_role === null) {
			console.log('Timeout role not found in guild.');
			return false;
		}

		member.removeRole(timeout_role);

		return true;
	}

	purge(member, count) {
		var memberlog = this.logs[member.guild.id][member.id];

		memberlog.cache.slice(Math.max(memberlog.cache.length - count - 1)).every((msg) => {
			msg.delete();
			return true;
		});

		this.resetlog(memberlog);

		return;

	}

	resetlog(memberlog) {
		memberlog.cache = [];
		memberlog.spitfire = [];
		memberlog.spree = 1;

		return;
	}

	enable(guild) {
		this.guilds[guild.id] = true;
		fs.writeFileSync(this.config_path, JSON.stringify(this.guilds, null, 2));
	}

	disable(guild) {
		this.guilds[guild.id] = false;
		fs.writeFileSync(this.config_path, JSON.stringify(this.guilds, null, 2));
	}

	status(guild) {
		return this.guilds[guild.id];
	}

	build() {

		// Build roles in all servers and do necessary cleanup.
		this.client.on('ready', () => {
			this.client.guilds.every((guild) => {
				this.logs[guild.id] = {};
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

			    guild.members.every((member) => {
			    	this.clear(member);
			    	return true;
			    });
				}

				return true;
			});

			// Make configuration directory if it doesn't exist.
			var config_dir = this.client.coreroot + 'plugins/watchdog/config';
			if (!fs.existsSync(config_dir)) {
				fs.mkdirSync(config_dir);
			}

			// Get path to the appropriate configuration directory or make it if it
			// doesn't exist.
			var desired_config_dir = this.client.coreroot + 'plugins/watchdog/config/' + this.client.maiden_name;
			if (!fs.existsSync(desired_config_dir)) {
				fs.mkdirSync(desired_config_dir);
			}

			this.config_path = desired_config_dir + '/guilds.json';

			// Build Configurations
			this.guilds = {};

			if(fs.existsSync(this.config_path)) {
				this.guilds = JSON.parse(fs.readFileSync(this.config_path));
			}

			if (!_.isEmpty(this.guilds)) {
				this.client.on('ready', () => {
					console.log('Maiden Watchdog: Loaded guild config from files.');
					// this.client.home.channel.send(`**Watchdog**: Enabled guilds configuration successfully loaded. @TODO - Show where watchdog is enabled.`);
				});

				return;
			}

			this.client.guilds.every((guild) => {
				this.guilds[guild.id] = false;
				return true;
			});

			this.client.on('ready', () => {
				console.log('Maiden Watchdog: Guild config not found. Created default guild config.');
				// this.client.home.channel.send(`**Watchdog**: Enabled guilds for watchdog config file not found or empty. Created default file. Watchdog has been disabled in all guilds.`);
			});

			fs.writeFileSync(this.config_path, JSON.stringify(this.guilds, null, 2));

			return;
		});
	}
}

module.exports = Watchdog;