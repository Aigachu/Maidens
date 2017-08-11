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

    this.welcome = `Can you see me, Aiga? I'm connected to this peculiar dimension.`;

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nHello Aiga! This is Sora Akanegasaki reporting in. I am now linked to Discord! :)");

      // Set game!
      this.user.setGame('Blick Winkel...');

    });

  }

}

module.exports = SoraDiscord;
