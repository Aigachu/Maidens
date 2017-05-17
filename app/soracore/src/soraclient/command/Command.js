/**
 * Class [Command]
 *
 * This class defines the properties of a [Command] object. Commands
 * are orders that can be given to a bot. The bot interprets these
 * orders and executes tasks in consequence.
 *
 * === Properties ===
 * - {key}				:	The command identifier, as well as the text that triggers it.
 * - {client}			:	The Discord Bot client.
 * - {helpText}		:	Short text to help show how the command is used.
 * - {descText}		:	Short (or long if you want) description to explain the purpose of the command.
 * - {reqParams}	:	Required number of parameters for the command to work.
 */
class Command {

	// Constructor for the Command Class
	constructor(client) {

		// Instantiate class properties. These are default values.
		// Descriptions of each up above!
		this.key 				= this.constructor.name.toLowerCase();
		this.client 		= client;
		this.helpText 	= "This is the default help text for commands...Which means that Aiga was too lazy to write one for this command. :/ Bug him about it!";
		this.descText 	= "This is the default description for commands...Which means that Aiga was too lazy to write one for this command. :/ Bug him about it!";
		this.reqParams 	= 0;

  }

  /**
   * Execute function.
   * This function will execute all tasks described in the tasks() function.
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
   * Tasks function.
   * Code to run for the given command when executed.
   */
  tasks() {
  	// General tasks for all commands?
  	// Right now, the tasks() function only exists in child Command instances.
  }

  /**
   * Help function.
   * Replies to a message requesting help for the given command.
   * @param  {[Message]} msg The message that requested the help text.
   */
  help(msg) {
  	// Reply to the message with the Command's help text.
    this.client.reply(this.helpText, msg);
  }

  /**
   * Description function.
   * Replies to a message requesting a description for the given command.
   * @param  {[Message]} msg The message that requested the description text.
   */
  desc(msg) {
  	// Reply to the message with the Command's description text.
    this.client.reply(this.descText, msg);
  }

  /**
   * Error function.
   * Error handler for multiple errors that can occur when trying to execute a command.
   * @param  {[string/array]} data Pertinent data for the error.
   * @param  {[string]} 			type Type of error. This determines which text is said by Sora.
   * @param  {[type]} 				msg  The message containing the command that triggered the error.
   */
  error(data, type, msg) {
		switch (type) {
	    case 'ParamsException':
	        this.client.reply(`
	        	_**Woops!**_ - The number of parameters given for the \`${this.key}\` command is wrong.\n
	        	You provided ${data} parameter(s) when you should have provided ${this.reqParams}!`,
	        msg);
	        break;
	    default:
	        // Do nothing
	        break;
		}

		this.client.reply(
			`Please use the \`--help\` option of the command through the following method.\n
			\`${this.client.cprefix} ${this.key} --help\`\n
			This will give you more information on how to use the command!`,
		msg);
  }

}

// Export the class.
module.exports = Command;