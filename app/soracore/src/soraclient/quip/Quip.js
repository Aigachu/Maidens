// @todo - multiple word query per single string
// @todo - multiple responses possible for same given query
class Quip {

	// Constructor for the Quip Class
	constructor(client) {

    this.client = client;

    this.triggers = [];

    this.responses = [];

    this.frq = 5; // In %

  }

  /**
   * Execute method.
   * This method will execute all tasks described in the tasks() method.
   * @param  {[string]} msg    	Message that triggered the Quip.
   * @param  {[array]} 	params 	Parameters array extracted from the message.
   */
  execute(msg) {

    var rng = Math.random();

    console.log(rng);

    if(rng <= (this.frq / 100)) {
      msg.reply(this.responses[Math.floor(Math.random() * this.responses.length)]);
    }

  }

}

// Export the class.
module.exports = Quip;