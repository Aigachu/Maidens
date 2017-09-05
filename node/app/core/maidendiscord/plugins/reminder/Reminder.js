// @TODO - Documentation

class Reminder {
	constructor(client) {
		this.client = client;

		// Plugin setup.
		this.build();

		var pinger = setInterval(() => {
			this.ping();
		}, 1000);
	}

	ping() {

		var now = moment().format('x');

		for (var key in this.reminders) {
	    // skip loop if the property is from prototype
	    if (!this.reminders.hasOwnProperty(key)) continue;

	    var caller_cache = this.reminders[key];

			caller_cache.every((reminder) => {
				if (reminder.timestamp < now) {
					this.sendReminder(reminder);
					caller_cache.splice(caller_cache.indexOf(reminder), 1);
				}
				return true;
			});

			if (_.isEmpty(this.reminders[key])) {
				delete this.reminders[key];
			}

			this.save();
		}

		return;
	}

	sendReminder(reminder) {

		var caller = this.getCaller(reminder);
		var receiver = this.getReceiver(reminder);
		var action = reminder.action;
		var message = '';

		if (caller.id === receiver.id) {
			caller = 'You';
		}

		switch (reminder.receiver.object_type) {

			case 'user':
				message = `${caller} asked me to remind you **"${action}"** at this moment!`;
				receiver.send(message);
				break;

			case 'channel':
				message = `Hey @here! ${caller} asked me to remind you guys **"${action}"**!`;
				receiver.send(message);
				break;

			case 'role':
				message = `${caller} asked me to remind ${receiver} **"${action}"** at this moment!`;
				this.client.guilds.find('id', reminder.guild_id).channels.find('id', reminder.channel_id).send(message);
				break;

		}

		return;
	}

	create(message, reminder) {

		// Theoretically, everything should be set for us to set the reminder.
		// Error checks have been done through the command already. :)
		
		// Check if user has a reminder cache set.
		if (_.isEmpty(this.reminders[reminder.caller_id])) {
			this.reminders[reminder.caller_id] = [];
		}

		// Set the reminder.
		this.reminders[reminder.caller_id].push(reminder);

		var confirmation = `Alright ${message.author}! I'll remind ${this.getReceiver(reminder)} **${reminder.action}** at the following date and time: **${moment(parseInt(reminder.timestamp)).format("MMMM Do YYYY, h:mm:ss a")}**!`;
		// Confirmation message.
		message.channel.send(confirmation);

		this.save();

		return;
	}

	build() {
		// Get path to the appropriate configuration directory or make it if it
		// doesn't exist.
		var db_dir = this.client.coreroot + 'plugins/reminder/db/' + this.client.maiden_name;
		if (!fs.existsSync(db_dir)) {
			fs.mkdirSync(db_dir);
		}

		this.db_path = db_dir + '/reminders.json';

		// Build Configurations
		this.reminders = {};

		if(fs.existsSync(this.db_path)) {
			this.reminders = JSON.parse(fs.readFileSync(this.db_path));
		}

		if (!_.isEmpty(this.reminders)) {
			this.client.on('ready', () => {
				console.log('Maiden Watchdog: Loaded reminders from database.');
			});

			return;
		}
	}

	save() {
		fs.writeFileSync(this.db_path, JSON.stringify(this.reminders, null, 2));
	}

	getCaller(reminder) {
		return this.client.guilds.find('id', reminder.guild_id).members.find('id', reminder.caller_id);
	}

	getReceiver(reminder) {

		switch (reminder.receiver.object_type) {

			case 'user':
				return this.client.guilds.find('id', reminder.guild_id).members.find('id', reminder.receiver.object_id);
				break;

			case 'channel':
				return this.client.guilds.find('id', reminder.guild_id).channels.find('id', reminder.receiver.object_id);
				break;

			case 'role':
				return this.client.guilds.find('id', reminder.guild_id).roles.find('id', reminder.receiver.object_id);
				break;

		}

		// If we reach here, we have a problem in our code...
		console.log("Reached a deadzone...Check the code.");
		return null;
	}

	list(user_id) {

	}
}

module.exports = Reminder;