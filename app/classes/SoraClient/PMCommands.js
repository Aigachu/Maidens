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
 * PMCOMMANDS Object
 * Holds PMCOMMAND objects.
 * Defines actions taken when certain commands are triggered in a private message to Sora.
 * @type {Object}
 */
var pmcommands = {};

/**
 * PMCommands Description
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
 * Implements the *jquiz* command.
 * @params  {[none]}
 * @result  {[message]} [Sora answers asking if she's needed.]
 */
pmcommands.jquiz = {
  fn: function( sora, params, msg ) {
    // Set User ID to a variable
    var userID = msg.author.id;

    // Nothing has started yet. 
    if(!params[0]) {
      // Give the current step number if initiated. If not, give a rundown.
      if(sora.jquiz[userID]) {
        sora.sendMessage(msg.channel, "BlooBlooBleeBlee!");
      } else {
        sora.sendMessage(msg.channel, "Blablabla!");
      }

      return;
    }

    // Start that shit.
    if(params[0] == 'start') {

      // Initiate the denyflag array.
      sora.denyflags[msg.author.id] = {
        command: 'jquiz'
      }

      // Initiate the JQuiz object with the
      sora.jquiz[userID] = {};
      sora.jquiz[userID].q0 = {
      
      }

      sora.sendMessage(msg.channel, "Start text stuff goes here :blush:");

      return;
    }

    // This is the action the person wants to take.
    var parameter = params[0];

  }
}

/* === Commands End! === */

// Export the Commands object for use in `sora.js`
exports.pmcommands = pmcommands;
