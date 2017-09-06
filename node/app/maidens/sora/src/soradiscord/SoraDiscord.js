/**
 * Sora's Discord class.
 * "Keep it tidy in here, okay!?" - Sora Akanegasaki
 */
class SoraDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    // Customize welcome message.
    this.welcome = `_"When you close your eyes, I disappear."_...Your eyes seem to be open now, though. :laughing:`;

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nHello Aiga! This is Sora Akanegasaki reporting in. I am now linked to Discord! :)");

    });

  }

}

module.exports = SoraDiscord;
