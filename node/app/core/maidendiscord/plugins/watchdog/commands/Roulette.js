/**
 * Roulette command.
 *
 * Emulates a game of Russian Roulette, but with a nice twist!
 *
 * Users that die are timed out.
 *
 * @TODO - Major refactoring and documentation needed for this one...Oh god. LOL.
 */
class Roulette extends Command {
    
    constructor(client) {
        
        super(client);
        
        // Uncomment to enter different aliases that can be used to use the command.
        // e.g. the ping command can have pi or pg as aliases.
        this.aliases = ["rl"];
        
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
        //     readable_name : "Direct Message",
        //     description   : "Send the ping via direct message instead of sending it in the chat.",
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
        //     oplevel: 0,
        //   },
        // };
        
        // Uncomment to adjust the cooldown of the command.
        // The default cooldown is 5 seconds.
        // this.cooldown = 5;
        
    }
    
    /**
     * Tasks the command will execute.
     * Options are handled by the developer of the command accordingly.
     * @param  {Object} data Data that was obtained from the message, such as input and other things.
     * (Object) data {
   *   options => Contains all of the options organized in an object by key, similar to above.
   *   array => Contains the input separated into an array. (Shoutouts to old params style)
   *   full => Contains the full input in a text string.
   * }
     */
    tasks(data) {
        
        data.msg.channel.send(`_grabs a random gun..._\nReady?`);
        this.client.startTyping(data.msg.channel, 1000)
            .then(() => {
                
                data.msg.channel.send(`_spins the cylinder..._`);
                
                let survival = false;
                
                let rng = Math.random();
                
                this.client.startTyping(data.msg.channel, 2000)
                    .then(() => {
                        // Determine survival
                        // 5 blanks, 1 bullet.
                        if (Math.random() < 0.83333333333333) {
                            survival = true;
                        }
                        
                        // Scenario 1 - Point and Click
                        if (rng <= 0.5) { // 60% Chance of this happening
                            
                            data.msg.channel.send(`_points the gun at ${data.msg.member}'s head..._\n`);
                            this.client.startTyping(data.msg.channel, 2000)
                                .then(() => {
                                    data.msg.channel.send(`_pulls the trigger!_`);
                                    this.client.startTyping(data.msg.channel, 1000)
                                        .then(() => {
                                            if (survival) {
                                                data.msg.channel.send(`_click_...Yay! You **SURVIVED** ${data.msg.member}! :D`);
                                            } else {
                                                this.client.watchdog.timeout(data.msg.member, 5);
                                                data.msg.channel.send(`_BANG!_\n\n_Oh no. How unfortunate, you **DIED** ${data.msg.member}. You will be remembered. ;~;`);
                                            }
                                        });
                                });
                            
                            return;
                            
                        }
                        // Scenario 2 - Quickfire
                        if (rng <= 0.7) { // 30% Chance of this happening!
                            
                            data.msg.channel.send('_pulls the trigger without a second thought..._\n');
                            this.client.startTyping(data.msg.channel, 1000)
                                .then(() => {
                                    if (survival) {
                                        data.msg.channel.send(`POW!...Just kidding! You **SURVIVED** ${data.msg.member}! :D`);
                                    } else {
                                        this.client.watchdog.timeout(data.msg.member, 5);
                                        data.msg.channel.send(`_BANG!_\n\nThat was actually the gun. You're **DEAD**, ${data.msg.member}. Rest in pepperoni~`);
                                    }
                                });
                            
                            return;
                            
                        }
                        
                        // Scenario 3 - The living gun
                        if (rng <= 0.9) { // 10% Chance of this happening!
                            
                            data.msg.channel.send('_trips and falls on the ground._');
                            
                            this.client.startTyping(data.msg.channel, 1000)
                                .then(() => {
                                    data.msg.channel.send(`_The gun magically comes to life and it pulls its own trigger, aiming directly at ${data.msg.member}!_`);
                                    this.client.startTyping(data.msg.channel, 2000)
                                        .then(() => {
                                            if (survival) {
                                                data.msg.channel.send(`Phew! You swiftly dodged the bullet and **SURVIVED** ${data.msg.member}!\n\n_The gun glares at you and disappears._`);
                                            } else {
                                                this.client.watchdog.timeout(data.msg.member, 5);
                                                data.msg.channel.send(`Ow...O-oh no! **YOU GOT DUNKED ON** ${data.msg.member} !!!\n\n_The gun laughs and disappears into the darkness._`);
                                            }
                                        });
                                });
                            
                            return;
                            
                        }
                        // Scenario 4 - Judgement
                        if (rng > 0.9) { // 10% Chance of this happening!
                            
                            if (Math.random() < 0.83333333333) {
                                survival = false;
                            }
                            
                            data.msg.channel.send('_puts down the gun and casts **Judgement**_');
                            this.client.startTyping(data.msg.channel, 1000)
                                .then(() => {
                                    data.msg.channel.send('_rays of light descend all over the server!_');
                                    // bot.sendFile(msg.channel, 'resources/images/holy_judgement.png', 'holy_judgement.png');
                                    this.client.startTyping(data.msg.channel, 2000)
                                        .then(() => {
                                            if (survival) {
                                                data.msg.channel.send(`Oh wow..., how did you dodge that?! You **SURVIVED** ${data.msg.member} ! Meh...I never land that move anyways :blush: `);
                                            } else {
                                                data.msg.channel.send(`O-oops...I messed up...**YOUR BODY HAS BEEN OBLITERATED** ${data.msg.member} ! Rest in pieces :cry:`);
                                            }
                                        });
                                });
                            
                        }
                        
                    });
            });
        
    }
    
}

module.exports = Roulette;