// @TODO - DOCUMENTATION

/**
 * @TODO - TO MODIFY
 * @fileOverview Sora's main file.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * Sora likes it when it's clean, so keep it tidy!
 */

class SoraUtil {

  /* === Functions Start === */

  /**
   * [val description]
   * @param  {[type]} params [description]
   * @param  {[type]} count  [description]
   * @return {[type]}        [description]
   */
  val(params, count) {
    // If the count parameter isn't provided, we'll default it to 1.
    if(!count) {
      count = 1;
    }

    console.log(params.length)

    if(count == 0) {
      var someshit = (params.length <= 0) ? true : false;
      console.log(someshit);
      return (params.length <= 0) ? true : false;
    } else {
      return (params[count]) ? true : false;
    }
  };

  /**
   * Implements the custom function: extractID
   * @param  {[type]} tag [A discord string representing a user's Tag (highlighted string).]
   * @return {[type]}     [ID from the tag string.]
   */
 extractID(tag) {
    return tag.slice(2, -1);
  };

  /**
   * [extractParam description]
   * @param  {[type]} start [description]
   * @param  {[type]} end   [description]
   * @param  {[type]} msg   [description]
   * @return {[type]}       [description]
   */
  extractParam(start, end, msg) {
    start = msg.content.indexOf(start);
    end = msg.content.indexOf(end);

    return msg.content.substring(start + 1, end);
  }

  /**
   * Implements the custom function: printUserTag
   * @param  {[object/string]} variable [Can be either a user object]
   * @return {[string]}                 [String that will be interpreted by discord to tag user. i.e. "<@77517077325287424>"]
   */
  printUserTag(variable) {
    // Conditional check to verify if the variable is an object (user) or not.
    if(variable.username) {
      return "<@" + variable.id + ">";
    } else {
      return "<@" + variable + ">";
    }
  };

  /**
   * [removeCooldown description]
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  removeCooldown(client, key) {
    if(typeof client.commands_properties[key] !== 'undefined') {
      setTimeout(function(){ client.cooldowns[key] = false; console.log("Removed cooldown for " + key); }, 1000 * client.commands_properties[key].cooldown);
    } else {
      setTimeout(function(){ client.cooldowns[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
    }
  }
}

module.exports = SoraUtil;


