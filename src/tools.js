// @TODO - DOCUMENTATION

/**
 * TO MODIFY
 * @fileOverview Sora's main file.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * Sora likes it when it's clean, so keep it tidy!
 */

/* === Functions Start === */

/**
 * Implements the custom function: extractID
 * @param  {[type]} tag [A discord string representing a user's Tag (highlighted string).]
 * @return {[type]}     [ID from the tag string.]
 */
exports.extractID = function(tag) {
  return tag.slice(2, -1);
};

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

/* === Functions End === */


