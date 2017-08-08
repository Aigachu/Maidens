const Command = require('../Command');

class SetName extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
    this.aliases = [ "sa"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.helpText = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.descText = "";
    
    // Uncomment to declare that input is required for this command.
    // Follow the template here to assure functionality of the Synopsis.
    this.input = {
      avatar: {
        "type": "text", // Either text or plain.
        "name": "Avatar Integer",
        "description": "New Avatar that Sora will use."
      }
    };

    // Uncomment to permit different options in the command
    // Follow the template here to assure functionality of the Synopsis.
    // this.options = {
    //   "d": {
    //     "readable_name" : "Default",
    //     "description"   : "Set Sora's name to the default name: \"Sora Akanegasaki\"",
    //   }
    // };

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

    var avatar_i = data.input.full;

    // Set username
    this.client.user.setAvatar(coreroot + 'assets/avatars/' + avatar_i + '.jpg')
     .then(() => console.log(`New avatar set.`))
     .catch(console.error);

  }

}

module.exports = SetName;