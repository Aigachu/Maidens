/**
 * Rolldice command.
 *
 * Used to emulate dice rolling.
 *
 * By default, it rolls one dice. It can, through options, roll multiple dice.
 * You can customize how many faces the dice should have as well.
 */
class RollDice extends Command {
    
    constructor(client) {
        
        super(client);
        
        // Uncomment to enter different aliases that can be used to use the command.
        // e.g. the ping command can have pi or pg as aliases.
        this.aliases = ["rd", "roll"];
        
        // Uncomment to customize the text that will be shown when --help is used.
        // this.helpText = "";
        
        // Uncomment to customize the text that will be shown when --desc is used.
        // this.descText = "";
        
        // Uncomment to declare that input is required for this command.
        // Follow the template here to assure functionality of the Synopsis.
        // this.input = {
        //   "input_name": {
        //     "type": "plain", // Either text or plain.
        //     "name": "An example of plain input.",
        //     "description": "Example of plain input needed for the command to function."
        //   }
        // };
        
        // Uncomment to permit different options in the command
        // Follow the template here to assure functionality of the Synopsis.
        this.options = {
            "n": {
                "readable_name": "Number of dice",
                "description": "Customize the number of dice that will be thrown. If no number is specified, it will roll 2 dice instead of one.",
            },
            "d": {
                "readable_name": "Number of faces",
                "description": "Customize the number of faces the dice you will throw will have.",
                "needs_text": true,
            }
        };
        
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
        
        // By default, Sora will roll 6-faced dice.
        let dice_faces = 6;
        
        // By default, Sora will only roll 1 die.
        let dice_count = 1;
        
        // Keeps a total.
        let total = 0;
        
        // Array to hold all of the rolls.
        let result = "";
        
        // If the "n" option is used, change the text Sora says.
        if ("n" in data.input.options) {
            
            // @todo - Throw an error if the data is not a number.
            // @todo - Throw an error (OR TRUNCATE) if the number is too much. The maidens only have 20 dice.
            dice_count = (data.input.options.n === "n") ? 1 : data.input.options.n;
        }
        
        // If the "c" option is used, change the text Sora says.
        if ("d" in data.input.options) {
            
            // @todo - Throw an error if the data is not a number.
            // @todo - Throw an error (OR TRUNCATE) if the number is too much. Max dice faces should be 20.
            dice_faces = (data.input.options.d === "d") ? 6 : data.input.options.d;
        }
        
        // Roll the dice
        for (let i = 0; i < dice_count; i++) {
            let roll = (Math.floor(Math.random() * dice_faces) + 1);
            result += roll + ", ";
            total += roll;
        }
        
        // Cut off the remaining ", " from the string.
        result = result.substr(0, result.length - 2);
        
        // Store result message.
        let result_msg = " the result of your roll is: **" + result + "**!";
        
        // If more than 1 dice is rolled, we should add this to the result message to show the total number.
        if (dice_count > 1) {
            result_msg += "\nThis gives you a total of: **" + total + "**!";
        }
        
        // Roll types are randomized and have different delays.
        let roll_types = [];
        
        // Set role types.
        roll_types.push({
            message: "_rolls the dice normally_",
            timeout: 1000
        });
        roll_types.push({
            message: "_rolls the dice violently_\n_the die falls on the ground_",
            timeout: 2000
        });
        roll_types.push({
            message: "_accidentally drops the dice on the ground while getting ready_\nOops! Still counts right...?",
            timeout: 2000
        });
        roll_types.push({
            message: "_spins the dice_\nWait for it...",
            timeout: 5000
        });
        
        // Choose a roll type with a random key.
        let rand = roll_types[Math.floor(Math.random() * roll_types.length)];
        
        // Send everything we just computed to the channel.
        data.msg.channel.send(rand.message)
            .then(() => {
                this.client.startTyping(data.msg.channel, rand.timeout)
                    .then(() => {
                        data.msg.reply(result_msg)
                            .then((reply) => {
                                // Do nothing...
                            }).catch(console.error);
                    });
            });
    }
    
}

module.exports = RollDice;