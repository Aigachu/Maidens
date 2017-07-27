/**
 * Class [Command]
 *
 * This class defines the properties of a [Command] object. Commands
 * are orders that can be given to a bot. The bot interprets these
 * orders and executes tasks in consequence.
 *
 * @see  /commands/Example.js for a template on how to create a new command!
 *       WARNING: Coding experience required to create complex commands. ;)
 *
 * === Properties ===
 * - {key}				:	The command identifier, as well as the text that triggers it. By default, this will take the name of the class.
 * - {client}			:	The Discord Bot client.
 * - {aliases}    : Array of different aliases a command can be called by.
 * - {helpText}		:	Short text to help show how the command is used.
 * - {descText}		:	Short (or long if you want) description to explain the purpose of the command.
 * - {input}      : Object to configure whether or not the command needs raw input.
 *   e.g. $sora ping <raw_input>
 * - {options}    : Object to configure whether or not the command will have options to extend functionality.
 *   e.g. $sora ping [-d] [-c]
 */
class Command {

	// Constructor for the Command Class
	constructor(client) {

		// Instantiate class properties. These are default values that will be assigned to any child command
    // that doesn't have these values set.
		// Descriptions of each up above!
    
    this.client     = client; 
		this.key 				= this.constructor.name.toLowerCase();

    // The upcoming properties are customizable per command.
    // These are the default values.
    this.aliases    = [];
		this.helpText 	= "This is the default help text for commands...Which means that Aiga was too lazy to write one for this command. :/ Bug him about it!";
		this.descText   = "This is the default description for commands...Which means that Mr. Aiga was being too much of a lazy fart to write one for this command. :/ Bug him about it!";
    
    this.input      = {};
    
    this.options    = {};

    this.config     = {
      auth: {
        guilds: [],
        channels: [],
        pms: false,
        users: []
      }, 
    };

  }

  /**
   * Execute method.
   * This method will execute all tasks described in the tasks() method.
   * @param  {[string]} msg    	Message that triggered the command.
   * @param  {[array]} 	params 	Parameters array extracted from the message.
   */
  execute(msg, input) {
  	this.tasks({
  		msg: msg,
  		input: input
  	});
  }

  /**
   * Tasks method.
   * Code to run for the given command when executed.
   */
  tasks(data) {
  	// General tasks for all commands?
  	// Right now, the tasks() method only does things in child Command instances.
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
   * @param  {[string]}       type Type of error. This determines which text is said by Sora.
   * @param  {[type]}         msg  The message containing the command that triggered the error.
   */
  error(data, type, msg) {

    var error_msg = "";

    switch (type) {
      
      case 'InputGivenWhenSimpleCommand':
          error_msg = `_**Woops!**_ - Seems like some input was given for the \`${this.key}\` command, but this command doesn't accept input.\n`;
          break;
      
      case 'OptionsGivenWhenOptionlessCommand':
          error_msg = `_**Woops!**_ - Seems like some options were given for the \`${this.key}\` command, but this command doesn't accept options.\n`;
          break;
      
      case 'InvalidOption':
          error_msg = `_**Woops!**_ - Seems like there was one or more invalid option(s) for the \`${this.key}\` command.\n`;
          break;
      
      case 'OptionGivenWithoutInput':
          error_msg = `_**Woops!**_ - Seems like an option was given, but without input to specify, for the \`${this.key}\` command.\n`;
          break;
      
      case 'InputRequiredButNotEntered':
          error_msg = `_**Woops!**_ - Seems like some raw input was forgotten for the \`${this.key}\` command.\n`;
          break;
      
      default:
          // Do nothing
          break;
    }

    this.client.im(msg.author, error_msg);

    this.client.im(msg.author,`Please use the \`--help\` option of the command through the following method.\n\n\`${this.client.cprefix} ${this.key} --help\`\n\nThis will give you more information on how to use the command!`);
  }

  // @TODO - Synopsis generator.

}

// Export the class.
module.exports = Command;