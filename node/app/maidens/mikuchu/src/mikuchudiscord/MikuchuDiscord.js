/**
 * Mikuchu's Discord class.
 * "I am the ULTIMATE DEVBOT!!! As in the most unstable one ever made. xP" - Hatsune Mikuchu
 */
class MikuchuDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    // Customize welcome message.
    this.welcome = `Hello! Development bot, at your service! :wink:`;

    // Event: When the bot connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nMiku here. I'm ready to start the show. ;)");

      // Set status to DND!
      this.user.setStatus('dnd');

    });

  }

}

module.exports = MikuchuDiscord;
