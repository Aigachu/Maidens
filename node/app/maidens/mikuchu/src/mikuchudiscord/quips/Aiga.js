class Aiga extends Quip {

  constructor(client) {

    super(client);

    this.triggers = ['Aiga'];

    this.responses = [
      `Aiga isn't really that good at coding, in my opinion.`,
    ];

    this.frq = 5;

  }

}

module.exports = Aiga;