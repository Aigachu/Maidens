class SmashHandicap extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "handicap", "shandicap", "hcap"];
    
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
    // The default cooldown is 5 seconds.
    // this.cooldown = 5;

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   options => Contains all of the options organized in an object by key, similar to above.
   *   array => Contains the input seperated into an array. (Shoutouts to old params style)
   *   full => Contains the full input in a text string.
   * }
   */
  tasks(data) {

    var handicaps = [];

    handicaps.push({
      title: "Air Mac",
      details: "You may not use aerials during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "FG Link",
      details: "You may only use Special Moves (B) moves to attack during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "A for Effort",
      details: "You may only use Normal Attacks (A) moves to attack during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Smashing Effort",
      details: "You may only attack using smash attacks!",
      timeout: 3
    });
    handicaps.push({
      title: "Take Flight",
      details: "You may only attack using aerials!",
      timeout: 3
    });
    handicaps.push({
      title: "We Tech Those",
      details: "You may not tech during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Dunkin Donuts",
      details: "You may only finish off stocks with Dunks!",
      timeout: 3
    });
    handicaps.push({
      title: "SOLOYOLO",
      details: "You may only kill by taking someone to the shadow realm with you!",
      timeout: 3
    });
    handicaps.push({
      title: "Best Defense is Offense",
      details: "You may not shield during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Counterattack",
      details: "You may only kill someone by using a counter move!",
      timeout: 3
    });
    handicaps.push({
      title: "Manhandled",
      details: "You may only grab during this match to attack!",
      timeout: 3
    });
    handicaps.push({
      title: "One and Done",
      details: "You may not recover once knocked off stage!",
      timeout: 3
    });
    handicaps.push({
      title: "Pitch a Tent",
      details: "You may only win by timing your opponent out!",
      timeout: 3
    });
    handicaps.push({
      title: "Trigger Happy",
      details: "You may not use your shoulder buttons (shield buttons) during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Slow and Steady",
      details: "You may only walk in order to move during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Get your Footing",
      details: "You may only end your opponent's stocks with footstools!",
      timeout: 3
    });
    handicaps.push({
      title: "The Bakery",
      details: "You may not roll during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Iron Boots",
      details: "You may not jump during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Comeback King",
      details: "You must forfeit your first stock at the beginning of the match!",
      timeout: 3
    });
    handicaps.push({
      title: "Too Edgy",
      details: "You may not edgeguard the opponent during the match!",
      timeout: 3
    });
    handicaps.push({
      title: "On Tilt",
      details: "You must kill the opponent utilizing a tilt attack!",
      timeout: 3
    });


    var rand = handicaps[Math.floor(Math.random() * handicaps.length)];

    var message = "**" + rand.title + "**";

    message += "\n" + rand.details;

    message += "\n\nGood luck! :P"

    data.msg.reply("your handicap will be...")
      .then(() => {
        this.client.startTyping(data.msg.channel, rand.timeout * 1000)
          .then(() => {
            data.msg.channel.send(message);
          });
      });

  }

}

module.exports = SmashHandicap;