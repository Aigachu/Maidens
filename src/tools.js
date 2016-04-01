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

/* === Requires Start === */

// Get jsonfile module ; Used to facilitate json reading and writing.
var jsonfile = require("jsonfile");

/* === Requires Stop === */

/* === Functions Start === */

/**
 * Implements the custom function: extractID
 * @param  {[type]} tag [A discord string representing a user's Tag (highlighted string).]
 * @return {[type]}     [ID from the tag string.]
 */
exports.validate_parameters = function(params, min_param_count, max_param_count) {
	min_param_count = typeof min_param_count !== 'undefined' ? min_param_count : 1;

  if (max_param_count !== null && !params[min_param_count - 1] || params[max_param_count]){
  	return false;
  } else if(!max_param_count && !params[min_param_count - 1]) {
  	return false;
  } else {
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

exports.updateCommandConfig = function(command, param, value) {
	var COMMANDS_CONFIGURATION_FILE = './conf/commands.json';

	jsonfile.readFile(COMMANDS_CONFIGURATION_FILE, function(err, obj) {
		if(err) { // THIS SHOULDN'T HAPPEN
			console.log(err);
		} else {
			properties = obj;

			properties[command][param] = value;

			jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE, properties, {spaces: 2}, function (err) {
	      if(err) {
	        console.error(err);
	      }
    	});
		}
	});
};

/* === Functions End === */


