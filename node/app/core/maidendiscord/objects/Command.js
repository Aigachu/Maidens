/**
 * Class [Command]
 *
 * This class defines the properties of a [Command] object. Commands
 * are orders that can be given to a bot. The bot interprets these
 * orders and executes tasks in consequence.
 *
 * @see  ../commands/Example.js for a template on how to create a new command!
 *       WARNING: Coding experience required to create complex commands. ;)
 *
 * === Properties ===
 * - {client}     : The Discord Bot client.
 * - {key}                :    The command identifier, as well as the text that triggers it. By default, this will take the name of the class.
 * - {aliases}    : Array of different aliases a command can be called by.
 * - {helpText}        :    Short text to help show how the command is used.
 * - {descText}        :    Short (or long if you want) description to explain the purpose of the command.
 * - {input}      : Object to configure whether or not the command needs raw input.
 *   e.g. @bot ping <raw_input>
 * - {options}    : Object to configure whether or not the command will have options to extend functionality.
 *   e.g. @bot ping [-d] [-c]
 * - {config}     : Object to store configurations for the command.
 *   + {auth}       : Stores authentication restrictions.
 *     -- {guilds}    : Allowed guilds. If empty, allowed in all guilds.
 *     -- {channel}   : Allowed channels. If empty, allowed in all channels.
 *     -- {pms}       : Boolean. If true, allowed in private messages. If false, restricted.
 *     -- {users}     : Allowed users. If empty, allowed by all users.
 *     -- {oplevel}   : Operation level.
 *                       0 - Allowed by everyone.
 *                       1 - Only allowed by "admins" & above. Admins are configured in each maidens' settings.js.
 *                       2 - Only Allowed by "gods". Gods are configured in each maidens' settings.js.
 * - {cooldown}   : Integer to determine the amount of seconds of cooldown the command should have.
 */
class Command {
    
    // Constructor for the Command Class
    constructor(client) {
        
        // Instantiate class properties. These are default values that will be assigned to any child command
        // that doesn't have these values set.
        // Descriptions of each up above!
        this.client = client;
        
        // The command "key" takes the constructor name by default.
        this.key = this.constructor.name.toLowerCase();
        
        // The upcoming properties are customizable per command.
        // These are the default values.
        this.aliases = [];
        this.helpText = "This is the default help text for commands...Which means that Aiga was too lazy to write one for this command. :/ Bug him about it!";
        this.descText = "This is the default description for commands...Which means that Mr. Aiga was being too much of a lazy fart to write one for this command. :/ Bug him about it!";
        
        // Input is optional.
        this.input = {};
        
        // Options are optional.
        this.options = {};
        
        // By default, commands will be allowed everywhere.
        // Be sure to change the values in this object for commands that should be restricted!
        this.config = {
            auth: {
                guilds: [],
                channels: [],
                pms: false,
                users: [],
                oplevel: 0,
            },
        };
        
        // The default cooldown is 5 seconds for all commands.
        this.cooldown = {
            global: 0,
            user: 5,
        };
        
    }
    
    /**
     * Execute method.
     * This method will execute all tasks described in the tasks() method.
     * @param  {Message}  msg        Message that triggered the command.
     * @param  {Object}    input   Input object extracted from the parsed command.
     */
    execute(msg, input) {
        
        // Using the cooldown manager, we check if the command is on cooldown first.
        // Cooldowns are individual per user. So if a user uses a command, it's not on cooldown for everyone.
        if (this.client.cooldownManager.check('command', this.key, 0)) {
            this.client.im(msg.author, `That command is on global cooldown. :) Please wait!`);
            return false;
        }
        
        if (this.client.cooldownManager.check('command', this.key, msg.author.id)) {
            this.client.im(msg.author, `That command is on cooldown. :) Please wait!`);
            return false;
        }
        
        // Run the tasks for the command.
        // This passes the necessary data for a command to run.
        // msg    : The Discord {Message} object. Contains a lot of useful information.
        // input  : The parsed input from the command manager.
        let data = {
            msg: msg,
            input: input
        };
        
        this.tasks(data);
        
        // Cools the command globally after usage.
        if (this.cooldown.global !== 0) this.client.cooldownManager.set('command', this.key, 0, this.cooldown.global * 1000);
        
        // Cools the command after usage for the user.
        if (this.cooldown.user !== 0) this.client.cooldownManager.set('command', this.key, msg.author.id, this.cooldown.user * 1000);
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
        // General tasks for all commands?
        // Right now, the tasks() method only does things in child Command instances.
    }
    
    /**
     * Help method.
     * Replies to a message requesting help for the given command.
     * @param  {Message} msg The message that requested the help text.
     */
    help(msg) {
        // Reply to the message with the Command's help text.
        this.client.reply(msg, this.helpText);
    }
    
    /**
     * Description method.
     * Replies to a message requesting a description for the given command.
     * @param  {Message} msg The message that requested the description text.
     */
    desc(msg) {
        // Reply to the message with the Command's description text.
        this.client.reply(msg, this.descText);
    }
    
    /**
     * Generates a synopsis for a given command.
     * @TODO
     * @return {String}     [description]
     */
    synopsis() {
        return `This is the synopsis for the **${this.key}** command.`;
    }
    
}

// Export the class.
module.exports = Command;