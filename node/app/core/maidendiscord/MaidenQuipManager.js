/**
 * Class [QuipManager]
 *
 * @todo  - description
 * @todo  - documentation
 * 
 */
class MaidenQuipManager {

	/**
   * Constructor for the QuipManager class.
   * Takes the client of the bot as an argument.
   */
  constructor(client) {

    // Instantiate the class properties.
    this.client = client;
    this.quips = this.__getQuips(this.client);
    this.triggers = this.__getTriggers(this.quips);

  }

  /**
   * Quip function.
   * Interprets a message a sends a quip in response if needed.
   * @param  {[Message]} message Discord.js Message object.
   */
  quip(message) {

    // If this message comes from the bot, don't quip!
    if (message.author.id === this.client.user.id) {
      return false;
    }

  	Object.keys(this.triggers).some((key) => { 
  		if ( message.content.toLowerCase().indexOf(this.triggers[key].toLowerCase()) >= 0 ) {
  			this.quips[key].execute(message);
  		} 
  	});

    return;
  }

  /**
   * [__getQuips description]
   * @param  {[type]} client [description]
   * @return {[type]}        [description]
   */
  __getQuips(client) {

    var quips = {};

    glob.sync( client.namespace + 'quips**/*.js' ).forEach( function( file ) {

      // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
      var filename = file.replace(/^.*[\\\/]/, '');

      // Get the key of the command by interpreting the filename.
      var quip_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

      // Require the Command's Class.
      var QuipClass = require( client.namespace + 'quips/' + filename);

      // Instantiate the [Command] and store it in the {quips} array.
      quips[quip_key] = new QuipClass(client);

    });

    return quips;

  }

  /**
   * [__getTriggers description]
   * @param  {[type]} quips [description]
   * @return {[type]}       [description]
   */
  __getTriggers(quips) {
  	var triggers = {};
  	Object.keys(quips).forEach((key) => {
  		quips[key].triggers.forEach((trigger) => {
  			triggers[key] = trigger;
  		});
  	});
  	return triggers;
  }
}

module.exports = MaidenQuipManager;