/**
 * Sora's Discord class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class MariaDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    // Event: When Colette connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nA corpse... should be left well alone...");

      // Set status to DND!
      this.user.setStatus('dnd');

      // Set game!
      this.user.setGame('Sleeping...');

    });

  }

}

module.exports = MariaDiscord;
