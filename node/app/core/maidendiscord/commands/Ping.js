/**
 * Ping command.
 *
 * Simply pings the bot, and expects a pong in return.
 *
 * This command is mostly used for testing purposes...Or to check if the bot is alive!
 */
class Ping extends Command {
    
    constructor(client) {
        
        super(client);
        
        this.aliases = ["pi", "pg", "p"];
        
        // this.helpText = "";
        // this.descText = "";
        
        // this.input = {
        //   "example": {
        //     "type": "text",
        //     "name": "An example of text input.",
        //     "description": "Example of input needed for the command to function."
        //   }
        // };
        
        this.options = {
            d: {
                readable_name: "Direct Message",
                description: "Send the ping via direct message instead of sending it in the chat.",
            },
            c: {
                readable_name: "Custom Message",
                description: "Send a message defined on the fly instead of the default ping response.",
                needs_text: true,
            }
        };
        
        this.config = {
            auth: {
                guilds: ["314130398173069312"],
                channels: ["327535083164663808"],
                pms: false,
                users: ["77517077325287424", "82530619355037696", "83017457488363520"]
            },
        };
        
        this.cooldown = {
            global: 5,
            user: 0,
        };
        
    }
    
    /**
     * Tasks the command will execute.
     * Options are handled by the developer of the command accordingly.
     * @param  {Object} data Data that was obtained from the message, such as input and other things.
     * (Object) data {
   *   (Object) options => Contains all of the options organized in an object by key, similar to above.
   *   (Array)  input   => Contains the input separated into an array. (Shoutouts to old params style)
   *     (String) full    => Contains the full input in a text string.
   *     (Array)  array   => Contains the input separated in an array.
   *     (String) raw     => Contains the input without any modifications made to it. Useful for some commands.
   * }
     */
    tasks(data) {
        
        // Default reply for the ping command.
        let ping_message = `Pong! Maiden at your service. ;)`;
        
        // If the "c" option is used, change the text the maiden says.
        if ("c" in data.input.options) {
            ping_message = data.input.options.c;
        }
        
        // If the "d" option is used, send the message through DMs instead of in the channel.
        if ("d" in data.input.options) {
            data.msg.author.send(ping_message);
            return;
        }
        
        // Send message normally.
        data.msg.reply(ping_message)
            .then((reply) => {
                // Do nothing...
            }).catch(console.error);
        
    }
    
}

module.exports = Ping;