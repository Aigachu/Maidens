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

    // Event: When Sora connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nHello Aiga! This is Sora Akanegasaki reporting in. I am now linked to Discord! :)");

      // Message me to let me know the deployment is done.
      this.home.channel.send('Ah? Seems like my code got reloaded. Thanks for taking care of me, Aiga. :)');

    });

  }

}

module.exports = SoraDiscord;
