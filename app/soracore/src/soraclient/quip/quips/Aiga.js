const Quip = require('../Quip');

class Aiga extends Quip {

  constructor(client) {

    super(client);

    this.triggers = ['Aiga'];

    this.responses = [
      'Did you just say Aiga?',
      'Aiga isn\'t that great at coding...'
    ];

    this.frq = 10;

  }

}

module.exports = Aiga;