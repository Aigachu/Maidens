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

    // Event: When Colette connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nJack in! Colette! Execute! xD");

      // Message me to let me know the deployment is done.
      this.home.channel.send('Whoa...I feel revitalized! Did you do something, Aiga?');

    });

  }

}

module.exports = ColetteDiscord;
