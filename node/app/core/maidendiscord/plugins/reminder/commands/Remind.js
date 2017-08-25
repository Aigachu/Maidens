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

    console.log(reminder);

    if (reminder === null) {
      console.log('Execution stopped. Check log for errors.');
    }

    // data.msg.channel.send(`Input: ${data.input.full}`);
    // data.msg.channel.send(`Destination: ${reminder.destination}`);
    // data.msg.channel.send(`Action: ${reminder.action}`);
    // data.msg.channel.send(`When: ${reminder.when}`);

    // var currentTimestamp = moment().startOf('second').format('x');
    // var currentTime = moment().startOf('second').format('MMMM Do YYYY, h:mm:ss a');

    return;

  }

  dissect(message, input) {

    var reminder = {};

    // === Getting the Destination ===
    // ********************************************

    // Get the destination object.
    reminder.destination = this.getDestination(message, input);

    // If we don't have a destination, we can't do anything.
    if (reminder.destination === false) {
      console.log('ERROR: Destination could not be resolved. Stopping execution.');
      console.log('-------------------------------------------------------------');
      return null;
    }

    // Remove destination from the input.
    input = input.replace(input.split(' ')[0] + ' ', '');

    // === Getting the timestamp ===
    // At this point, the destination is removed.
    // We are left with:
    // "to eat in 12 hours, 5 minutes and 13 seconds"
    // "to eat at 3pm"
    // "to eat at 3pm on January 5th, 2016"
    // ********************************************
    
    // Get any TUFs from the input.
    var time_until_fire = this.getTUF(input);

    // Get any target time from input.
    var target_time = this.getTargetTime(input);

    // Get any target time from input.
    var target_date = this.getTargetDate(input);

    // Throw error if nothing is found concerning the timestamp.
    if (!time_until_fire && !target_time && !target_date) {
      console.log('ERROR: No desired moment specified for reminder. Stopping execution.');
      console.log('-------------------------------------------------------------');
      return null;
    }

    // Throw error if a TUF is set with any other timestamp specifications.
    if (time_until_fire !== false && (target_time !== false || target_date !== false)) {
      console.log('ERROR: TUF set with Time & Date specifications. Stopping execution.');
      console.log('-------------------------------------------------------------');
      return null;
    }

    // If a time until fire exists, we'll set it now and return the reminder.
    if (time_until_fire !== false) {
      reminder.tuf = this.parseTUF(time_until_fire);
      input = input.replace(time_until_fire, '').trim();
    }

    // If a desired date is set in the reminder, get it.
    if(target_date !== false) {
      reminder.date = this.parseTargetDate(target_date);
      input = input.replace(target_date, '').trim();
    }

    // If a desired time is set in the reminder, get it.
    if(target_time !== false) {
      reminder.time = this.parseTargetTime(target_time);
      input = input.replace(target_time, '').trim();
    }

    // The action is whatever is left.
    reminder.action = input;
    console.log('Action: ' + reminder.action);

    if (_.isEmpty(reminder.action)) {
      console.log('Umm...What am I supposed to remind you of?');
      console.log('-------------------------------------------------------------');
      // @TODO - Fire error.
      return false;
    }

    return reminder;

  }

  /**
   * From an input, get Time Until Fire
   * @param  {[type]} input [description]
   * @return {[type]}       [description]
   */
  getTUF(input) {
    var get_tuf_regex = /(in)\s+(\d+((m(inute)?(onth)?(on)?|s(econd)?|h(our)?(r)?|d(ay)?|w(eek)?(k)?|y(ear)?(r)?)(s)?|\s+(sec(ond)?|min(ute)?|hr|hour|d(ay)?|wk|week|mth|month|yr|year)(s)?)(\s+|,(?:\s+)?)?(?:and\s+)?)+/i;
    var tuf = input.match(get_tuf_regex) !== null ? input.match(get_tuf_regex)[0] : false;

    return tuf;
  }

  getTargetDate(input) {
    var get_target_date_regex = /(on)\s+((the\s+\d{1,2}(st|nd|rd|th)?\s+of\s+)?(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)(\s+\d{1,2}(st|nd|rd|th)?)?,\s+\d{4})/i;
    var target_date = input.match(get_target_date_regex) !== null ? input.match(get_target_date_regex)[0] : false;

    return target_date;
  }

  getTargetTime(input) {
    var get_target_time_regex = /(at)\s+(((0)?[1-9]|(1)[012])([:.][0-5]\d)?([:.][0-5]\d)?(\s?[apAP][mM])|([01]?\d|(2)[0-3])([:.][0-5]\d))/i;
    var target_time = input.match(get_target_time_regex) !== null ? input.match(get_target_time_regex)[0] : false;

    return target_time;
  }

  parseTUF(tuf) {

    // Clean user input.
    tuf = tuf.replace('in', '').trim();

    // Get current time.
    var timestamp = moment().startOf('second');

    // Mutators are the user inputs, and will be added to the current date.
    var mutators = [];

    // get 'in' part with regex
    // then get the rest of ands or commas
    var get_mutators_regex = /(\d+((m(inute)?(onth)?(on)?|s(econd)?|h(our)?(r)?|d(ay)?|w(eek)?(k)?|y(ear)?(r)?)(s)?|\s+(sec(ond)?|min(ute)?|hr|hour|d(ay)?|wk|week|mth|month|yr|year)(s)?))/gmi;
    mutators = tuf.match(get_mutators_regex);

    mutators.every((mutator) => {
      mutator = mutator.replace(/\d+(?=\w+)/i, "$& ");
      var mutator_amount = mutator.split(' ')[0];
      var mutator_key = this.getMutatorKey(mutator.split(' ')[1]);
      timestamp.add(mutator.split(' ')[0], mutator_key);
      return true;
    });

    return timestamp.format('x');
  }

  parseTargetDate(target_date) {
    // Clean user input.
    tuf = tuf.replace('on', '').trim();
  }

  parseTargetTime(target_time) {
    // Clean user input.
    tuf = tuf.replace('at', '').trim();
  }

  /**
   * Get destination where the reminder should be sent.
   * @param  {[type]} message [description]
   * @param  {[type]} input   [description]
   * @return {[type]}         [description]
   */
  getDestination(message, input) {
    // The first word after 'remind' is the destination, always.
    // This destination is either 'me', a Member/User tag or a TextChannel tag.
    var destination = input.split(' ')[0];

    // If there is no destination, let's stop here.
    if (_.isEmpty(destination)) {
      // @TODO - Throw error for empty input.
      console.log('ERROR: Empty destination. Returning.');
      return false;
    }

    // If the destination is 'me', we get the id of the caller.
    if (destination == 'me') {
      return message.author;
    }

    // At this point, if the message is in dms, but the destination is not 'me', we shouldn't do anything.
    if (message.channel.type == 'dm') {
      console.log('ERROR: Remind called in dms, but destination was not caller. Returning.')
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
    console.log('ERROR: Destination could not be dissected. Reached the end of the getDestination() function. Returning.')
    return false;
  }

  getMutatorKey(mutator_input) {

    // If the key is in plural, remove the last s.
    // This will make the array below cleaner.
    if (mutator_input[mutator_input.length - 1] == 's' && mutator_input.length != 1) {
      mutator_input = mutator_input.substr(0, mutator_input.length - 1);
    }

    console.log(mutator_input);

    // Asssociation array for mutators.
    // Depending on the user input, we decide what to do.
    var mutator_assoc = {

      // Seconds
      s:      'seconds',
      sec:    'seconds',
      second: 'seconds',

      // Minutes
      m:      'minutes',
      min:    'minutes',
      minute: 'minutes',

      // Hours
      h:      'hours',
      hr:     'hours',
      hour:   'hours',

      // Days
      d:      'days',
      day:    'days',

      // Weeks
      w:      'weeks',
      wk:     'weeks',
      week:   'weeks',

      // Months
      mon:    'months',
      month:  'months',

      // Years
      y:      'years',
      yr:     'years',
      year:   'years',

    }

    var key = mutator_assoc[mutator_input];

    if (key === null) {
      console.log('ERROR: Invalid Mutator was somehow given. Please check the code!');
      return false;
    }

    return mutator_assoc[mutator_input];
  }

}

module.exports = Remind;