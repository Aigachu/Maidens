class DiscourseManager {
  constructor(client) {

    this.client = client;

  }

  sendMessage(text, destination) {
  	destination.send(text);
  }

  // typeMessage(text, destination) {
  // 	destination.send(text);
  // }
}

module.exports = DiscourseManager;