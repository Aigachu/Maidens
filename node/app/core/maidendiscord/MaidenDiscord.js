/**
 * === Modules ===
 * All of these includes are classes customized for the bot.
 * Ideally, these modules aren't limited to Sora's use only, and can be transferred to other bots if you want to.
 */

// Used to manage the interpretation, discernation and processing of Commands.
const CommandManager = require('./command/CommandManager');

// Used to manage text communication.
const CooldownManager = require('./cooldown/CooldownManager');

// Used to manage quips (replies to certain words!).
const QuipManager = require('./quip/QuipManager');

/**
 * === Classes ===
 */
global.Command = require('./command/Command');
global.Quip = require('./quip/Quip');

// @TODO
// const ConfigManager = require('./config/ConfigManager');

// @TODO
// const VoiceManager = require('./voice/VoiceManager');

// @TODO
// const ThirdEye = require('./ThirdEye');

// @TODO
// const Reminder = require('./Reminder');

/**
 * Sora's Discord class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class MaidenDiscord extends DiscordClient {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super();

    // Set the settings...LOL. SET THE SETTINGS! GET IT?!
    // @see setting.js at the root of the project.
    this.root = settings.root;
    this.namespace = this.root + 'src/' + this.constructor.name.toLowerCase() + '/';
    this.apptoken = settings.apptoken;
    this.cprefix = settings.cprefix;
    this.gods = settings.gods;
    this.admins = Object.assign(settings.admins, settings.gods);

    // Plug the cooldown manager to the bot's Client.
    this.cooldownManager = new CooldownManager(this);

    // Plug the command manager to the bot's Client.
    this.commandManager = new CommandManager(this);

    // Plug the quip manager to the bot's Client.
    this.quipManager = new QuipManager(this);

    // Listeners
    this.listeners = [];

    /**
     * === Events Callbacks ===
     */

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      // console.log("\nSora: I am now properly linked to the Discord infrastructure. Enjoy!");

    });

    /**
     * Event that fires when Sora receives a message.
     * @param  {Object} message :: https://discord.js.org/#/docs/main/stable/class/Message
     */
    this.on("message", (message) => {

      // Fire listeners set by other modules.
      this.listeners.every((listener) => {
        listener.listen();
        return true;
      })

      // The Command Manager interprets the message and decides what to do with it.
      this.commandManager.interpret(message);

      // The Quip Manager interprets the message and decides to respond with.
      this.quipManager.quip(message);

    });

    // Event: When Sora disconnects from Discord.
    this.on('disconnected', () => {

      // Logs disconnection event in console.
      console.log("Bot has been disconnected.");
      // @Todo - function to specify which bot got disconnected.

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

    destination.send(text);

  }

  /**
   * Reply method
   * This is used for easy replying to messages received.
   * @param  {[string]} text        Text to send.
   * @param  {[Message]} destination Destination to send the text to.
   */
  reply(message, text) {

    message.reply(text);
    
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

  cool(type, key, scope, duration) {
    this.cooldownManager.set(type, key, scope, duration);
  }

}

module.exports = MaidenDiscord;
