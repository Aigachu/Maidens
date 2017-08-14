/**
 * === Objects ===
 * These objects are core objects that the discord bot will use.
 */
global.Command = require('./objects/Command');
global.Quip = require('./objects/Quip');

/**
 * === Managers ===
 * Managers that deal with core concepts in discord bot programming.
 */

// Used to manage the interpretation, discernation and processing of Commands.
const CommandManager = require('./MaidenCommandManager');

// Used to manage text communication.
const CooldownManager = require('./MaidenCooldownManager');

// Used to manage quips (replies to certain words!).
const QuipManager = require('./MaidenQuipManager');

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
    this.coreroot = __dirname + '/';
    this.root = settings.root;
    this.maiden_name = settings.maiden_name;
    this.namespace = this.root + 'src/' + this.constructor.name.toLowerCase() + '/';
    this.assets = this.root + 'assets/';
    this.apptoken = settings.discord.apptoken;
    this.cprefix = settings.discord.cprefix;
    this.gods = settings.discord.gods;
    this.admins = Object.assign(settings.discord.admins, settings.discord.gods);

    // Plugins
    // We initiate the plugins first since they may have quips or commands.
    this.plugins = this.loadPlugins(settings.discord.plugins);

    // Listeners
    // Listeners are extended functions that monitor messages and do actions accordingly.
    // Custom listeners can be added by plugins or even commands.
    this.listeners = [];

    // Initiate the cooldown manager to the bot's Client.
    this.cooldownManager = new CooldownManager(this);

    // Initiate the command manager to the bot's Client.
    this.commandManager = new CommandManager(this);

    // Initiate the quip manager to the bot's Client.
    this.quipManager = new QuipManager(this);

    // Welcome message when the bot connects to Discord.
    // This will be sent every time the bot connects. It's a handy way to know if the bots disconnected.
    this.welcome = `Connected.`;

    /**
     * === Events Callbacks ===
     */

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      // console.log("\nI am now properly linked to the Discord infrastructure. Enjoy!");

      // Home Server - Stairway to Heaven
      this.home = {
        guild: this.guilds.find('id', '314130398173069312'),
        channel: this.channels.find('id', '327535083164663808'),
      }

      // Message me to let me know the deployment is done.
      this.home.channel.send(this.welcome);

    });

    /**
     * Event that fires when Sora receives a message.
     * @param  {Object} message :: https://discord.js.org/#/docs/main/stable/class/Message
     */
    this.on("message", (message) => {

      // Fire listeners set by other modules.
      this.listeners.every((listener) => {
        listener.listen(this, message);
        return true;
      })

      // The Command Manager interprets the message and decides what to do with it.
      this.commandManager.interpret(message);

      // The Quip Manager interprets the message and decides what to respond with.
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

  loadPlugins(plugins) {
    var plugins_array = [];

    plugins.every((plugin) => {
      var plugin_path = __dirname + '/plugins/' + plugin;
      var PluginClass = require(plugin_path);

      plugins_array.push({
        name: plugin,
        path: plugin_path,
      });

      this[plugin] = new PluginClass(this);

      return true;
    });

    return plugins_array;
  }

}

module.exports = MaidenDiscord;
