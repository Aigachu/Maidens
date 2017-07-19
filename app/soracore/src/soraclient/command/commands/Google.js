const Command = require('../Command');

class Google extends Command {

	constructor(client) {

		super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
		this.aliases = [ "goog"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.help = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.description = "";
    
    // Uncomment to declare that input is required for this command.
    // Follow the template here to assure functionality of the Synopsis.
    this.input = {
      "query": {
        "type": "text", // Either text or plain.
        "name": "Query",
        "description": "Text to send to google for results."
      }
    };

    // Uncomment to permit different options in the command
    // Follow the template here to assure functionality of the Synopsis.
    // this.options = {
    //   "d": {
    //     "readable_name" : "Direct Message",
    //     "description"   : "Send the ping via direct message instead of sending it in the chat.",
    //   },
    //   "c": {
    //     "readable_name" : "Custom Message",
    //     "description"   : "Send a message defined on the fly instead of the default ping response.",
    //     "needs_text"   : true,
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

    google.resultsPerPage = 5;
    var nextCounter = 0;
    var result_msg = "";
     
    google(data.input.full, function (err, res){
      if (err) console.error(err)
     
      for (var i = 0; i < res.links.length; ++i) {
        var link = res.links[i];
        result_msg = link.title + ' - ' + link.href;
        result_msg += link.description + "\n";
      }

      if (nextCounter < 4) {
        nextCounter += 1
        if (res.next) res.next()
      }

      data.msg.channel.send(result_msg);

    });

  }

}

module.exports = Google;