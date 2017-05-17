/**
 * Class [DiscourseManager]
 *
 * This class defines the properties of a [DiscourseManager] object.
 * The main purpose of this class is to have a manager for all of the messaging functions in one place.
 * The bot will call these functions to communicate with the Discord server, and the main issue we're
 * avoiding by adding this manager is to not have to change calls to Discord.Js's functions all over the code
 * if they ever change again. We would only have to change them here.
 *
 * i.e. if Discord.Js changes the Client.sendMessage() function to just send() and deprecates the former,
 * we would only have to change it here.
 *
 * And yes...They do change often.
 *
 * === Properties ===
 * - {client}     : The Discord Bot client.
 *
 */
class DiscourseManager {

  /**
   * Constructor for the CommandManager class.
   * Takes the client of the bot as an argument.
   */
  constructor(client) {

    // Instantiate the class properties.
    this.client = client;

  }

  /**
   * Instant Message function.
   * Send a quick message to anywhere in Discord. The destination can be a user or a channel.
   * @param  {[string]}                 text        Text we want to send.
   * @param  {[Channel/User/PMChannel]} destination Where we want to send it.
   */
  instantMessage(text, destination) {
  	destination.send(text);
  }

  /**
   * Reply function.
   * Send a quick message as a reply to a previous message.
   * @param  {[string]}                 text    Text we want to send.
   * @param  {[Channel/User/PMChannel]} message Message we want to reply to.
   */
  reply(text, message) {
  	message.reply(text);
  }

  // typeMessage(text, destination) {
  // 	destination.send(text);
  // }
}

// Export the Discourse Manager.
module.exports = DiscourseManager;