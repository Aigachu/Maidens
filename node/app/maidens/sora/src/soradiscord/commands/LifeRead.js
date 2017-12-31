/**
 * LifeRead command.
 *
 * Emulates the famous 'Life Reading: n' from Ever17.
 *
 * This checks how many people are alive and online in the server. Returns it right after.
 *
 * Very simple stuff.
 */
class LifeRead extends Command {
    
    constructor(client) {
        
        super(client);
        
        // Uncomment to enter different aliases that can be used to use the command.
        // e.g. the ping command can have pi or pg as aliases.
        this.aliases = ["lr"];
        
        // Uncomment to customize the text that will be shown when --help is used.
        // this.helpText = "";
        
        // Uncomment to customize the text that will be shown when --desc is used.
        // this.descText = "";
        
        // Uncomment to declare that input is required for this command.
        // Follow the template here to assure functionality of the Synopsis.
        // this.input = {
        //   input_name: {
        //     type: "plain", // Either text or plain.
        //     name: "An example of plain input.",
        //     description: "Example of plain input needed for the command to function."
        //   }
        // };
        
        // Uncomment to permit different options in the command
        // Follow the template here to assure functionality of the Synopsis.
        // this.options = {
        //   d: {
        //     "readable_name" : "Direct Message",
        //     "description"   : "Send the ping via direct message instead of sending it in the chat.",
        //   },
        //   c: {
        //     readable_name : "Custom Message",
        //     description   : "Send a message defined on the fly instead of the default ping response.",
        //     needs_text   : true,
        //   }
        // };
        
        // Uncomment to configure the command.
        // You can adjust which channels the command can be used in, as well as who can use the command.
        // this.config = {
        //   auth: {
        //     guilds: [],
        //     channels: [],
        //     pms: false,
        //     users: [],
        //   },
        // };
        
        // Uncomment to adjust the cooldown of the command.
        // The default cooldown for users is 5 seconds.
        // By default, commands do not have a global cooldown.
        // this.cooldown = {
        // 	global: 0,
        // 	user: 5,
        // };
        
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
        
        // Variable to store the life readings.
        let lifereadings = 0;
        
        // Variable to store offline users.
        // Not sure if it's used right now.
        let offline = 0;
        
        // Loop through all members in the guild where the command was called.
        data.msg.guild.members.every((member) => {
            
            // If the member is a bot, we don't want to count them.
            if (member.user.bot === true) {
                // do nothing and return.
                return true;
            }
            
            // If the member is not offline, we'll count them.
            if (member.user.presence.status !== 'offline') {
                lifereadings++;
                
                // If they ARE offline, add them to the offline array.
            } else {
                offline++;
            }
            
            return true;
            
        });
        
        // Send the results to the channel.
        data.msg.reply(`_Scanning server life readings..._`)
            .then(() => {
                this.client.startTyping(data.msg.channel, 3000)
                    .then(() => {
                        data.msg.channel.send(`Life reading: **${lifereadings}**`);
                        if (offline !== 0) {
                            let s = offline !== 1 ? 's' : '';
                            data.msg.channel.send(`However...There seem to be **${offline}**...paranormal presence${s} lurking about...`);
                        }
                    });
            });
    }
    
}

module.exports = LifeRead;