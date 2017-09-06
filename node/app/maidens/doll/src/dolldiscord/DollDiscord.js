/**
 * Doll's Discord class. 
 */
class DollDiscord extends MaidenDiscord {

  /**
   * === Class constructor ===
   */
  constructor(settings) {

    // Call the constructor of the Discord Client parent Class.
    super(settings);

    // Customize welcome message.
    this.welcome = `Hello good hunter...What is it you desire?`;

    // Event: When the Plain Doll connects to Discord and is ready.
    this.on('ready', () => {

      // Logs connection event in console.
      console.log("\nDawn will soon break... This night, and this dream, will end.");

      // Set status to DND!
      this.user.setStatus('dnd');

    });

  }

}

module.exports = DollDiscord;
