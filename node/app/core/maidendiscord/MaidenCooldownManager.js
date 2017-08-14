/**
 * Class [CooldownManager]
 *
 * @todo  - Description
 *
 *
 * === Properties ===
 * - {client}     : The Discord Bot client.
 *
 */
class MaidenCooldownManager {

  /**
   * Constructor for the CooldownManager class.
   * Takes the client of the bot as an argument.
   */
  constructor(client) {

    // Instantiate the class properties.
    this.client = client;

    // Instantiate the cooldowns object.
    this.cooldowns = {};

  }

  /**
   * [set description]
   * @param {[type]} type     [description]
   * @param {[type]} key      [description]
   * @param {[type]} scope    [description]
   * @param {[type]} duration [description]
   */
  set(type, key, scope, duration) {
    if (!(type in this.cooldowns)) {
      this.cooldowns[type] = {};
    }

    if(!(key in this.cooldowns[type])) {
      this.cooldowns[type][key] = [];
    }

    this.cooldowns[type][key].push(scope);

    return new Promise((resolve, reject) => {
      var cm = this;
      setTimeout(() => {
        cm.cooldowns[type][key].splice(cm.cooldowns[type][key].indexOf(scope), 1);
        resolve("Remove cooldown now!"); // Yay! Everything went well!
      }, duration);
    });
  }

  /**
   * [unset description]
   * @param  {[type]} type  [description]
   * @param  {[type]} key   [description]
   * @param  {[type]} scope [description]
   * @return {[type]}       [description]
   */
  unset(type, key, scope) {
    this.cooldowns[type][key].splice(this.cooldowns[type][key].indexOf(scope), 1);
  }

  /**
   * [check description]
   * @param  {[type]} type  [description]
   * @param  {[type]} key   [description]
   * @param  {[type]} scope [description]
   * @return {[type]}       [description]
   */
  check(type, key, scope) {
    if (!(type in this.cooldowns)) {
      return false;
    }

    if(!(key in this.cooldowns[type])) {
      return false;
    }

    return this.cooldowns[type][key].indexOf(scope) >= 0;
  }
}

// Export Class.
module.exports = MaidenCooldownManager;