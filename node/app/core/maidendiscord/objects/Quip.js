// @todo - RETHINK EVERYTHING.
// @todo - REDO EVERYTHING.
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
   * @param  {Message} msg    	Message that triggered the Quip.
   */
  execute(msg) {
	
		let rng = Math.random();

    if(rng <= (this.frq / 100)) {
      msg.channel.send(this.responses[Math.floor(Math.random() * this.responses.length)]);
    }

  }

}

// Export the class.
module.exports = Quip;