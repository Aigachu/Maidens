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
					this.remind(reminder);
					caller_cache.splice(caller_cache.indexOf(reminder), 1);
					this.save();
				}
				return true;
			});
		}

		return;
	}

	remind(reminder) {

		if (reminder.caller.id === reminder.receiver.id) {
			reminder.caller = 'You';
		}

		reminder.receiver.send(`${reminder.caller} asked me to remind you to **"${reminder.action}"** at this moment!`);

		return;
	}

	create(message, caller, timestamp, action, receiver) {

		// Theoretically, everything should be set for us to set the reminder.
		// Error checks have been done through the command already. :)
		
		// Check if user has a reminder cache set.
		if (_.isEmpty(this.reminders[caller.id])) {
			this.reminders[caller.id] = [];
		}

		// Set the reminder.
		this.reminders[caller.id].push({
			caller: caller,
			timestamp: timestamp,
			action: action,
			receiver: receiver,
		});

		console.log(this.reminders);

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

	list(user) {

	}
}

module.exports = Reminder;