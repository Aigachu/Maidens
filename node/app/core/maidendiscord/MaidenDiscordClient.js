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

// Used to manage the interpretation and processing of Commands.
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
 * Maiden's Discord class.
 * This class extends the DiscordClient class and adds functionality for the maidens.
 *
 *
 * A little words from the girls...
 * 
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 * 
 * "I'm really glad you revived me Aiga...This is cleaner than ever!" - Colette Brunel
 * 
 * "Would you like some Blood, Aigachu?" - Maria
 * 
 * "I'm not quite sure what my purpose is..." - Plain Doll
 *
 * Let's get started.
 */
class MaidenDiscordClient extends DiscordClient {
  
  /**
   * === Class constructor ===
   * Settings are added in the constructor, and the object is retrieved from
   * the 'settings.js' in the given bot files.
   *
   * Check an individual maiden's code to see an example settings.js file.
   * @param {Object} settings Settings read from the bot's 'settings.js' file.
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super();

    // Root of the 'core' directory. The directory that THIS file is in.
    // Bots will sometimes need to access this directory and it's files.
    this.coreroot = __dirname + '/';

    // A Maiden's root is set in their 'settings.js' file. This is to access all of their
    // respective assets and files properly.
    this.root = settings.root;

    // The Maiden Name is also set in their settings. This is to know the name of their
    // folder, and will be used to set folder names for their databases.
    this.maiden_name = settings.maiden_name;

    // The namespace for their DISCORD code.
    // We'll get this path using the path to their root, followed by src and then the name of the constructor.
    this.namespace = this.root + 'src/' + this.constructor.name.toLowerCase() + '/';

    // The path to the assets folder for the Maiden.
    this.assets = this.root + 'assets/';

    // Discord Bot apptoken, also set in the Maiden's 'settings.js'.
    this.apptoken = settings.discord.apptoken;

    // Command prefix, also set in the Maiden's 'settings.js'.
    this.cprefix = settings.discord.cprefix;

    // Gods array, also set in the Maiden's 'settings.js'.
    this.gods = settings.discord.gods;

    // Admins, also set in the Maiden's 'settings.js'.
    // The gods array is merged into this one.
    this.admins = Object.assign(settings.discord.admins, settings.discord.gods);

    // Plugins
		// Initialize the plugins to make PHPStorm happy.
		this.watchdog = null;
		this.reminder = null;
		this.thirdeye = null;
		
    // All plugins can be found in the folder called 'plugins' in the same directory as this file.
    // Plugins are 'plugged'to the Maidens in their 'settings.js' files.
    // We initiate the plugins first since they may (surely) have commands.
    this.plugins = this.loadPlugins(settings.discord.plugins);

    // Listeners
    // Listeners are extended functions that monitor messages and do actions accordingly.
    // Custom listeners can be added by plugins or commands.
    // i.e. Colette's Watchdog.
    this.listeners = [];

    // Initiate the cooldown manager to the bot's Client.
    this.cooldownManager = new CooldownManager(this);

    // Initiate the command manager to the bot's Client.
    this.commandManager = new CommandManager(this);

    // Initiate the quip manager to the bot's Client.
    this.quipManager = new QuipManager(this);

    // Welcome message when the bot connects to Discord.
    // This will be sent every time the bot connects. It's a handy way to know if the bots disconnected.
    // This is the default value. For each bot, we can change this.
    this.welcome = `Connected.`;

    // Game
    // The game is fetched from the settings as well. :)
    this.game = settings.discord.game;

    /**
     * === Events Callbacks ===
     */

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Home Server - Stairway to Heaven
      // When the bots connect, I want them to send a message to this guild each time.
      // It allows me to know when they disconnect and reconnect.
      this.home = {
        guild: this.guilds.find('id', '314130398173069312'),
        channel: this.channels.find('id', '327535083164663808'),
      };

      // Message me to let me know the deployment is done.
      this.home.channel.send(this.welcome);

      // Set game text.
      // @TODO - I set the URL to google because without it, it mysteriously doesn't work...
      this.user.setGame(this.game, 'http://google.com')
          .then((client_user) => {
            // Do nothing.
          }).catch(console.error);

    });

    /**
     * Event that fires when Maidens receive messages.
     * @param  {Message} message The message that was read.
     */
    this.on("message", (message) => {

      // Fire listeners set by other modules.
      this.listeners.every((listener) => {
        listener.listen(this, message);
        return true;
      });

      // The Command Manager interprets the message and decides what to do with it.
      this.commandManager.interpret(message);

      // The Quip Manager interprets the message and decides what to respond with.
      this.quipManager.quip(message);

    });

    // Event: When the Maiden disconnects from Discord.
    this.on('disconnected', () => {

      // Logs disconnection event in console.
      console.log("Bot has been disconnected.");
      // @Todo - function to specify which bot got disconnected.

    });

    // Maiden will automatically login when instantiated.
    super.login(this.apptoken);

  }

  /**
   * Instant Messaging method
   * This is used for messages that must be instantly sent to a given destination.
   * @param  {String}               text        Text to send.
   * @param  {Message/User/Channel} destination Destination to send the text to.
   */
  im(destination, text) {

    // @see: https://discord.js.org/#/docs/main/stable/general/welcome
    destination.send(text);

  }

  /**
   * Reply method
   * This is used for easy replying to messages received.
   * @param  {[string]} text    Text to send.
   * @param  {Message}  message Message to send the text to.
   */
  reply(message, text) {

    // @see: https://discord.js.org/#/docs/main/stable/general/welcome
    message.reply(text)
      .then((message) => {
        // Do nothing.
      }).catch(console.error);
    
  }

  /**
   * Function to start typing.
   * @param  {TextChannel}  channel Discord channel the typing indicator should appear in.
   * @param  {Number}   delay   How much time the typing indication should last.
   * @return {Promise}          Return promise so I can do some sick '.then()' chains.
   */
  startTyping(channel, delay) {
    return new Promise((resolve, reject) => {
      channel.startTyping(1);
      setTimeout(function(){
        resolve("Success!"); // Yay! Everything went well!
        reject("Failure!"); // Fuck!!
        channel.stopTyping();
      }, delay);
    });
  }

  /**
   * Load all plugins into the client.
   * @param  {Array} plugins  Array of plugin folder names that should be loaded.
   * @return {Array}          Array of all plugins with their name and their absolute path.
   */
  loadPlugins(plugins) {

    // Initialize array for plugins.
    let plugins_array = [];
  
    // For every plugin name...
    plugins.every((plugin) => {

      // Get the path to the plugin.
      let plugin_path = __dirname + '/plugins/' + plugin;
  
      // Require the plugin Class.
      let PluginClass = require(plugin_path);
  
      // Push the plugin to the plugins array that will be returned.
      plugins_array.push({
        name: plugin,
        path: plugin_path,
      });

      // Set the plugin to the client.
      // i.e. 'this.watchdog' will now be the Watchdog class.
      this[plugin] = new PluginClass(this);

      // .every() callback needs to return true to continue execution of other elements.
      return true;

    });

    // Return array of all plugins by name and path.
    return plugins_array;
    
  }

}

module.exports = MaidenDiscordClient;
