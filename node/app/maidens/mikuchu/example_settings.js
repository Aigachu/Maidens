/**
 * Configuration file for Sora's core functionality.
 * This configuration file is needed for the bot to begin functioning when you run 'node sora.js'.
 * If configurations are not set, Sora will prompt you to modify values in here.
 *
 * Have fun!
 */
module.exports = {
  'src':  __dirname + '/src/',
  // Discord Application Token
  // This can be obtained from the developers section of the discord site.
  // Create an application and paste the token here!
  // @url: https://discordapp.com/developers/docs/intro
  'apptoken': '',

  // Sora's Command Prefix
  // She is currently set up to accept commands like this:
  // -- $sora COMMAND_KEY param_1 param_2 ... param_n
  'cprefix': '$s',

  // Gods can use all commands at any time.
  // They correspond to oplevel being set to 2.
  'gods': {
    '77517077325287424': 'Aigachu',
  },

  // Admins can use all commands with an oplevel set to 1 or lower.
  'admins': {
    '82530619355037696': 'Avion',
  }
}
