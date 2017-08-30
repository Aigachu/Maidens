/**
 * Sora's Discord class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class DollDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    this.welcome = `Hello good hunter...What is it you desire?`;

    // Event: When Colette connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nDawn will soon break... This night, and this dream, will end.");

      // Set status to DND!
      this.user.setStatus('dnd');

      // Set game!
      this.user.setGame('Sleeping...');

    });

  }

}

module.exports = DollDiscord;
