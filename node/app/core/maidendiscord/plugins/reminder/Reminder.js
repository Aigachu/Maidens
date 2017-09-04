// @TODO - Documentation

class Reminder {
	constructor(client) {
		this.client = client;

		this.reminders = {};

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
				}
				return true;
			});
			return true;
		}
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

		return;
	}

	list(user) {

	}
}

module.exports = Reminder;