const Watchdog = require(__dirname + '/watchdog/Watchdog');

/**
 * Sora's Discord class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class MikuchuDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    // Event: When the bot connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nMiku here. I'm ready to start the show. ;)");

      // Message me to let me know the deployment is done.
      this.home.channel.send('Development bot, at your service!');

      // Set status to DND!
      this.user.setStatus('dnd');

      // Set game!
      this.user.setGame('Singing coding songs~');

      // Plug and initialize Watchdog.
      this.watchdog = new Watchdog(this);

    });

  }

}

module.exports = MikuchuDiscord;
