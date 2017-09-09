/**
 * Settings file for the bot's core functionality.
 * This configuration file is needed for the bot to begin functioning when you run 'node sora.js'.
 * @todo - if needed settings are not set, the bot will prompt you for them.
 *
 * Have fun!
 */
module.exports = {
  // Root of the bot's files. This should NOT be changed unless you know what you're doing.
  'root':  __dirname + '/',

  // Bot's maiden name. The name here should be the same name as the folder this file is housed in.
  'maiden_name': 'mikuchu',

  // Discord settings.
  'discord': {
    // Discord Application Token
    // This can be obtained from the developers section of the discord site.
    // Create an application and paste the token here!
    // @url: https://discordapp.com/developers/docs/intro
    'apptoken': '',

    // Command Prefix
    // All bots commands can be called by tagging them through discord.
    // Command prefixes are another way to call them if needed.
    'cprefix': 'maidev',

    // Game name that will show on her user.
    // This is fun to set!
    'game': 'ERROR: undefined...LOL JK!',

    // Plugins
    // These plugins are custom coded and will be loaded.
    // Plugins can be found in the core maidendiscord folder.
    // Enter the names of the folders in the 'plugins' folder.
    'plugins': [
      // plugin1,
      // plugin2,
    ],

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
};
