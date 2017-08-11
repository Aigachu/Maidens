class Nairo extends Quip {

  constructor(client) {

    super(client);

    this.triggers = ['Nairo'];

    this.responses = [
      `I timed out Nairo once. :) Not gonna lie...It felt AWESOME!`,
    ];

    this.frq = 5;

  }

}

module.exports = Nairo;