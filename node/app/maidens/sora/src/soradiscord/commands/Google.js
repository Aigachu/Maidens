/**
 * Google command.
 *
 * Send a query to google and return the last 5 search results.
 *
 * CURRENTLY UNSTABLE - Google seems to have very strict limits on API calls...So this command doesn't quite work.
 *
 * Still, the code is fine!
 */
class Google extends Command {

  constructor(client) {

    super(client);

    // Uncomment to enter different aliases that can be used to use the command.
    // e.g. the ping command can have pi or pg as aliases.
    this.aliases = [ "goog"];
    
    // Uncomment to customize the text that will be shown when --help is used.
    // this.helpText = "";
    
    // Uncomment to customize the text that will be shown when --desc is used.
    // this.descText = "";
    
    // Uncomment to declare that input is required for this command.
    // Follow the template here to assure functionality of the Synopsis.
    this.input = {
      query: {
        type: "text", // Either text or plain.
        name: "Query",
        description: "Text to send to google for results."
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
    
    // Uncomment to adjust the cooldown of the command.
    // The default cooldown is 5 seconds.
    this.cooldown = 10; // In seconds.

  }

  /**
   * Tasks the command will execute.
   * Options are handled by the developer of the command accordingly.
   * @param  {[type]} data Data that was obtained from the message, such as input and other things.
   * (Object) data {
   *   (Object) options => Contains all of the options organized in an object by key, similar to above.
   *   (Array)  input   => Contains the input seperated into an array. (Shoutouts to old params style)
   *     (String) full    => Contains the full input in a text string.
   *     (Array)  array   => Contains the input seperated in an array.
   *     (String) raw     => Contains the input without any modifications made to it. Useful for some commands.
   * }
   */
  tasks(data) {

    // I actually didn't take the time to understand this code and I copy pasted it from the module's page.
    // @see : https://www.npmjs.com/package/google
    // @TODO - Clean this the fuck up.
    google.resultsPerPage = 3;
    var nextCounter = 0;
    var result_msg = "";
     
    google(data.input.full, function (err, res){
      if (err) console.error(err)
     
      for (var i = 0; i < res.links.length; ++i) {
        var link = res.links[i];
        result_msg = link.title + ' - ' + link.href;
        result_msg += link.descText + "\n";
      }

      if (nextCounter < 2) {
        nextCounter += 1
        if (res.next) res.next()
      }

      data.msg.channel.send(result_msg);

    });

  }

}

module.exports = Google;