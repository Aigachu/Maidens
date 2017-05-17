/**
 * Discord Client class include.
 * Sora's mainframe depends on Discord.js, created by hydrabolt.
 * https://discord.js.org/#/
 */
const DiscordClient = require(coreroot + 'node_modules/discord.js/src/client/Client');
const CommandManager = require('./command/CommandManager');
const DiscourseManager = require('./discourse/DiscourseManager');

/**
 * Sora's Discord Client class.
 * Used to customize all of Discord Client functions and properties.
 */
class SoraClient extends DiscordClient {

  /**
   * Class constructor
   */
  constructor(settings) {

    super();

    // Set the settings...LOL. SET THE SETTINGS! GET IT?!
    this.apptoken = settings.apptoken;
    this.cprefix = settings.cprefix;
    this.gods = settings.gods;
    this.admins = settings.admins;

    /**
     * Plug a command manager of the Client
     * @type {CommandManager}
     * @private
     */
    this.commandManager = new CommandManager(this);

    /**
     * Plug a discourse manager of the Client
     * @type {DiscourseManager}
     * @private
     */
    this.discourseManager = new DiscourseManager(this);

    /**
     * === Events Callbacks ===
     */

    // Event: When Sawako connects to Discord.
    this.on('ready', function() {

      // Logs connection event in console.
      console.log("\nSora: I am now properly linked to the Discord infrastructure. Enjoy!");

    });

    /**
     * Event that fires when Sora receives a message.
     * @param  {Object} msg)
     * @todo : add example msg object reference to Wiki.
     */
    this.on("message", function (msg) {

      this.commandManager.interpret(msg);

    });

    // Event: When Sora disconnects from Discord.
    this.on('disconnected', function() {

      // Assign to client to a variable.
      var sora = this;

      // Logs disconnection event in console.
      console.log("Sora: I have been disconnected from the Discord infrastructure, which means I'm going to disappear soon. ;_; See you soon though!");

    });
  }

  /**
   * [login description]
   * @return {[type]} [description]
   */
  soraLogin() {
    this.login(this.apptoken);
  }

  im(text, destination) {
    this.discourseManager.sendMessage(text, destination);
  }

  // type(text, destination) {
  //   this.discourseManager.typeMessage(text, destination);
  // }

}

/**
 * SawakoClient class exports.
 */
module.exports = SoraClient;
