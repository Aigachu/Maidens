/**
 * Sora's Discord class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class ColetteDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    this.welcome = `Jack in! Colette! Executed! :yum:\nWoo :smile:`;

    // Event: When Colette connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nJack in! Colette! Execute! xD");

      // Set game!
      this.user.setGame('Watchdog is live!');

      // Plug and initialize Watchdog.
      // @todo - make all 'plugins' activate automatically from a plugins folder.
      this.watchdog = new Watchdog(this);

    });

  }

}

module.exports = ColetteDiscord;
