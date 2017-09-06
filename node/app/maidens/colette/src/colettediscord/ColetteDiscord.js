/**
 * Colette's Discord class.
 */
class ColetteDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    // Customize her welcome message.
    this.welcome = `Jack in! Colette! Execute! :yum:\nWoo :smile:`;

    // Event: When Colette connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nJack in! Colette! Execute! xD");

      // Set game!
      this.user.setGame('Watchdog is live!');

    });

  }

}

module.exports = ColetteDiscord;
