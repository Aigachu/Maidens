/**
 * Class [Reminder]
 *
 * This class defines the properties of the [Reminder] Plugin.
 *
 * This plugin seeks to mimic the reminder functionality of Slackbot to the best of it's potential.
 *
 * i.e. @Miku remind me to eat my steak at 5:35 pm on January 7th, 2018.
 *
 * This was one of the hardest functionalities to code, but it was fun to integrate. Lots of bugfixes to come.
 */
class Reminder {
	constructor(client) {

		// Maiden client.
		this.client = client;

		// Build plugin necessities and requirements.
		this.build();

		// Set the pinger.
		// The pinger is basically a function that will run every *second* to check if a reminder must be
		// fired. This is intensive, I know, but it's the best (first) way I thought of doing this.
		var pinger = setInterval(() => {
			this.ping();
		}, 1000);

	}

	/**
	 * Ping.
	 * Checks if a reminder should be sent.
	 */
	ping() {

		// Get the current UNIX Timestamp.
		var now = moment().format('x');

		// Loops through all reminders and checks if they need to be sent.
		// @TODO - This isn't really efficient. Explore a way to make this NOT have to loop through
		// ALL reminders.
		for (var key in this.reminders) {
	    
	    // Skip loop if the property is from the Javscript Object prototype.
	    if (!this.reminders.hasOwnProperty(key)) continue;

	    // The 'this.reminders' object contains many 'reminder_arrays'.
	    // Reminder Arrays are created when a user creates a reminder.
	    // The 'key' associating each reminder array is the ID of the person that created the reminders.
	    // This is how reminders are stored.
	    // Here, we get the current reminder array.
	    var reminder_array = this.reminders[key];

	    // Loop through every 'reminder' object in the reminder_array.
			reminder_array.every((reminder) => {

				// If the reminder's timestamp is in the past, we send the reminder, then remove it from the array.
				if (reminder.timestamp < now) {
					this.sendReminder(reminder);
					reminder_array.splice(reminder_array.indexOf(reminder), 1);
				}
				return true;

			});

			// If the Reminder Array is empty, we'll remove it from the 'this.reminders' object to avoid pollution.
			if (_.isEmpty(this.reminders[key])) {
				this.clear(key);
			}

			// Save reminders to the database.
			this.save();

		}

		return;
	}

	/**
	 * Send a reminder to it's receiver.
	 * @param  {Object} reminder Reminder object.
	 */
	sendReminder(reminder) {

		// Get the caller (creator) of the reminder.
		var caller = this.getCaller(reminder);

		// Get the receiver of the reminder.
		var receiver = this.getReceiver(reminder);

		// Store action in an easy to read variable.
		var action = reminder.action;

		// Initiate variable to store the message that will be sent.
		var message = '';

		// If the caller (creator) is the receiver, we'll change the caller to you for more seamless text.
		if (caller.id === receiver.id) {
			caller = 'You';
		}

		// Depending on the type of Object the receiver is, the message will change.
		switch (reminder.receiver.object_type) {

			// If the receiver is a Discord User, we send it to the user via private messaging..
			case 'user':
				message = `${caller} asked me to remind you **"${action}"** at this moment!`;
				receiver.send(message);
				break;

			// If the receiver is a Discord Channel, we send it to the channel using @here.
			case 'channel':
				message = `Hey @here! ${caller} asked me to remind you guys **"${action}"**!`;
				receiver.send(message);
				break;

			// If the receiver is a Discord Role, we send it to the channel where the reminder was created.
			case 'role':
				message = `${caller} asked me to remind ${receiver} **"${action}"** at this moment!`;
				this.client.guilds.find('id', reminder.guild_id).channels.find('id', reminder.channel_id).send(message);
				break;

		}

		return;
	}

	/**
	 * Create reminder.
	 * @param  {Discord Message} 	message  Message that was used to create the reminder.
	 * @param  {Object} 					reminder Reminder object parsed from the command.
	 */
	create(message, reminder) {

		// Theoretically, everything should be set for us to set the reminder.
		// Error checks have been done through the command already. :)
		
		// Check if user has a reminder array set. If not, we set it now.
		if (_.isEmpty(this.reminders[reminder.caller_id])) {
			this.reminders[reminder.caller_id] = [];
		}

		// Set the reminder.
		this.reminders[reminder.caller_id].push(reminder);

		// Get the receiver
		var receiver = this.getReceiver(reminder);

		// Get the exact time when the reminder will be sent.
		// @TODO - Timezone management...No fucking idea how I'm gonna do this yet.
		// You might want to tell them in how much time it'll happen instead, as a last resort.
		var time = moment(parseInt(reminder.timestamp)).format("MMMM Do YYYY, h:mm:ss a");

		// If the receiver is the same person that created the reminder...
		// In other words, if the creator is reminding himself of something...
		if (receiver.id === message.author.id) {
			receiver = 'you';
		}

		// Variable to store the confirmation message.
		var confirmation = `Got it, ${message.author}! I'll remind ${receiver} **${reminder.action}** at the following date and time: **${time}**!`;
		
		// Send the confirmation message.
		message.channel.send(confirmation)
		  .then((msg) => {
          msg.delete(30000);
        });

		// Save reminders to database.
		this.save();

		return;
	}

	/**
	 * Build plugin requirements, configurations and database.
	 */
	build() {

		// Make database directory if it doesn't exist.
		var desired_db_dir = this.client.coreroot + 'plugins/reminder/db';
		if (!fs.existsSync(desired_db_dir)) {
			fs.mkdirSync(desired_db_dir);
		}

		// Get path to the appropriate configuration directory or make it if it
		// doesn't exist.
		var db_dir = this.client.coreroot + 'plugins/reminder/db/' + this.client.maiden_name;
		if (!fs.existsSync(db_dir)) {
			fs.mkdirSync(db_dir);
		}

		// Path to the database file.
		this.db_path = db_dir + '/reminders.json';

		// Build Configurations
		this.reminders = {};

		// If the file exists, attempt to load the reminders from the file.
		if(fs.existsSync(this.db_path)) {
			this.reminders = JSON.parse(fs.readFileSync(this.db_path));
		}

		// If they were successfully loaded, send a message to the console.
		// If they aren't loaded, it's fine. A new database will be initialized.
		if (!_.isEmpty(this.reminders)) {
			this.client.on('ready', () => {
				console.log('Reminder Plugin: Loaded reminders from database.');
			});

			return;
		}
	}

	/**
	 * Save reminders to the database.
	 */
	save() {
		fs.writeFileSync(this.db_path, JSON.stringify(this.reminders, null, 2));
		return;
	}

	/**
	 * Get the Caller (creator) of the Reminder.
	 * This will return null if it fails...But if SHOULDN'T.
	 * @TODO - It CAN fail if the caller leaves a guild, or something similar. So this must be handled eventually.
	 * @param  {Object} reminder The reminder to get the caller (creator) from.
	 */
	getCaller(reminder) {
		return this.client.guilds.find('id', reminder.guild_id).members.find('id', reminder.caller_id);
	}

	/**
	 * Get the receiver of the Reminder.
	 * This will return null if it fails...But if SHOULDN'T.
	 * @TODO - It CAN fail if the receiver leaves a guild, or something similar. So this must be handled eventually.
	 * @param  {Object} reminder The reminder to get the receiver from.
	 */
	getReceiver(reminder) {

		// Depending on the type of receiver, our query will be different.
		// This is set through parsing in the command.
		switch (reminder.receiver.object_type) {

			// If the receiver is a Discord User...
			case 'user':
				return this.client.guilds.find('id', reminder.guild_id).members.find('id', reminder.receiver.object_id);
				break;

			// If the receiver is a Discord Channel...
			case 'channel':
				return this.client.guilds.find('id', reminder.guild_id).channels.find('id', reminder.receiver.object_id);
				break;

			// If the receiver is a Discord Role...
			case 'role':
				return this.client.guilds.find('id', reminder.guild_id).roles.find('id', reminder.receiver.object_id);
				break;

		}

		// If we reach here, we have a problem in our code...
		// And our logic...
		// And I suck...
		console.log("Reached a deadzone...Check the code.");
		return null;
	}

	/**
	 * Get and send a list of reminders defined for a given user.
	 * @param  {Discord Message} 	message Message of the person requesting a list.
	 * @param  {Discord User} 		user    User that's requesting the list.
	 */
	sendList(message, user) {

		// If the user doesn't have any reminders stored, let me know.
		if (_.isEmpty(this.reminders[user.id])) {
			message.reply(`you don't seem to have any reminders in my database. :o`)
				.then((msg) => {
					msg.delete(30000);
				});

			return;
		}

		// Initiate the list text.
		var list = `Here is the list of your reminders:\n\n`;

		// For every reminder found, add some markup.
		this.reminders[user.id].every((reminder) => {
			list += `Action: **"${reminder.action}"**`;
			list += `\n`;
			list += `Time: **${moment(parseInt(reminder.timestamp)).format("MMMM Do YYYY, h:mm:ss a")}**`;
			list += `\n`;
			list += `Destination: **${this.getReceiver(reminder)}**`;
			list += `\n`;
			list += `---------------------------------------------------`;
			list += `\n`;
			return true;
		});

		// Send the list to the user.
		user.send(list);

		return;
	}

	/**
	 * Clear the Reminder Collection for a given user ID.
	 * @param  {String} user_id Discord ID of the user.
	 */
	clear(user_id) {
		delete this.reminders[user_id];
		return;
	}
}

module.exports = Reminder;