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
 * Holds COMMAND objects.
 * Defines actions taken when certain commands are triggered in chat.
 * @type {Object}
 */
var commands = {};

/**
 * Commands Description
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

    msg.reply(`Sora, version 2.0, at your service. ;)`)
      .then((msg) => console.log(`Sent a reply to ${msg.author.username}.`))
      .catch(console.error);

  }
}

/**
 * Implements the *pong* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
commands.pong = {
  fn: function( sora, params, msg ) {

    msg.author.sendMessage(`Ping...Pong...Why do you even have two of these? They do exactly the same thing!`)
      .then((msg) => console.log(`Sent a reply to ${msg.author.username}.`))
      .catch(console.error);

  }
}

/**
 * Implements the *ping* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
commands.getthatassbanned = {
  fn: function( sora, params, msg ) {

    msg.channel.sendMessage(`Get that ass banned!`)
      .then((msg) => console.log(`Sent a GTAB call ordered from ${msg.author.username} in the ${msg.channel.name} of the ${msg.channel.guild.name}.`))
      .catch(console.error);

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

      // Set Username
      sora.user.setUsername(newName)
       .then((user, msg) => function(user, msg) {
          console.log(`My new username is ${user.username}`);
        })
       .catch(console.error);

    } else {
      msg.reply(`you seem to have forgotten a parameter. Please tell me what to change my display name to!`);
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
 * SAVES LAST 10 MAINS.
 *
 * MP3 FILES OF THE ANNOUNCER SAYING THE NAME OF THE CHARACTER IN A VOICE CHANNEL ONCE THE COMMAND IS USED.
 */
commands.main = {
  fn: function(sora, params, msg) {
    // Get all images from Smash 4 resources folder.
    var smash4_character_directories = fs.readdirSync(resources + "smash4-character-portraits");

    var character_name = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];

    var character_images = fs.readdirSync(resources + "smash4-character-portraits/" + character_name);

    var random_image = character_images[Math.floor(Math.random() * character_images.length)];

    sora.sendMessage(msg.channel, sora.helpers.printUserTag(msg.author.id) + "! Your new main is..._drumroll_");
    sora.startTyping();
    sora.sendFile(msg.channel, resources + 'smash4-character-portraits/' + character_name + "/" + random_image, random_image, function(){
      sora.stopTyping();
    });

  }
}

/**
 * Implements the 'ironman' command.
 * Generates a list of characters for the user.
 *
 * Armady's idea - Generate custom movesets for each characters as well.
 * $sora ironman # *custom*
 *
 * @todo  - Explore the potential of adding character stock icons to the list generate (would be cool tho)
 */
commands.ironman = {
  fn: function(sora, params, msg) {
    var smash4_character_directories = fs.readdirSync(resources + "smash4-character-portraits");

    var roster_size = smash4_character_directories.length - 2;

    if(params[0] > roster_size) {
      sora.sendMessage(msg.channel, "That number is too high! There are only **" + roster_size + "** characters in the Smash 4 roster you weenie! xD");
    } else if(params[0]) {
      // Get all images from Smash 4 resources folder.

      var number_of_characters = params[0];

      var charlist = [];

      var chosen_characters = [];

      for( i = 0; i < number_of_characters; i++ ) {
        var random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];

        while(random_character in chosen_characters || random_character == "Misc" || random_character == "Memes") {
          random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];
        }

        charlist[i] = random_character;
        chosen_characters[random_character] = random_character;
      }

      var message = "Here's your list of iron man characters!\n\n";

      for (var key in charlist) {
        if(charlist.hasOwnProperty(key)) {
          message += "-- **" + charlist[key] + "**\n";
        }
      }

      message += "\nThere we go! Good luck against your challenger. ;)";

      sora.sendMessage(msg.channel, message);

    } else {
      sora.sendMessage(msg.channel, "You sorry fool. Don't even think about it. nairoFiend");
    }

  }
}

/**
 * Unokened the 'handicap' command.
 * Presents the user with a handicap to potentially use in their next smash match!
 */
commands.handicap = {
  fn: function(sora, params, msg) {
    var handicaps = [];

    handicaps.push({
      title: "Air Mac",
      details: "You may not use aerials during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "FG Link",
      details: "You may only use Special Moves (B) moves to attack during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "A for Effort",
      details: "You may only use Normal Attacks (A) moves to attack during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Smashing Effort",
      details: "You may only attack using smash attacks!",
      timeout: 3
    });
    handicaps.push({
      title: "Take Flight",
      details: "You may only attack using aerials!",
      timeout: 3
    });
    handicaps.push({
      title: "We Tech Those",
      details: "You may not tech during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Dunkin Donuts",
      details: "You may only finish off stocks with Dunks!",
      timeout: 3
    });
    handicaps.push({
      title: "SOLOYOLO",
      details: "You may only kill by taking someone to the shadow realm with you!",
      timeout: 3
    });
    handicaps.push({
      title: "Best Defense is Offense",
      details: "You may not shield during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Counterattack",
      details: "You may only kill someone by using a counter move!",
      timeout: 3
    });
    handicaps.push({
      title: "Manhandled",
      details: "You may only grab to during this match to attack!",
      timeout: 3
    });
    handicaps.push({
      title: "One and Done",
      details: "You may not recover once knocked off stage!",
      timeout: 3
    });
    handicaps.push({
      title: "Pitch a Tent",
      details: "You may only win by timing your opponent out!",
      timeout: 3
    });
    handicaps.push({
      title: "Trigger Happy",
      details: "You may not use your shoulder buttons (shield buttons) during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Slow and Steady",
      details: "You may only walk in order to move during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Get your Footing",
      details: "You may only end your opponent's stocks with footstools!",
      timeout: 3
    });
    handicaps.push({
      title: "The Bakery",
      details: "You may not roll during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Iron Boots",
      details: "You may not jump during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Comeback King",
      details: "You must forfeit your first stock at the beginning of the match!",
      timeout: 3
    });
    handicaps.push({
      title: "Too Edgy",
      details: "You may not edgeguard the opponent during the match!",
      timeout: 3
    });
    handicaps.push({
      title: "On Tilt",
      details: "You must kill the opponent utilizing a tilt attack!",
      timeout: 3
    });


    var rand = handicaps[Math.floor(Math.random() * handicaps.length)];

    sora.sendMessage(msg.channel, sora.helpers.printUserTag(msg.author.id) + ", your handicap will be...");
    sora.startTyping(msg.channel);

    setTimeout(function(){
      var message = "**" + rand.title + "**";

      message += "\n" + rand.details;

      message += "\n\nGood luck! :P"

      sora.sendMessage(msg.channel, message);
      sora.stopTyping(msg.channel);
    }, 1000 * rand.timeout);
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
 * Implements the *pong* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
commands.atwat = {
  fn: function( sora, params, msg ) {

    var i = 0;
    while ( i < 1000 ) {
      i++;
      sora.sendMessage(msg.channel, "Hi " + sora.helpers.printUserTag('84100810870358016') + "!");
    }

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
