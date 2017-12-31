/**
 * Class [CooldownManager]
 *
 * @todo  - Description
 *
 *
 * === Properties ===
 * - {client}     : The Discord Bot client.
 * - {cooldowns}  : Stores all cooldowns in an object.
 *
 */
class MaidenCooldownManager {
    
    /**
     * Constructor for the CooldownManager class.
     * Takes the client of the bot as an argument.
     */
    constructor(client) {
        
        // Instantiate the class properties.
        this.client = client;
        
        // Instantiate the cooldowns object.
        this.cooldowns = {}; // @TODO - Save cooldowns in a database file.
        
    }
    
    /**
     * Set a cooldown for a given command, scope and duration.
     * @param {String}          type     Type of cooldown.
     * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
     * @param {String/Number}   scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
     * @param {Number}          duration Lifetime of the cooldown.
     */
    set(type, key, scope, duration) {
        
        // Set object for this cooldown type if it doesn't exist.
        if (!(type in this.cooldowns)) {
            this.cooldowns[type] = {};
        }
        
        // Initialize array for this cooldown key if it doesn't exist.
        if (!(key in this.cooldowns[type])) {
            this.cooldowns[type][key] = [];
        }
        
        // Set the cooldown into the array.
        this.cooldowns[type][key].push(scope);
        
        console.log(this.cooldowns);
        
        // Start the countdown for the duration.
        // Note: Not sure why I use a promise here. I think I wanted to be cool. ¯\_(ツ)_/¯
        return new Promise((resolve, reject) => {
            let cm = this; // Set cooldown manager to a variable, or it won't be accessible in the setTimeout.
            setTimeout(() => {
                cm.unset(type, key, scope);
                resolve("Remove cooldown now!"); // Yay! Everything went well!
                reject("Something went wrong!"); // Ugh...
            }, duration);
        });
    }
    
    /**
     * Unset a cooldown for a given command, user and scope.
     * @param {String}          type     Type of cooldown.
     * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
     * @param {String/Number}  scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
     */
    unset(type, key, scope) {
        
        // Remove the cooldown.
        this.cooldowns[type][key].splice(this.cooldowns[type][key].indexOf(scope), 1);
        
    }
    
    /**
     * Check if a cooldown exists with the given parameters.
     * @param {String}          type     Type of cooldown.
     * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
     * @param {String/Number}  scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
     */
    check(type, key, scope) {
        
        // If the type isn't set, then the cooldown surely isn't set.
        // For example, if a command is called,
        // but the 'cooldown' type isn't found, then there are no cooldowns for commands at all.
        if (!(type in this.cooldowns)) {
            return false;
        }
        
        // If the key isn't set, then the cooldown surely isn't set.
        // For example, if for the ping command,
        // the key 'ping' isn't found, then there are no cooldowns for the ping command.
        if (!(key in this.cooldowns[type])) {
            return false;
        }
        
        console.log(this.cooldowns[type][key]);
        
        // Returns whether or not the cooldown exists.
        return (scope in this.cooldowns[type][key]);
        
    }
    
}

// Export Class.
module.exports = MaidenCooldownManager;