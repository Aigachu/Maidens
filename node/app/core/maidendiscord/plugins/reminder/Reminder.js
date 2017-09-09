/**
 * Class [Reminder]
 *
 * This class defines the properties of the [Reminder] Plugin.
 *
 * This plugin seeks to mimic the reminder functionality of Slackbot to the best of it's potential.
 *
 * i.e. @Miku remind me to eat my steak at 5:35 pm on January 7th, 2018.
 *
 * This was one of the hardest features to code, but it was fun to integrate. Lots of bugfixes to come.
 */

const moment = require("moment");

class Reminder {
	constructor(client) {

		// Maiden client.
		this.client = client;

		// Build plugin necessities and requirements.
		this.build();

		// Set the pinger.
		// The pinger is basically a function that will run every *second* to check if a reminder must be
		// fired. This is intensive, I know, but it's the best (first) way I thought of doing this.
		setInterval(() => {
			this.ping();
		}, 1000);

	}

	/**
	 * Ping.
	 * Checks if a reminder should be sent.
	 */
	ping() {

		// Get the current UNIX Timestamp.
		let now = moment().format('x');

		// Loops through all reminders and checks if they need to be sent.
		// @TODO - This isn't really efficient. Explore a way to make this NOT have to loop through
		// ALL reminders.
		for (let key in this.reminders) {
	    
	    // Skip loop if the property is from the Javascript Object prototype.
	    if (!this.reminders.hasOwnProperty(key)) continue;

	    // The 'this.reminders' object contains many 'reminder_arrays'.
	    // Reminder Arrays are created when a user creates a reminder.
	    // The 'key' associating each reminder array is the ID of the person that created the reminders.
	    // This is how reminders are stored.
	    // Here, we get the current reminder array.
			let reminder_array = this.reminders[key];

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
		
	}

	/**
	 * Send a reminder to it's receiver.
	 * @param  {Object} reminder Reminder object.
	 */
	sendReminder(reminder) {

		// Get the creator of the reminder.
		let creator = this.getCreator(reminder);

		// Get the receiver of the reminder.
		let receiver = this.getReceiver(reminder);

		// Store action in an easy to read variable.
		let action = reminder.action;

		// Initiate variable to store the message that will be sent.
		let message = '';

		// If the creator is the receiver, we'll change the creator to you for more seamless text.
		if (creator.id === receiver.id) {
			creator = 'You';
		}

		// Depending on the type of Object the receiver is, the message will change.
		switch (reminder.receiver.object_type) {

			// If the receiver is a Discord User, we send it to the user via private messaging..
			case 'user':
				message = `${creator} asked me to remind you **"${action}"** at this moment!`;
				receiver.send(message);
				break;

			// If the receiver is a Discord Channel, we send it to the channel using @here.
			case 'channel':
				message = `Hey @here! ${creator} asked me to remind you guys **"${action}"**!`;
				receiver.send(message);
				break;

			// If the receiver is a Discord Role, we send it to the channel where the reminder was created.
			case 'role':
				message = `${creator} asked me to remind ${receiver} **"${action}"** at this moment!`;
				this.client.guilds.find('id', reminder.guild_id).channels.find('id', reminder.channel_id).send(message);
				break;

		}
		
	}

	/**
	 * Create reminder.
	 * @param  {Message} 	message  Message that was used to create the reminder.
	 * @param  {Object} 					reminder Reminder object parsed from the command.
	 */
	create(message, reminder) {

		// Theoretically, everything should be set for us to set the reminder.
		// Error checks have been done through the command already. :)
		
		// Check if user has a reminder array set. If not, we set it now.
		if (_.isEmpty(this.reminders[reminder.creator_id])) {
			this.reminders[reminder.creator_id] = [];
		}

		// Set the reminder.
		this.reminders[reminder.creator_id].push(reminder);

		// Get the receiver
		let receiver = this.getReceiver(reminder);

		// Get the exact time when the reminder will be sent.
		// @TODO - Timezone management...No fucking idea how I'm gonna do this yet.
		// You might want to tell them in how much time it'll happen instead, as a last resort.
		let time = moment(parseInt(reminder.timestamp)).format("MMMM Do YYYY, h:mm:ss a");

		// If the receiver is the same person that created the reminder...
		// In other words, if the creator is reminding himself of something...
		if (receiver.id === message.author.id) {
			receiver = 'you';
		}

		// Variable to store the confirmation message.
		let confirmation = `Got it, ${message.author}! I'll remind ${receiver} **${reminder.action}** at the following date and time: **${time}**!`;
		
		// Send the confirmation message.
		message.channel.send(confirmation)
		  .then((msg) => {
          msg.delete(30000);
        });

		// Save reminders to database.
		this.save();
		
	}

	/**
	 * Build plugin requirements, configurations and database.
	 */
	build() {

		// Make database directory if it doesn't exist.
		let desired_db_dir = this.client.coreroot + 'plugins/reminder/db';
		if (!fs.existsSync(desired_db_dir)) {
			fs.mkdirSync(desired_db_dir);
		}

		// Get path to the appropriate configuration directory or make it if it
		// doesn't exist.
		let db_dir = this.client.coreroot + 'plugins/reminder/db/' + this.client.maiden_name;
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
		}
	}

	/**
	 * Save reminders to the database.
	 */
	save() {
		fs.writeFileSync(this.db_path, JSON.stringify(this.reminders, null, 2));
	}

	/**
	 * Get the Creator of the Reminder.
	 * This will return null if it fails...But if SHOULDN'T.
	 * @TODO - It CAN fail if the creator leaves a guild, or something similar. So this must be handled eventually.
	 * @param  {Object} reminder The reminder to get the creator from.
	 */
	getCreator(reminder) {
		return this.client.guilds.find('id', reminder.guild_id).members.find('id', reminder.creator_id);
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
	 * @param  {Message} 	message Message of the person requesting a list.
	 * @param  {User} 		user    User that's requesting the list.
	 */
	sendList(message, user) {

		// If the user doesn't have any reminders stored, let me know.
		if (_.isEmpty(this.reminders[user.id])) {
			message.reply(`you don't seem to have any reminders in my database. :o`)
				.then((msg) => {
					msg.delete(30000)
						.then((msg) => {
							// Do nothing with deleted message.
						}).catch(console.error);
				});

			return;
		}

		// Initiate the list text.
		let list = `Here is the list of your reminders:\n\n`;

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
		
	}

	/**
	 * Clear the Reminder Collection for a given user ID.
	 * @param  {String} user_id Discord ID of the user.
	 */
	clear(user_id) {
		delete this.reminders[user_id];
	}
}

module.exports = Reminder;