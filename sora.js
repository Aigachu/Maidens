/**
 * @fileOverview Sora's main file.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * Sora likes it when it's clean, so keep it tidy!
 */

/* === Requires START === */

// Must run `npm install --save discord.js` if this is not installed or found.
var Discord = require("discord.js");

// Get Sora's configuration details.
// A real discord account must be created for the bot to run.
// Put the credentials of the newly created account into `conf/main.json` found at the same level as this file.
var config = require("./conf/main.json");

// Get custom coded functions saved in the `tools.js` file.
var tools = require("./src/tools.js");

// Get all defined commands in the `Commands.js` file.
var CommandsLib = require("./src/Commands.js");

/* === Requires END === */

/* === Variables Start === */

var Commands = CommandsLib.commands;
var CommandPrefix = config.command_prefix;

/* === Variables End === */

// Initiate the Discord Client.
var sora = new Discord.Client();

sora.on("ready", function () {
  console.log("\nSora: I am now properly linked to the Discord infrastructure. Enjoy!");
})

// When Sora disconnects from Discord.
sora.on("disconnected", function () {
  //alert the console
  console.log("Sora has been disconnected from the Discord infrastructure!");

  //exit node.js with an error
  process.exit(1);
});

/**
 * Event that fires when Sora receives a message.
 * @param  {Object} msg)
 * @todo : add example msg object reference to Wiki.
 */
sora.on("message", function (msg) {
  // This object will contain any necessary items that need to be used in commands.
  // This can include the server object, roles, and more.
  var variables = {};

  /* === COMMANDS TREATMENT START === */
  for (var key in Commands) {
    if (Commands.hasOwnProperty(key)) {
      var split = msg.content.split(" "); // Divide text into distinct parameters.
      if(split[0] === CommandPrefix && split[1]) {
        var command = split[1].toUpperCase();
        if(command === key.toUpperCase() && msg.author.id !== sora.user.id) {
          var params = split; 
          params.splice(0, 2);

          // @todo : create a function that handles the treatment of the denial flag
          // this will be good to avoid copy pasting and modification in multiple places
          var DENIAL_FLAG = false;

          // Run Command if it passed approval.
          if(!DENIAL_FLAG) {
            Commands[key].fn(sora, params, msg);
          }
        }
      }
    }
  }
  /* === COMMANDS TREATMENT END === */
});

// Login to Discord after processing all the code above.
sora.login(config.email, config.password);
