// @TODO - DOCUMENTATION

/**
 * TO MODIFY
 * @fileOverview Sora's main file.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * Sora likes it when it's clean, so keep it tidy!
 */

/* === Commands Start! === */

/**
 * COMMANDS Object
 * Holds COMMANDS objects.
 * Defines actions taken when certain commands are called in chat.
 * @type {Array}
 */
var commands = {};

/**
 * Commands Description
 * -- oplevel: The restriction of who can use the command.
 *  - 0 -> Anyone can use the command.
 *  - 1 -> Only ADMINS can use the command. (All user IDs in the ADMINS array above)
 *  - 2 -> Only the GOD can use the command. (The GOD ID in the variable above)
 *
 * -- allowed_channels: Channels in which the command works.
 *  - 'all' -> Will work in all channels.
 *  - [CHANNEL_ID_1, CHANNEL_ID_2, ...] -> Array of all channel IDs where the command will work.
 *
 * -- allowed_servers: Servers in which the command works.
 *  - 'all' -> Will work in all servers.
 *  - [SERVER_ID_1, SERVER_ID_2, ...] -> Array of all server IDs where the command will work.
 *
 * -- cooldown: Cooldown time of the command (in seconds)
 *  - 20 -> 20 seconds.
 *  - 40 -> 40 seconds.
 *    - Any number here works.
 *
 * -- fn: function( bot, params, msg, msgServer, serverRoles, authorRoles ) {
 *      // Your code for the command goes here.
 *    }
 *  - bot -> Bot object to use for bot actions.
 *  - params -> Command parameter array.
 *    - If the command is  "!test 5 peach 8" ...
 *    - params[1] = 5,
 *    - params[2] = peach,
 *    - params[3] = 8.
 *   - msg -> Message object of the invoked message that triggered the command.
 *   - msgServer -> Server that the message arrived from.
 *   - serverRoles -> All roles of the server that the command was invoked from in an array.
 *   - authorRoles -> All roles of the author that invoked the command.
 */

/**
 * Implements the *ping* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
commands.ping = {
  fn: function( sora, params, msg ) {

    sora.sendMessage(msg.channel, "Yes, " + sora.helpers.printUserTag(msg.author) + "? What can I do for you?");

  }
}

/**
 * Implements the *pong* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
commands.pong = {
  fn: function( sora, params, msg ) {

    sora.sendMessage(msg.channel, "Mm?...Anything you might need from me, " + sora.helpers.printUserTag(msg.author) + "?");

  }
}

/**
 * [guid description]
 * @type {Object}
 */
commands.guid = {
  fn: function( sora, params, msg ) {
    if(params[0]) {
      var userID = sora.helpers.extractID(params[0]);
      var user = sora.users.get("id", userID);
      sora.deleteMessage(msg);
      sora.sendMessage(sora.users.get("id", msg.author.id), "Hey Aigachu! Here's the requested id of the user: **" + user.username + "**\n\n**" + userID + "**");
    } else {
      sora.deleteMessage(msg);
      sora.sendMessage(sora.users.get("id", msg.author.id), "Heyyy...Ya done messed up mang. Add a parameter to the command. >.>");
    }
  }
}

/**
 * Implements the *setname* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.setname = {
  fn: function( sora, params, msg ) {
    if(sora.helpers.val(params)) {

      var newName = msg.content.substring(msg.content.indexOf(params[0]), msg.content.length);

      sora.setUsername(newName).catch(function(err){
        if(err) {
          sora.sendMessage( msg.channel, "There seems to have been an error.\nAllow me to format it for you.\n\n```" + err + "```\nI have logged the console with more information.");
          console.log(err);
        } else {
          sora.sendMessage( msg.channel, "Got it! I'll change my name right now.");
        }
      });

    } else {
      sora.sendMessage( msg.channel, "You seem to have forgotten a parameter. Please tell me what to change my display name to!");
    }
  }
}

/**
 * Implements the *coin* command.
 * @params  {[none]}
 * @result  {[message]} 
 */
commands.coin = {
  fn: function( sora, params, msg ) {
    if(sora.helpers.val(params, 0)) {
      var flip = Math.floor(Math.random() * 2) + 1;

      flip = ((flip == 1) ? 'Heads' : 'Tails');

      var flip_types = [];
      flip_types.push({
        message: "_Coinflip emulation has begun. Just a moment..._",
        timeout: 2
      });
      flip_types.push({
        message: "_Coinflip emulation has begun. Looks like..._",
        timeout: 1
      });
      flip_types.push({
        message: "_Coinflip emulation has begun. The coin spins_\nWait for it...",
        timeout: 5
      });

      var rand = flip_types[Math.floor(Math.random() * flip_types.length)];

      sora.sendMessage(msg.channel, rand.message);
      sora.startTyping(msg.channel);

      setTimeout(function(){
        sora.sendMessage(msg.channel, "<@" + msg.author.id + "> obtained **" + flip + "** !");
        sora.stopTyping(msg.channel);
      }, 1000 * rand.timeout);
    } else {
      sora.sendMessage( msg.channel, "You seem to have made a mistake with your command. Try using the `help` command! I can remind you about the way a command is used.");
    }
  }
}

/**
 * Implements the rolldice command.
 * @result  {[message]} 
 */
commands.rolldice = {
  fn: function( sora, params, msg) {
    var roll = Math.floor(Math.random() * 6) + 1;

    var roll_types = [];
    roll_types.push({
      message: "_rolls the die normally_",
      timeout: 1
    });
    roll_types.push({
      message: "_rolls the die violently_\n_the die falls on the ground_",
      timeout: 2
    });
    roll_types.push({
      message: "_accidentally drops the die on the ground while getting ready_\nOops! Still counts right...?",
      timeout: 2
    });
    roll_types.push({
      message: "_spins the die_\nWait for it...",
      timeout: 5
    });

    var rand = roll_types[Math.floor(Math.random() * roll_types.length)];

    sora.sendMessage(msg.channel, rand.message);
    sora.startTyping(msg.channel);

    setTimeout(function(){
      sora.sendMessage(msg.channel, "<@" + msg.author.id + "> rolled a **" + roll + "** !");
      sora.stopTyping(msg.channel);
    }, 1000 * rand.timeout);
  }
}

/**
 * Implements 8ball command.
 * Not sure if using the term '8ball' for the object key is going to fuck shit up so we'll name it 'ball' and put an '8ball' alias.
 * 
 */
commands.ball = {
  fn: function( sora, params, msg) {
    if(params[0]) {
      var answers = [];

      answers.push({
        message: "8ball says: \"_It is certain._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_It is decidedly so._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Without a doubt._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Yes, definitely._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_You may rely on it._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_As I see it, yes._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Most likely._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Outlook good._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Yes._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Signs point to yes._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Reply hazy try again._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Ask again later._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Better not tell you now._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_Cannot predict now._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Concentrate and ask again._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Don't count on it._\"",
        timeout: 3
      });
      answers.push({
        message: "8ball says: \"_My reply is no._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_My sources say no._\"",
        timeout: 2
      });
      answers.push({
        message: "8ball says: \"_Very doubtful._\"",
        timeout: 4
      });
      answers.push({
        message: "8ball says: \"_Outlook not so good._\"",
        timeout: 2
      });

      var rand = answers[Math.floor(Math.random() * answers.length)];

      sora.startTyping(msg.channel);

      setTimeout(function(){
        sora.sendMessage(msg.channel, "<@" + msg.author.id + "> " + rand.message);
        sora.stopTyping(msg.channel);
      }, 1000 * rand.timeout);
    } else {
      sora.sendMessage( msg.channel, "8ball says: \"_Now now, ask me something. Don't be shy!_\"");
    }
  }
}

/**
 * Implements the love command.
 * @type {Object}
 */
commands.love = {
  fn: function( sora, params, msg) {
    if(params[0]) {
      // Lol Aiga naming your variable 'thing' really? xD
      var thing = msg.content.substring(msg.content.indexOf(params[0]), msg.content.length);

      var author_name = msg.author.name;
      // var author_name_int = parseInt(author_name);

      console.log(author_name_int);

      sora.sendMessage( msg.channel, "There is __**" + Math.floor(Math.random() * 100) + "%**__ love between <@" + msg.author.id + "> and **" + thing + "**!" );
    } else {
      sora.sendMessage( msg.channel, "You have 100% for ZeRo & M2K's AS5 if you don't specify an object or person!\n\n_Make sure you put an argument! `!love cheesecake`_");
    }
  }
}

/**
 * Implements the main command.
 * Randomly selects a main from Super Smash Brothers for Wii U/3DS, for the user of the command.
 * Posts the image of the main.
 * Color Palette Randomization too!
 *
 * IF BAYONIGGA IS CHOSEN, POP OUT THE "OH NON" MEME AS WELL FOR FUNNIES.
 *
 * THIS IS A NICE TO HAVE - NOT A TOP PRIORITY.
 * $sora main - It shows your main if you have one, and if you don't she asks you to set one.
 * $sora main set - Randomly choose a main for a user. It saves it for the user.
 * If you reuse 'set', she's going to tell you that you already have one.
 *
 * MP3 FILES OF THE ANNOUNCER SAYING THE NAME OF THE CHARACTER IN A VOICE CHANNEL ONCE THE COMMAND IS USED.
 */
commands.main = {
  fn: function(sora, params, msg) {
    // Get all images from Smash 4 resources folder.
    var s4images = fs.readdirSync(resources + "smash4-character-portraits");

    var random = s4images[Math.floor(Math.random() * s4images.length)];

    sora.sendMessage(msg.channel, sora.helpers.printUserTag(msg.author.id) + "! Your new main is..._drumroll_");
    sora.startTyping();
    sora.sendFile(msg.channel, resources + 'smash4-character-portraits/' + random, random, function(){
      sora.stopTyping();
    });

  }
}

/**
 * Implements the 'ironman' command.
 * Generates a list of characters for the user.
 *
 * Armady's idea - Generate custom movesets for each characters as well.
 * $sora ironman *custom*
 *
 * @todo  - Explore the potential of adding character stock icons to the list generate (would be cool tho)
 */
commands.ironman = {
  fn: function(sora, params, msg) {
    // code goes here
  }
}

/**
 * Unokened the 'handicap' command.
 * Presents the user with a handicap to potentially use in their next smash match!
 */
commands.handicap = {
  fn: function(sora, params, msg) {
    // code 
  }
}

/**
 * Implements the *help* command.
 * @params  {[none]}
 * @result  {[message]}
 */
commands.help = {
  fn: function( sora, params, msg ) {
    if(sora.helpers.val(params, 0)) {

      // Print general help text for all commands.
      sora.sendMessage(msg.channel, 'I *should* print the general help message, but Aigachu hasn\'t written it yet. Lazy bum!');

      return;

    } else if(sora.helpers.val(params)) {

      var command_object = sora.commands_configs[params[0]];

      if(command_object == undefined) {
        sora.sendMessage(msg.channel, "I don't think that command exists...");

        return;
      }

      if(command_object['help_text'].length == 0) {

        sora.sendMessage(msg.channel, "This command doesn't seem to have help text set. Bummer! Hassle Aigachu and tell him to update the documentation! :scream:");

        return;

      } else {

        sora.sendMessage(msg.channel, command_object['help_text']);

        return;

      }

    } else {
      sora.sendMessage( msg.channel, "Hmm. That doesn't seem to be the proper use of the help command.");

      return;
    }
  }
}

/**
 * Implements the *dlist* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.dlist = {
  fn: function( sora, params, msg ) {
    // Servers Object
    var all_servers = sora.servers;

    var message = "Here is the list of all worlds I am linked to, as well as their channels!\n";

    message += '```\n';

    for( var server_key in all_servers ) {
      if( all_servers.hasOwnProperty(server_key) && server_key != 'limit' && server_key != 'length') {

        var server = all_servers[server_key];
        var server_all_channels = server.channels;
        message += server.name + "\n";

        for (var channel_key in server_all_channels ) {
          if( server_all_channels.hasOwnProperty(channel_key) && channel_key != 'limit' && channel_key != 'length' ) {

            var channel = server_all_channels[channel_key];
            message += '-- ' + channel.name + "\n";

          }
        }

        message += '\n'
      }
    }

    message += '```\n';

    sora.sendMessage( msg.channel, message);

  }
}


/**
 * Implements the *thirdeye* command.
 * @params  {[none]}
 * @result  {[message]} [Sora changes her display name. Don't worry, she will always be Sora to us. ;)]
 */
commands.thirdeye = {
  fn: function( sora, params, msg ) {

    var this_dimension = msg.channel.server;

    var this_world = msg.channel;

    var their_dimension = sora.servers.get("name", sora.helpers.extractParam('{', '}', msg));

    var their_world = their_dimension.channels.get("name", sora.helpers.extractParam('[', ']', msg));

    sora.THIRDEYE = {
      this_dimension: this_dimension,
      this_world: this_world,
      their_dimension: their_dimension,
      their_world: their_world,
    };

    var message = "";

    message = "The __**third eye**__, Aigachu?...";

    message += "\n";

    message += "Well alright...But be careful! You wouldn't want to cause a *mess*, now would you? ;) :blue_heart:";

    message += "\n";

    message += "A-And remember that this is a very primitive version of this functionality! Please be careful with using it. :fearful:";

    message += "\n";

    message += "I will now establish a link between the following servers & channels:";

    message += "\n\n```\n";

    message += this_dimension.name + " -- " + this_world.name + "\n";

    message += "\n```";

    message += "\n\n```\n";

    message += their_dimension.name + " -- " + their_world.name + "\n";

    message += "\n```";

    sora.sendMessage( msg.channel, message );

  }
}

/* === Commands End! === */

// Export the Commands object for use in `sora.js`
exports.commands = commands;
