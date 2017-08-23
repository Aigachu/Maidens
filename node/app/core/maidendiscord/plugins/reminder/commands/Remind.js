class Remind extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		// this.aliases = [ "alias1", "alias2"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.helpText = "";
    
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
    // this.options = {
    //   d: {
    //     "readable_name" : "Direct Message",
    //     "description"   : "Send the ping via direct message instead of sending it in the chat.",
    //   },
    //   c: {
    //     readable_name : "Custom Message",
    //     description   : "Send a message defined on the fly instead of the default ping response.",
    //     needs_text   : true,
    //   }
    // };

    // Uncomment to configure the command.
    // You can adjust which channels the command can be used in, as well as who can use the command.
    // this.config = {
    //   auth: {
    //     guilds: [],
    //     channels: [],
    //     pms: false,
    //     users: [],
    //     oplevel: 0,
    //   },
    // };
    
    // Uncomment to adjust the cooldown of the command.
    // The default cooldown is 5 seconds.
    this.cooldown = 0;

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   options => Contains all of the options organized in an object by key, similar to above.
   *   array => Contains the input seperated into an array. (Shoutouts to old params style)
   *   full => Contains the full input in a text string.
   * }
   */
  tasks(data) {

    // Full input given.
    // Everything after 'remind' will be stored in here, pre-trimmed.
    var reminder = this.dissect(data.msg, data.input.full);

    data.msg.channel.send(`Input: ${data.input.full}`);
    data.msg.channel.send(`Destination: ${reminder.destination}`);
    data.msg.channel.send(`Subject: ${reminder.subject}`);
    data.msg.channel.send(`When: ${reminder.when}`);

    // var currentTimestamp = moment().startOf('second').format('x');
    // var currentTime = moment().startOf('second').format('MMMM Do YYYY, h:mm:ss a');

    return;

  }

  dissect(message, input) {

    var reminder = {};

    // Get the destination object.
    reminder.destination = this.getDestination(message, input);

    // If we don't have a destination, we can't do anything.
    if (reminder.destination === false) {
      return;
    }
    console.log(reminder.destination);

    // Remove destination from the input.
    input = input.replace(input.split(' ')[0] + ' ', '');

    // Get the subject to be reminded of.
    reminder.subject = this.getSubject(input);

    // If we don't have a subject, we can't do anything.
    if (reminder.subject === false) {
      return;
    }
    console.log(subject);

    // Remove the subject from the input.
    input = input.replace(reminder.subject + ' ', '');
    
    // So first, we should check for an 'in', a.k.a. a countdown.
    // If one is found, then we should have enough information to generate the timestamp.
    // The function will end there.
    
    // Get any countdowns from the input.
    var countdown = this.getCountdown(input);

    if (countdown !== false) {
      reminder.when = this.parseCountdown(countdown);
      return reminder;
    }

    return reminder;
    
    // If there's no 'in' (countdown), then we'll search for a date.
    // If a date is given but it's before the current date, an error is fired, saying you can't remind your past self since it's too late.
    // If no date is found, the default date is today.
    
    // After the date, we'll look for a time.
    // If a date has been given, we can generate the timestamp with the given date and times together.
    // If no date is given, which will default it to the current date, we'll compare the time to the current time of day.
    // If the time given is already passed, the reminder will be set for the following day.
    
    // If the string has 'in' AND ('on' OR 'at'), we should fire en error.
    // You either give a countdown alone, a time alone, or a date and time together.
    // @TODO - Maybe in the future, we'll handle cases where a date is given alone.

    input = input.replace(input.match(get_countdown_regex)[0], '').trim();

    var get_date_regex = /test/;
    var date = input.match(get_date_regex)[0].replace('at ', '').replace('the ', '');

    date = input.replace(input.match(get_date_regex)[0], '').trim();

    var get_time_regex = /\b(at )?\b((0?[1-9]|1[012])([:.][0-5][0-9])?([:.][0-5][0-9])?(\s?[apAP][mM])|([01]?[0-9]|2[0-3])([:.][0-5][0-9]))\b/;
    var time = input.match(get_time_regex)[0].replace('at ', '');

    input = input.replace(input.match(get_time_regex)[0], '').trim();
  }

  getSubject(input) {
    // Regex to get the subject that the destination should be reminded of.
    var subject_regex = /.+?(?= at [0-9]+| in [0-9]+| on (?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May?|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)| on the [0-9].)/;
    var subject = input.match(subject_regex) !== null ? input.match(subject_regex)[0] : false;

    if (subject === false) {
      console.log('Subject could not be determined from the given input. Returning.')
    }

    return subject;
  }

  getCountdown(input) {
    var get_countdown_regex = /(?:in [0-9]+(?:(?:m|s|h(?:r)?|d|w(?:k)?|y(?:r)?)(?:s)?| (?:sec(?:ond)?|min(?:ute)?|hr|hour|d(?:ay)?|wk|week|mth|month|yr|year)(?:s)?))(?: |,(?: )?)(?:and )?.+/;
    var countdown = input.match(get_countdown_regex) !== null ? input.match(get_countdown_regex)[0].replace('in ', '') : false;

    if (countdown === false) {
      console.log('No Countdown found. Returning.')
    }

    return countdown;
  }

  parseCountdown(countdown) {

    var modifiers = [];

    // get 'in' part with regex
    // then get the rest of ands or commas
    var get_first_modifier_regex = /(?:in [0-9]+(?:(?:m|s|h(?:r)?|d|w(?:k)?|y(?:r)?)(?:s)?| (?:sec(?:ond)?|min(?:ute)?|hr|hour|d(?:ay)?|wk|week|mth|month|yr|year)(?:s)?))/;
    var first_modifier = countdown.match(get_first_modifier_regex) !== null ? countdown.match(get_first_modifier_regex)[0] : false;

    // add first_modifier to modifiers array.

    // remove first modifier from countdown string
    countdown = countdown.replace(countdown.match(get_first_modifier_regex), '').trim();

    var get_next_modifier_regex = /(?:(?:and |, )[0-9]+(?:(?:m|s|h(?:r)?|d|w(?:k)?|y(?:r)?)(?:s)?| (?:sec(?:ond)?|min(?:ute)?|hr|hour|d(?:ay)?|wk|week|mth|month|yr|year)(?:s)?))/;

    // new function to recursively get the rest of the modifiers
    // regex to get following countdown strings

    var currentTimestamp = moment().startOf('second').format('x');

    return countdown;
  }

  getDestination(message, input) {
    // The first word after 'remind' is the destination, always.
    // This destination is either 'me', a Member/User tag or a TextChannel tag.
    var destination = input.split(' ')[0];

    // If there is no destination, let's stop here.
    if (_.isEmpty(destination)) {
      // @TODO - Throw error for empty input.
      console.log('Empty destination. Returning.');
      return false;
    }

    // If the destination is 'me', we get the id of the caller.
    if (destination == 'me') {
      return message.author;
    }

    // At this point, if the message is in dms, but the destination is not 'me', we shouldn't do anything.
    if (message.channel.type == 'dm') {
      console.log('Remind called in dms, but destination was not caller. Returning.')
      return false;
    }

    // Remove unneeded alligators.
    destination = destination.replace('<', '');
    destination = destination.replace('>', '');

    // If the tag is a user nickname tag, get the guild member.
    if (destination.indexOf('@!') >= 0) {
      var member = message.guild.members.find('id', destination.replace('@!', ''));
      return member;
    }

    // If the tag is a role tag, get the role.
    if (destination.indexOf('@&') >= 0) {
      var role = message.guild.roles.find('id', destination.replace('@&', ''));
      return role;
    }

    // If the tag is a basic user tag, get the user.
    if (destination.indexOf('@') >= 0) {
      var member = message.guild.members.find('id', destination.replace('@', ''));
      return member;
    }

    // If the tag is a channel tag, get the channel.
    if (destination.indexOf('#') >= 0) {
      var channel = message.guild.channels.find('id', destination.replace('#', ''));
      return channel;
    }

    // Return false if nothing is obtained. This most likely means an error in the input.
    console.log('Destination could not be dissected. Reached the end of the getDestination() function. Returning.')
    return false;
  }

}

module.exports = Remind;