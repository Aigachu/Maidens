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

/* === Functions Start === */

/**
 * [val description]
 * @param  {[type]} params [description]
 * @param  {[type]} count  [description]
 * @return {[type]}        [description]
 */
exports.val = function(params, count) {
  count = typeof count !== 'undefined' ? count : 1;

  if( count == 0 && params[count + 1] ) {
    return false;
  } else if(!params[count]) {
    return true;
  }
};

/**
 * Implements the custom function: extractID
 * @param  {[type]} tag [A discord string representing a user's Tag (highlighted string).]
 * @return {[type]}     [ID from the tag string.]
 */
exports.extractID = function(tag) {
  return tag.slice(2, -1);
};

/**
 * [extractParam description]
 * @param  {[type]} start [description]
 * @param  {[type]} end   [description]
 * @param  {[type]} msg   [description]
 * @return {[type]}       [description]
 */
exports.extractParam = function(start, end, msg) {
  start = msg.content.indexOf(start);
  end = msg.content.indexOf(end);

  return msg.content.substring(start + 1, end);
}

/**
 * Implements the custom function: printUserTag
 * @param  {[object/string]} variable [Can be either a user object]
 * @return {[string]}                 [String that will be interpreted by discord to tag user. i.e. "<@77517077325287424>"]
 */
exports.printUserTag = function(variable) {
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
exports.removeCooldown = function(key) {
  if(typeof sora.commands_properties[key] !== 'undefined') {
    setTimeout(function(){ sora.cooldowns[key] = false; console.log("Removed cooldown for " + key); }, 1000 * sora.commands_properties[key].cooldown);
  } else {
    setTimeout(function(){ sora.cooldowns[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
  }
}

/* === Functions End === */


