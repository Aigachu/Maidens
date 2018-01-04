/**
 * Monika's Discord class.
 */
class MonikaDiscordClient extends MaidenDiscordClient {
    
    /**
     * === Class constructor ===
     */
    constructor(settings) {
        
        // Call the constructor of the Discord Client parent Class.
        super(settings);
        
        // Customize welcome message.
        this.welcome = `Hi Aiga! :)`;
        
        // Event: When the Plain Doll connects to Discord and is ready.
        this.on('ready', () => {
            
            // Logs connection event in console.
            console.log("\nWelcome to my Literature Club!");
            
            // Set status to DND!
            this.user.setStatus('dnd')
                .then((status) => {
                    // Do nothing.
                }).catch(console.error);
            
        });
        
    }
    
}

module.exports = MonikaDiscordClient;
