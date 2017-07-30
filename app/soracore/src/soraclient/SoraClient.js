/**
 * === Discord Client Class ===
 * Sora's mainframe depends on Discord.js, created by hydrabolt.
 * Documentation: https://discord.js.org/#/
 */
const DiscordClient = require(coreroot + 'node_modules/discord.js/src/client/Client');

/**
 * === Modules ===
 * All of these includes are classes customized for the bot.
 * Ideally, these modules aren't limited to Sora's use only, and can be transferred to other bots if you want to.
 */

// Used to manage the interpretation, discernation and processing of Commands.
const CommandManager = require('./command/CommandManager');

// Used to manage text communication.
const DiscourseManager = require('./discourse/DiscourseManager');

// @TODO
// const ReactManager = require('./react/ReactManager');

// @TODO
// const ConfigManager = require('./config/ConfigManager');

// @TODO
// const VoiceManager = require('./voice/VoiceManager');

// @TODO
// const ThirdEye = require('./ThirdEye');

// @TODO
// const Reminder = require('./Reminder');

/**
 * Sora's class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class SoraClient extends DiscordClient {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super();

    // Set the settings...LOL. SET THE SETTINGS! GET IT?!
    // @see setting.js at the root of the project.
    this.apptoken = settings.apptoken;
    this.cprefix = settings.cprefix;
    this.gods = settings.gods;
    this.admins = Object.assign(settings.admins, settings.gods);

     // Plug the command manager to the bot's Client.
    this.commandManager = new CommandManager(this);

    // Plug the discourse manager to the bot's Client.
    this.discourseManager = new DiscourseManager(this);

    /**
     * === Events Callbacks ===
     */

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nSora: I am now properly linked to the Discord infrastructure. Enjoy!");

    });

    /**
     * Event that fires when Sora receives a message.
     * @param  {Object} message :: https://discord.js.org/#/docs/main/stable/class/Message
     */
    this.on("message", (message) => {

      // The Command Manager interprets the message and decides what to do with it.
      this.commandManager.interpret(message);

    });

    // Event: When Sora disconnects from Discord.
    this.on('disconnected', () => {

      // Logs disconnection event in console.
      console.log("Sora: I have been disconnected from the Discord infrastructure, which means I'm going to disappear soon. ;_; See you soon though!");

    });

    // Sora will automatically login when instanciated.
    super.login(this.apptoken);

  }

  /**
   * Instant Messaging method
   * This is used for messages that must be instantly sent to a given destination.
   * @param  {[string]} text        Text to send.
   * @param  {[Message/User/Channel]} destination Destination to send the text to.
   */
  im(destination, text) {

    // The Discourse Manager takes care of this. In case Discord.Js changes thing greatly, we would only have to modify things in there.
    this.discourseManager.instantMessage(destination, text);

  }

  /**
   * Reply method
   * This is used for easy replying to messages received.
   * @param  {[string]} text        Text to send.
   * @param  {[Message]} destination Destination to send the text to.
   */
  reply(message, text) {

    // The Discourse Manager takes care of this. In case Discord.Js changes thing greatly, we would only have to modify things in there.
    this.discourseManager.reply(message, text);
    
  }

  startTyping(channel, delay) {
    return new Promise((resolve, reject) => {
      channel.startTyping(1);
      setTimeout(function(){
        resolve("Success!"); // Yay! Everything went well!
        channel.stopTyping();
      }, delay);
    });
  }

  /**
   * @todo  TypeWrite method
   * This is used for typewriting replies or messages, instead of sending them right away.
   * @param  {[string]} text        Text to send.
   * @param  {[Message]} destination Destination to send the text to.
   */
  // typewrite(text, destination) {
  //   this.discourseManager.typeMessage(text, destination);
  // }

}

module.exports = SoraClient;
