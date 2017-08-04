const Quip = require('../Quip');

class Example extends Quip {

	constructor(client) {

		super(client);

    this.triggers = ['hi', 'bonjour', 'sup'];

    this.responses = [
      'hello!'
    ];

    this.frq = 20;

  }

}

module.exports = Example;