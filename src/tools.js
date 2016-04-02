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

// Get Sora's configuration details.
// A real discord account must be created for the bot to run.
// Put the credentials of the newly created account into `conf/main.json` found at the same level as this file.
var config = require("../conf/main.json");

// Get jsonfile module ; Used to facilitate json reading and writing.
var jsonfile = require("jsonfile");

// Get all defined commands in the `Commands.js` file.
var Commands = require("../src/Commands.js").Commands;
var COMMANDS_DEFAULT_CONFIG = require("../src/Commands.js").CommandDefaultConfig;

/* === Requires Stop === */

/* === Variables Start === */

// Path to the commands configuration file.
// Use this file to configure command parameters from the list above.
var COMMANDS_CONFIGURATION_FILE_PATH = './conf/commands_properties.json';

// Path to the commands configuration file.
// Use this file to configure server parameters from the list above.
var SERVERS_CONFIGURATION_FILE_PATH = './conf/servers_properties.json';

// Command/Reactions Cooldowns Array
var COOLDOWNS = [];

/* === Variables End === */

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

/**
 * [loadCommConf description]
 * @return {[type]} [description]
 */
exports.loadCommConf = function() {
  /* === Command Properties Configuration === */

  // Write new command configuration values to the JSON file.
  jsonfile.readFile(COMMANDS_CONFIGURATION_FILE_PATH, function(err, obj) {
    if(err) { // If the file is not found or another error occurs...
      // This is most likely to happen if the file is not found.
      // In this case, log the error.
      // console.log(err);

      // Friendly Message from Sora telling us that she will generate a commands configuration file.
      console.log("Sora: There doesn't seem to be a commands configuration file or there was an error reading it.\nSora: Not to worry, I will generate a default one. You can go ahead and set the command properties afterwards.");

      // We will now proceed to generate a default commands configuration file.
      var command_properties = {};

      // Loops in the Commands array and generates a default configuration entry for each of them.
      for (var key in Commands) {
        if(Commands.hasOwnProperty(key)) {
          command_properties[key] = COMMANDS_DEFAULT_CONFIG;
        }
      }

      jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE_PATH, command_properties, {spaces: 2}, function (err) {
        if(err) {
          console.error(err)
        }
      });
    } else { // If the file is found and successfully loaded...
      var command_properties = obj;

      // Loops in the Commands array and generates a default configuration entry for each command that does not yet have an entry.
      for (var key in Commands) {
        if(Commands.hasOwnProperty(key)) {
          if(command_properties[key] == null) {
            console.log("\nSora: The following command has no configuration definition: " + key + ".\nSora: I will give it a default definition in the configuration file.");
            command_properties[key] = COMMANDS_DEFAULT_CONFIG;
          }
        }
      }

      // Loops through the configurations object to tidy up before saving.
      for (var key in command_properties) {
        if(command_properties.hasOwnProperty(key)) {
          // Deletes any command configuration declarations of commands that have been removed.
          if(Commands[key] == null) {
            console.log("\nSora: The following command definition does not have a corresponding command in my code: " + key + ".\nSora: I will remove it from the configuration file.");
            delete command_properties[key];
          } else {
            // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
            // Parameters not in the default configuration will not be in *any* configuration.
            for (var param in command_properties[key]) {
              if(command_properties[key].hasOwnProperty(param)) {
                if(COMMANDS_DEFAULT_CONFIG[param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                  delete command_properties[key][param];
                }
              }
            }

            // Loops through the default configuration object to set any new configuration parameters to older commands that may not have them.
            for (var param in COMMANDS_DEFAULT_CONFIG) {
              if(COMMANDS_DEFAULT_CONFIG.hasOwnProperty(param)) {
                if(command_properties[key][param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                  command_properties[key][param] = COMMANDS_DEFAULT_CONFIG[param];
                }
              }
            }
          }
        }
      }

      jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE_PATH, command_properties, {spaces: 2}, function (err) {
        if(err) {
          console.error(err)
        }
      });
    }
  });

  /* === Command Properties End === */
}

/**
 * [loadServConf description]
 * @param  {[type]} bot [description]
 * @return {[type]}     [description]
 */
exports.loadServConf = function(bot) {

  var servers = bot.servers;

  /* === Default Command Configuration Paramater Values === */
  // The default values for a new command.
  // Commands that have no configuration declaration in the commands.json configuration file will be given these values by default.
  var SERVERS_DEFAULT_CONFIG = {
    name:                 "",
    general_channel:      "",
    announcement_channel: "",
    timeout_role_name:    "Timeout",
    admin_roles:          [],
    enabled:              true,
    command_override:     false
  };

  // Get commands configuration properties.
  // You are now in tools.js, so you need to add a dot to indicate a return to the other directory.

  try{
    var commands_configuration = require('.' + COMMANDS_CONFIGURATION_FILE_PATH);
  } catch(err) {
    if(err) {
      console.log(err);
      return false;
    }
  }

  SERVERS_DEFAULT_CONFIG.commands = commands_configuration;

  jsonfile.readFile(SERVERS_CONFIGURATION_FILE_PATH, function(err, obj) {
    if(err) { // If the file is not found or another error occurs...
      // This is most likely to happen if the file is not found.
      // In this case, log the error.
      // console.log(err);

      // Friendly Message from Sora telling us that she will generate a commands configuration file.
      console.log("Sora: There doesn't seem to be a servers configuration file or there was an error reading it.\nSora: Not to worry, I will generate a default one. You can go ahead and set the servers properties afterwards.");

      // We will now proceed to generate a default server configuration file.
      var server_properties = {};

      // Now for each server, we will create a definition in the file with default values.
      for(var key in servers) {
        if(servers.hasOwnProperty(key) && key != 'limit' && key != 'length') {
          server_properties[servers[key].id] = SERVERS_DEFAULT_CONFIG;
        }
      }

      jsonfile.writeFile(SERVERS_CONFIGURATION_FILE_PATH, server_properties, {spaces: 2}, function (err) {
        if(err) {
          console.error(err)
        }
      });

    } else {
      var server_properties = obj;

      // Loops in the servers configurations array.
      for (var key in servers) {
        if(servers.hasOwnProperty(key) && key != 'limit' && key != 'length') {
          if(server_properties[servers[key].id] == null) {
            console.log("\nSora: The following server has no configuration definition: " + servers[key].name + ".\nSora: I will give it a default definition in the configuration file.");
            server_properties[servers[key].id] = SERVERS_DEFAULT_CONFIG;
          }

          // Update the name entry in the configuration file.
          if(servers[key].id in server_properties) {
            // console.log("\nSora: I have updated the name of the following server: " + servers[key].name);
            server_properties[servers[key].id]['name'] = servers[key].name;
          }
        }
      }

      // Loops in the servers array and generates a default configuration entry for each server that does not yet have an entry.
      for (var key in servers) {
        if(servers.hasOwnProperty(key) && key != 'limit' && key != 'length') {
          if(server_properties[servers[key].id] == null) {
            console.log("\nSora: The following server has no configuration definition: " + servers[key].name + ".\nSora: I will give it a default definition in the configuration file.");
            server_properties[servers[key].id] = SERVERS_DEFAULT_CONFIG;
            server_properties[servers[key].id]['name'] = servers[key].name;
          }
        }
      }

      // Loops through the configurations object to tidy up before saving.
      for (var key in server_properties) {
        if(server_properties.hasOwnProperty(key)) {
          // Deletes any command configuration declarations of commands that have been removed.
          if(bot.servers.get("id", key) == null) {
            console.log("\nSora: The following server definition does not have a corresponding server in my cache: " + key + ".\nSora: I will remove it from the configuration file.");
            delete server_properties[key];
          } else {
            // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
            // Parameters not in the default configuration will not be in *any* configuration.
            for (var param in server_properties[key]) {
              if(server_properties[key].hasOwnProperty(param)) {
                if(SERVERS_DEFAULT_CONFIG[param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                  delete server_properties[key][param];
                }
              }
            }

            // Loops through the default configuration object to set any new configuration parameters to older servers that may not have them.
            for (var param in SERVERS_DEFAULT_CONFIG) {
              if(SERVERS_DEFAULT_CONFIG.hasOwnProperty(param)) {
                if(server_properties[key][param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                  server_properties[key][param] = SERVERS_DEFAULT_CONFIG[param];
                }
              }
            }

            // Loops in the server configuration's commands object and generates a default configuration entry for each command that does not yet have an entry.
            for (var comm in Commands) {
              if(Commands.hasOwnProperty(comm)) {
                if(server_properties[key]['commands'][comm] == null) {
                  console.log("\nSora: The following command has no configuration definition in the "+ server_properties[key]['name'] +" server: " + comm + ".\nSora: I will give it a default definition in the configuration file.");
                  server_properties[key]['commands'][comm] = COMMANDS_DEFAULT_CONFIG;
                }
              }
            }

            // Loops through the configurations object to tidy up before saving.
            for (var comm in server_properties[key]['commands']) {
              if(server_properties[key]['commands'].hasOwnProperty(comm)) {
                // Deletes any command configuration declarations of commands that have been removed.
                if(Commands[comm] == null) {
                  // console.log("\nSora: The following command definition does not have a corresponding command in my code: " + comm + ".\nSora: I will remove it from the configuration file.");
                  delete server_properties[key]['commands'][comm];
                } else {

                  // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
                  // Parameters not in the default configuration will not be in *any* configuration.
                  for (var param in server_properties[key]['commands'][comm]) {
                    if(server_properties[key]['commands'][comm].hasOwnProperty(param)) {
                      if(COMMANDS_DEFAULT_CONFIG[param] == null) {
                        // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                        delete server_properties[key]['commands'][comm][param];
                      }
                      // sync the global properties to servers where they are not overriden.
                      if(!server_properties[key]['command_override'] && server_properties[key]['commands'][comm][param] != commands_configuration[comm][param]) {
                        server_properties[key]['commands'][comm][param] = commands_configuration[comm][param];
                      }
                    }
                  }

                  // Loops through the default configuration object to set any new configuration parameters to older commands that may not have them.
                  for (var param in COMMANDS_DEFAULT_CONFIG) {
                    if(COMMANDS_DEFAULT_CONFIG.hasOwnProperty(param)) {
                      if(server_properties[key]['commands'][comm][param] == null) {
                        // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                        server_properties[key]['commands'][comm][param] = COMMANDS_DEFAULT_CONFIG[param];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      jsonfile.writeFile(SERVERS_CONFIGURATION_FILE_PATH, server_properties, {spaces: 2}, function (err) {
        if(err) {
          console.error(err)
        }
      });
    }
  });

  return true;

}

/**
 * [updateCommandConfig description]
 * @param  {[type]} command [description]
 * @param  {[type]} param   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
exports.updateCommandConfig = function(command, param, value) {
	jsonfile.readFile(COMMANDS_CONFIGURATION_FILE_PATH, function(err, obj) {
		if(err) { // THIS SHOULDN'T HAPPEN
			console.log(err);
		} else {
			properties = obj;

			properties[command][param] = value;

			jsonfile.writeFile(COMMANDS_CONFIGURATION_FILE_PATH, properties, {spaces: 2}, function (err) {
	      if(err) {
	        console.error(err);
	      }
    	});
		}
	});
};

/**
 * [isCommand description]
 * @param  {[type]} command [description]
 * @param  {[type]} param   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
exports.isCommand = function(msg) {
  // Get commands configuration properties.
  // You are now in tools.js, so you need to add a dot to indicate a return to the other directory.
  var commands_configuration = require('.' + COMMANDS_CONFIGURATION_FILE_PATH);

  // Divide text into distinct parameters.
  var split = msg.content.split(" ");

  // Check if it contains the command syntax.
  if(split[0] == config.command_prefix && split[1]) {

    // Supposed Key
    var key = split[1].toLowerCase();

    // Loop through the command configurations and check if the key is an alias for a command.
    for (var command_key in commands_configuration) {
      if(commands_configuration.hasOwnProperty(command_key)) {

        // This will set the key variable to the key of the actual command that the alias is for.
        if(commands_configuration[command_key].aliases.indexOf(key) > -1) {
          key = command_key;
        }

      }
    }

    // Check if the second word in the message is
    if(key in Commands) {
      // console.log("Sora: This is a command.");
      return key;
    }
  }

  // console.log("Sora: This is not a command.");
  return false;
};

/**
 * [removeCooldown description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
exports.removeCooldown = function(key) {
  if(typeof Commands[key] !== 'undefined') {
    setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * Commands[key].cooldown);
  } else {
    setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
  }
}

/**
 * [authCommand description]
 * @param  {[type]} command [description]
 * @param  {[type]} param   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
exports.authCommand = function(bot, msg, key) {

  // Get commands configuration properties.
  // Within the function, you are now in tools.js, so you need to add a dot to indicate a return to the other directory.
  var commands_configuration = require('.' + COMMANDS_CONFIGURATION_FILE_PATH);

  // Load the command's configurations.
  var command_config_obj = commands_configuration[key];

  // If the message author is a God, Sora will not verify anything. Auto-Auth.
  if(!(msg.author.id in config.gods)) {

    // Check OP Level
    if(command_config_obj.oplevel === 2) {
      return false;
    }

    if(command_config_obj.oplevel === 1) {
      if(!(msg.author.id in config.admins)) {
        return false;
      }
    }

    // Check Allowed Servers
    if(command_config_obj.allowed_servers !== 'all') {
      if(!(msg.channel.server.id in command_config_obj.allowed_servers)) {
        return false;
      }
    }

    // Check Allowed Channels
    if(command_config_obj.allowed_channels !== 'all') {
      if(!(msg.channel.id in command_config_obj.allowed_channels)) {
        return false;
      }
    }

    // Check Cooldown (if any)
    if(command_config_obj.cooldown !== 'none') {
     if(COOLDOWNS[key]) {

      if(!COOLDOWNS['announce_cd_' + key]) {

        bot.sendMessage(msg.channel, "Hmm. The `" + key + "` command seems to be on cooldown.\nThe cooldown time is **" + command_config_obj.cooldown + "** seconds. It will be available shortly.", function(error, message) {
          // Delete the cooldown warning after five seconds.
          setTimeout(function(){ bot.deleteMessage(message); }, 1000 * 5);
        });

        COOLDOWNS['announce_cd_' + key] = true;

        if(typeof Commands[key] !== 'undefined') {
          setTimeout(function(){ COOLDOWNS['announce_cd_' + key] = false; /* console.log("Removed cooldown for " + key); */ }, 1000 * command_config_obj.cooldown);
        } else {
          setTimeout(function(){ COOLDOWNS['announce_cd_' + key] = false; /* console.log("Removed cooldown for " + key); */ }, 1000 * 15);
        }
      }

      bot.deleteMessage(msg);

      return false;

     } else {

      COOLDOWNS[key] = true;

        if(typeof Commands[key] !== 'undefined') {
          setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * command_config_obj.cooldown);
        } else {
          setTimeout(function(){ COOLDOWNS[key] = false; console.log("Removed cooldown for " + key); }, 1000 * 15);
        }

     }
    }
  }

  // console.log("Sora: This command will not be authorized at this time.");
  return true;
};

/* === Functions End === */


