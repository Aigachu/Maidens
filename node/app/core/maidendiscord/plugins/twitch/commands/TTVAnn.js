/**
 * TTVAnn command.
 *
 * Simply used to toggle the Watchdog functionality on or off, or to check the status of it.
 *
 * Returns confirmation messages.
 */
class TTVAnn extends Command {
    
    /**
     * Command Constructor.
     * @param {MaidenDiscordClient} client Discord Client for the maiden.
     */
    constructor(client) {
        
        super(client);
        
        // Uncomment to enter different aliases that can be used to use the command.
        // e.g. the ping command can have pi or pg as aliases.
        this.aliases = ["ttva", "autoann"];
        
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
            e: {
                readable_name: "Enable",
                description: "Enable Twitch Announcements in the current guild.",
            },
            d: {
                readable_name: "Disable",
                description: "Disable the Twitch Announcements in the current guild.",
            },
            s: {
                readable_name: "Status",
                description: "Check the status of the Twitch Announcements in the current server.",
            },
            r: {
                readable_name: "Remove",
                description: "Remove a stream from the announcement list.",
            },
            a: {
                readable_name: "Add",
                description: "Add a stream from the announcement list.",
            },
            l: {
                readable_name: "List",
                description: "List announcement streams in the current server.",
            },
            c: {
                readable_name: "Channel",
                description: "Set the announcement channel for this server.",
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
                oplevel: 2,
            },
        };
        
        // Uncomment to adjust the cooldown of the command.
        // The default cooldown is 5 seconds.
        this.cooldown = 0;
        
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
    
        data.input.full = data.input.full.trim();
        
        // If the "e" option is used, Enable twitch announcements in this guild.
        if ("e" in data.input.options) {
            this.client.twitch.enable('ttvann', data.msg.guild);
            data.msg.channel.send('Enabled Twitch Announcements in this server!');
            return;
        }
        
        // If the "d" option is used, Disable the watchdog in this guild.
        if ("d" in data.input.options) {
            this.client.twitch.disable('ttvann', data.msg.guild);
            data.msg.channel.send('Disabled Twitch Announcements in this server!');
            return;
        }
        
        // If the "s" option is used, check the status of the watchdog in this guild.
        if ("s" in data.input.options) {
            let status = this.client.twitch.status('ttvann', data.msg.guild) ? `Enabled` : `Disabled`;
            data.msg.channel.send(`Twitch Announcements status: **${status}**.`);
            return;
        }
    
        // If the "c" option is used, set the announcement channel for this server.
        if ("c" in data.input.options) {
            let channel_tag = data.input.full;
            data.input.full = data.input.full.replace('<#', '');
            data.input.full = data.input.full.replace('>', '');
            data.input.full = data.input.full.replace('!', '');
            
            if (data.input.full === "@here")
                data.input.full = data.msg.channel.id;
            
            this.client.twitch.ttvannSetAnnChannel(data.msg.guild.id, data.input.full);
            data.msg.channel.send(`Set the announcement channel to **${channel_tag}** for this server!`);
            return;
        }
    
        // If the "r" option is used, remove a stream to the list of announcements in the server.
        if ("r" in data.input.options) {
            this.client.twitch.ttvannRemoveStream(data.msg.guild.id, data.input.full);
            data.msg.channel.send(`Removed **${data.input.full}** from the list of Twitch Announcements in this server!`);
            return;
        }
    
        // If the "a" option is used, add a stream to the list of announcements in the server.
        if ("a" in data.input.options) {
            this.client.twitch.ttvannAddStream(data.msg.guild.id, data.input.full);
            data.msg.channel.send(`Added **${data.input.full}** to the list of Twitch Announcements in this server!`);
            return;
        }
        
        if (_.isEmpty(data.input.full)) {
            // Toggle the watchdog status.
            let toggle = this.client.twitch.status('ttvann', data.msg.guild) ? this.client.twitch.disable('ttvann', data.msg.guild) : this.client.twitch.enable('ttvann', data.msg.guild);
    
            // Get the new status.
            let status = toggle ? `Enabled` : `Disabled`;
    
            data.msg.channel.send(`Twitch Announcements is now **${status}**.`);
            
            return;
        }
    
        this.client.twitch.ttvannAddStream(data.msg.guild.id, data.input.full);
    }
    
}

module.exports = TTVAnn;