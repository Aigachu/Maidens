/**
 * Timeout Command.
 *
 * Command used to timeout a user manually or to clear all timeouts.
 */
class Timeout extends Command {
    
    constructor(client) {
        
        super(client);
        
        // Uncomment to enter different aliases that can be used to use the command.
        // e.g. the ping command can have pi or pg as aliases.
        this.aliases = ["time", "to"];
        
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
        this.options = {
            d: {
                readable_name: "Duration",
                description: "How long the person must be timed out.",
            },
            c: {
                readable_name: "Clear all",
                description: "Clear timeouts of all users in the server.",
            },
        };
        
        // Uncomment to configure the command.
        // You can adjust which channels the command can be used in, as well as who can use the command.
        this.config = {
            auth: {
                guilds: [],
                channels: [],
                pms: false,
                users: [],
                oplevel: 1,
            },
        };
        
        // Uncomment to adjust the cooldown of the command.
        // The default cooldown is 5 seconds.
        // this.cooldown = 5;
        
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
        
        // If the "c" option is used, clear all timeouts.
        if ("c" in data.input.options) {
            data.msg.guild.members.every((member) => {
                this.client.watchdog.clear(member);
                return true;
            });
            
            data.msg.channel.send(`Cleared all timeouts in the server. FREEEDOOOOM!`);
            
            return;
        }
        
        // Set default duration to 30.
        let duration = 30;
        
        // If the "d" option is used, overwrite the duration.
        if ("d" in data.input.options) {
            if (!isNaN(data.input.options.d)) {
                duration = data.input.options.d;
            }
        }
        
        // Trim input from the tag given.
        data.input.full = data.input.full.trim();
        data.input.full = data.input.full.replace('<@', '');
        data.input.full = data.input.full.replace('>', '');
        data.input.full = data.input.full.replace('!', '');
        
        // Get the member from the given tag.
        let member = data.msg.guild.members.find('id', data.input.full);
        
        // If a member could not be obtained, we can't do anything. Return.
        if (member === null) {
            // @TODO - Error message or something.
            data.msg.channel.send(`Errr....Something went wrong. :(`);
            return false;
        }
        
        // Timeout the given user if we have everything we need.
        this.client.watchdog.timeout(member, duration);
        
        // Annnd a fun message!
        data.msg.channel.send(`Uh oohhh! Someone was being bad!\nTake a quick **${duration} second** break, ${member}!`);
        
        // Delete the message of the user that issued the timeout. No traces left...
        data.msg.delete()
            .then((message) => {
                // Do nothing with deleted message.
            }).catch(console.error);
        
    }
    
}

module.exports = Timeout;