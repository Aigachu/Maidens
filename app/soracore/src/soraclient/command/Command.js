/**
 * Class [Command]
 *
 * This class defines the properties of a [Command] object. Commands
 * are orders that can be given to a bot. The bot interprets these
 * orders and executes tasks in consequence.
 *
 * === Properties ===
 * - {key}				:	The command identifier, as well as the text that triggers it. By default, this will take the name of the class.
 *   - @todo : Command Aliases
 * - {client}			:	The Discord Bot client.
 * - {helpText}		:	Short text to help show how the command is used.
 * - {descText}		:	Short (or long if you want) description to explain the purpose of the command.
 * - {signature}	:	Defines how the command should be inputted to function properly.
 *   - This functionality is designed to take in identifiers of each component a command must have that comes after the command key.
 *   - *    -> Wildcard. The command ignores parameters, and will function regarless of what comes after the command key.
 *   - p    -> Regular parameter. Collection of characters/numbers without spaces.
 *   - "t"  -> String (a collection of text in brackets with spaces)
 *   - @    -> A user mention.
 *   - --o  -> An option definition.
 */
class Command {

	// Constructor for the Command Class
	constructor(client) {

		// Instantiate class properties. These are default values that will be assigned to any child command
    // that doesn't have these values set.
		// Descriptions of each up above!
		this.key 				= this.constructor.name.toLowerCase();
		this.client 		= client;
		this.helpText 	= "This is the default help text for commands...Which means that Aiga was too lazy to write one for this command. :/ Bug him about it!";
		this.descText   = "This is the default description for commands...Which means that Mr. Aiga was being too much of a lazy fart to write one for this command. :/ Bug him about it!";
		this.signature  = '*';

    console.log(this.signature);

  }

  /**
   * Execute method.
   * This method will execute all tasks described in the tasks() method.
   * @param  {[string]} msg    	Message that triggered the command.
   * @param  {[array]} 	params 	Parameters array extracted from the message.
   */
  execute(msg, params) {
  	this.tasks({
  		msg: msg,
  		params: params
  	});
  }

  /**
   * Tasks method.
   * Code to run for the given command when executed.
   */
  tasks() {
  	// General tasks for all commands?
  	// Right now, the tasks() method only exists in child Command instances.
  }

  /**
   * Help method.
   * Replies to a message requesting help for the given command.
   * @param  {[Message]} msg The message that requested the help text.
   */
  help(msg) {
  	// Reply to the message with the Command's help text.
    this.client.reply(msg, this.helpText);
  }

  /**
   * Description method.
   * Replies to a message requesting a description for the given command.
   * @param  {[Message]} msg The message that requested the description text.
   */
  desc(msg) {
  	// Reply to the message with the Command's description text.
    this.client.reply(msg, this.descText);
  }

  /**
   * Error method.
   * Error handler for multiple errors that can occur when trying to execute a command.
   * @param  {[string/array]} data Pertinent data for the error.
   * @param  {[string]} 			type Type of error. This determines which text is said by Sora.
   * @param  {[type]} 				msg  The message containing the command that triggered the error.
   */
  error(data, type, msg) {
		switch (type) {
	    case 'ParamsException':
	        this.client.reply(msg, `
	        	_**Woops!**_ - The number of parameters given for the \`${this.key}\` command is wrong.\n
	        	You provided ${data} parameter(s) when you should have provided ${this.reqParams}!`
	        );
	        break;
	    default:
	        // Do nothing
	        break;
		}

		this.client.reply(msg,
			`Please use the \`--help\` option of the command through the following method.\n
			\`${this.client.cprefix} ${this.key} --help\`\n
			This will give you more information on how to use the command!`
		);
  }

  /**
   * Signature setter.
   * When the Class is created, we want to initiate the Command signature.
   * @param  {[string]} pattern A custom pattern that will be used to create the array.
   * @return {[type]}         [description]
   */
  set signature(pattern) {

    if(pattern == '*') {
      return [];
    }

    var test = "--o.Option1 p.Param1 t.Text1";

    var components = test.split(" ");

    console.log(components);

    return components;
  }

}

// Export the class.
module.exports = Command;