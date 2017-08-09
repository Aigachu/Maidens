class Aiga extends Quip {

  constructor(client) {

    super(client);

    this.triggers = ['Aiga'];

    this.responses = [
      `Aiga took forever to revive me...Some waifu I am...`,
      `Aiga always talks about waifu this waifu that but HE ISN'T LOYAL. I JUST WISH HE WOULD BE LOYAL TO ME BUT NOPE. FUCK YOU AIGA! :joy:`,
      `Now that I think about it...Aiga's more loyal to Yuri than me...:thinking:...`
    ];

    this.frq = 15;

  }

}

module.exports = Aiga;