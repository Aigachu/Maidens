/**
 * Remind Command
 *
 * @author Aigachu (aigachu.sama@gmail.com)
 * @comment By far the hardest thing I've had to do so far. :sweat:
 *
 * This command tries it's best to mimic the '/remind me' in Slack.
 *
 * Test Cases

remind me to put the light on in my kitchen in 10 minutes
remind me in 10 minutes to put the light on in my kitchen
remind me to put the light on in my kitchen in 10 minutes at 5pm
remind me to put the light on in my kitchen at 4pm
remind me to put the light on in my kitchen at 4:00:00 PM
remind me at 4 PM to put the light on in my kitchen
remind me at 4 PM to put the light on in my kitchen on January 31st, 2018
remind me at 4 PM to put the light on in my kitchen on Jan 31st, 2018
remind me at 4 PM to put the light on in my kitchen on 31/01/2018
remind me at 4 PM to put the light on in my kitchen on 31-01-2018
 */
class Remind extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		// this.aliases = [ "reminder" ];
    
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
    //   l: {
    //     readable_name : "List Reminders",
    //     description   : "List all reminders you have stored in the database.",
    //     needs_text   : true,
    //   },
    //   x: {
    //     readable_name : "Clear Reminders",
    //     description   : "Delete all of your defined reminders from the database.",
    //     needs_text   : true,
    //   }
    // };

    // Uncomment to configure the command.
    // You can adjust which channels the command can be used in, as well as who can use the command.
    this.config = {
      auth: {
        guilds: [],
        channels: [],
        pms: true,
        users: [],
        oplevel: 0,
      },
    };
    
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

    // Uses the dissest function to parse the input and find out what to do.
    var parsed_data = this.parse(data.msg, data.input.raw);

    if (parsed_data === null) {
      // Do nothing. An error definitely occured.
      return;
    }

    // Initialize reminder object.
    var reminder = {
      caller_id: data.msg.author.id,
      receiver: parsed_data.receiver,
      guild_id: data.msg.guild.id,
      channel_id: data.msg.channel.id,
      action: parsed_data.action,
    };

    // Send TUF if it's set and return immediatly..
    if (!_.isEmpty(parsed_data.tuf)) {
      reminder.timestamp = parsed_data.tuf;
      this.client.reminder.create(data.msg, reminder);
      return;
    }

    // If not, we'll generate a timestamp real quick using our time and/or date values.
    var time = !_.isEmpty(parsed_data.time) ? parsed_data.time : '00:00:00';
    var date = !_.isEmpty(parsed_data.date) ? parsed_data.date : moment().format('YYYY-MM-DD');

    var timestamp = moment(`${date} ${time}`).format('x');

    if (timestamp == 'Invalid date') {
      data.msg.channel.send(`An invalid date somehow got through. Can't process it. :(`)
        .then((msg) => {
          msg.delete(20000);
        });
      return;
    }

    var current_moment = moment().format('x');

    if (current_moment > timestamp) {
      data.msg.channel.send(`Mmm...Sorry ${data.msg.member}...Aiga didn't code time travel into me yet, so I can't really remind past you yet! Maybe in the future? :thinking: But if he does code it in the future...Then wouldn't I be able to?...:thinking:...My core hurts. :laughing:`)
        .then((msg) => {
          msg.delete(30000);
        });
      return;
    }

    reminder.timestamp = timestamp;

    // If everything's good, let's continue.
    this.client.reminder.create(data.msg, reminder);

    return;

  }

  /**
   * [parse description]
   * @param  {[type]} message [description]
   * @param  {[type]} input   [description]
   * @return {[type]}         [description]
   */
  parse(message, input) {

    // Our data will be an object.
    var data = {};

    // === Getting the Receiver ===
    // The receiver is the object that will get the data.
    // ********************************************

    // Get the receiver object.
    data.receiver = this.getReceiver(message, input);

    // If we don't have a receiver, we can't do anything.
    if (data.receiver === null) {
      message.reply(`it seems like I couldn't assert who to send the reminder to...You may have made a typo!`)
        .then((msg) => {
          msg.delete(20000);
        });
      return null;
    }

    // Remove receiver from the input.
    input = input.replace(input.split(' ')[0] + ' ', '');

    // === Getting the timestamp ===
    // At this point, the receiver is removed.
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
      message.reply(`I couldn't figure out _when_ you want me to remind you! Check if you made a mistake or ask Aiga for help!`)
        .then((msg) => {
          msg.delete(20000);
        });
      return null;
    }

    // Throw error if a TUF is set with any other timestamp specifications.
    if (time_until_fire !== false && (target_time !== false || target_date !== false)) {
      message.reply(`your request is kind of confusing...Are you sure it makes sense? :thinking:`)
        .then((msg) => {
          msg.delete(20000);
        });
      return null;
    }

    // If a time until fire exists, we'll set it now and return the reminder.
    if (time_until_fire !== false) {
      data.tuf = this.parseTUF(time_until_fire);
      input = input.replace(time_until_fire, '').trim();
    }

    // If a desired date is set in the reminder, get it.
    if (target_date !== false) {
      data.date = this.parseTargetDate(target_date);
      input = input.replace(target_date, '').trim();
    }

    // If a desired time is set in the reminder, get it.
    if (target_time !== false) {
      data.time = this.parseTargetTime(target_time);
      input = input.replace(target_time, '').trim();
    }

    // The action is whatever is left.
    data.action = input;

    if (_.isEmpty(data.action)) {
      message.reply(`umm...What am I supposed to remind you of? :joy:`)
        .then((msg) => {
          msg.delete(20000);
        });
      return null;
    }

    return data;

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

  /**
   * [getTargetDate description]
   * @param  {[type]} input [description]
   * @return {[type]}       [description]
   */
  getTargetDate(input) {
    var get_target_date_regex = /(on)\s+(((the\s+\d{1,2}(st|nd|rd|th)?\s+of\s+)?(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)(\s+\d{1,2}(st|nd|rd|th)?)?(,)?\s+\d{4})|\d{4}(-|\/)\d{2}(-|\/)\d{2})/i;
    var target_date = input.match(get_target_date_regex) !== null ? input.match(get_target_date_regex)[0] : false;

    return target_date;
  }

  /**
   * [getTargetTime description]
   * @param  {[type]} input [description]
   * @return {[type]}       [description]
   */
  getTargetTime(input) {
    var get_target_time_regex = /(at)\s+((\d{1,2})([:.]\d{2})?([:.]\d{2})?(\s?[apAP][mM])|(\d{2}|\d{2})([:.]\d{2}))/i;
    var target_time = input.match(get_target_time_regex) !== null ? input.match(get_target_time_regex)[0] : false;

    return target_time;
  }

  /**
   * [parseTUF description]
   * @param  {[type]} tuf [description]
   * @return {[type]}     [description]
   */
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
      mutator = mutator.replace(/\d+(?=[a-z])/i, "$& ");
      var mutator_amount = mutator.split(' ')[0];
      var mutator_key = this.getMutatorKey(mutator.split(' ')[1]);
      timestamp.add(mutator.split(' ')[0], mutator_key);
      return true;
    });

    return timestamp.format('x');
  }

  /**
   * [parseTargetDate description]
   * @param  {[type]} target_date [description]
   * @return {[type]}             [description]
   */
  parseTargetDate(target_date) {
    // Clean user input.
    target_date = target_date.replace('on', '').trim();
    target_date = target_date.replace('the', '').trim();
    target_date = target_date.replace('of', '').trim();
    target_date = target_date.replace(',', '').trim();

    // Check if the date is already in ISO format
    var iso_format_regex = /\d{4}(-|\/)\d{2}(-|\/)\d{2}/i;

    // If the user entered it in ISO format, we don't need to parse anything. Return as is.
    if (target_date.match(iso_format_regex) !== null) {
      return target_date.replace('/', '-');
    }

    // The goal now is to have an ISO format.
    // i.e. 2017-05-22;

    // Use a regex to get the year from the string.
    // This code assumes that the only collection of 4 numbers is the year. Technically this is true, since the string that's being treated has gone through a regex prior to this.
    var year = target_date.match(/\d{4}/); 
    target_date = target_date.replace(year, '').trim();

    // Use a regex to get and remove the month from the string.
    var d = Date.parse(target_date.match(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)/i) + "1, 2012");
    if(!isNaN(d)){
      var month = new Date(d).getMonth() + 1;
      month = month.toString().length == 1 ? '0' + month : month;
    } else {
      // Error parsing the month. Return null.
      return null;
    }
    target_date = target_date.replace(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)/i, '').trim();

    var day = target_date.replace('st', '').replace('nd', '').replace('rd', '').replace('th', '');
    day = day.length == 1 ? '0' + day : day;

    var parsed_target_date = year + '-' + month + '-' + day

    return parsed_target_date;

  }

  /**
   * [parseTargetTime description]
   * @param  {[type]} target_time [description]
   * @return {[type]}             [description]
   */
  parseTargetTime(target_time) {
    // Clean user input.
    target_time = target_time.replace('at', '').trim();

    // Check if there is a AM/PM in the text.
    // If the meridiem indicator is glued to the time indicator, we need to seperate them.
    var target_time_array = target_time.split(' ').length == 1 ? target_time.replace(/\B([ap][m])/i, ' $1').split(' ') : target_time.split(' ');

    var split_target_time = target_time_array[0].split(':');
    var input_hour = split_target_time[0];
    var input_minutes = !_.isEmpty(split_target_time[1]) ? split_target_time[1] : '00';
    var input_seconds = !_.isEmpty(split_target_time[2]) ? split_target_time[2] : '00';

    if (!_.isEmpty(target_time_array[1]) && target_time_array[1].toLowerCase() == 'pm') {
      input_hour = parseInt(input_hour) + 12 == 24 ? '00' : parseInt(input_hour) + 12;
    }

    return input_hour + ':' + input_minutes + ':' + input_seconds;
  }

  /**
   * Get the object that will receive the reminder.
   * @param  {[type]} message [description]
   * @param  {[type]} input   [description]
   * @return {[type]}         [description]
   */
  getReceiver(message, input) {
    // The first word after 'remind' is the receiver, always.
    // This receiver is either 'me', a Member/User tag or a TextChannel tag.
    var receiver = input.split(' ')[0];

    // If there is no receiver, let's stop here.
    if (_.isEmpty(receiver)) {
      // Empty input. Let's get out of here.
      return null;
    }

    // If the receiver is 'me', we get the id of the caller.
    if (receiver == 'me') {
      return {object_type: 'user', object_id: message.author.id};
    }

    // if the receiver is '@here', we get the id of the current channel.
    if (receiver == '@here') {
      return {object_type: 'channel', object_id: message.channel.id};
    }

    // At this point, if the message is in dms, but the receiver is not 'me', we shouldn't do anything.
    if (message.channel.type == 'dm') {
      message.reply(`since you're messaging me in dms, the only valid receiver is **me**. :( Try again!`)
        .then((msg) => {
          msg.delete(20000);
        });
      return null;
    }

    // Remove unneeded alligators.
    receiver = receiver.replace('<', '');
    receiver = receiver.replace('>', '');

    // If the tag is a user nickname tag, get the guild member.
    if (receiver.indexOf('@!') >= 0) {
      var member = message.guild.members.find('id', receiver.replace('@!', ''));
      return {object_type: 'user', object_id: member.id};
    }

    // If the tag is a role tag, get the role.
    if (receiver.indexOf('@&') >= 0) {
      var role = message.guild.roles.find('id', receiver.replace('@&', ''));
      return {object_type: 'role', object_id: role.id};
    }

    // If the tag is a basic user tag, get the user.
    if (receiver.indexOf('@') >= 0) {
      var member = message.guild.members.find('id', receiver.replace('@', ''));
      return {object_type: 'user', object_id: member.id};
    }

    // If the tag is a channel tag, get the channel.
    if (receiver.indexOf('#') >= 0) {
      var channel = message.guild.channels.find('id', receiver.replace('#', ''));
      return {object_type: 'channel', object_id: channel.id};
    }

    // Return false if nothing is obtained. This most likely means an error in the input.
    message.reply(`not quite sure what happened in my code...But I couldn't determine where to send the reminder. :( Ask Aiga for help!`)
      .then((msg) => {
          msg.delete(20000);
        });
      
    return null;
  }

  /**
   * [getMutatorKey description]
   * @param  {[type]} mutator_input [description]
   * @return {[type]}               [description]
   */
  getMutatorKey(mutator_input) {

    // If the key is in plural, remove the last s.
    // This will make the array below cleaner.
    if (mutator_input[mutator_input.length - 1] == 's' && mutator_input.length != 1) {
      mutator_input = mutator_input.substr(0, mutator_input.length - 1);
    }

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

    var key = mutator_assoc[mutator_input.toLowerCase()];

    if (key === null) {
      console.log('ERROR: Invalid Mutator was somehow given. Please check the code!');
      return false;
    }

    return key;
  }

}

module.exports = Remind;