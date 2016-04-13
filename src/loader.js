/* === Requires Start === */

// Get jsonfile module ; Used to facilitate json reading and writing.
var jsonfile = require("jsonfile");

// Get all defined commands in the `Commands.js` file.
var commands = require("../src/commands.js").commands;

/* === Requires Stop === */

// Path to the commands configuration file.
// Use this file to configure command parameters from the list above.
var COMMANDS_CONFIGURATION_FILE_PATH = './conf/commands_properties.json';

// Path to the commands configuration file.
// Use this file to configure server parameters from the list above.
var SERVERS_CONFIGURATION_FILE_PATH = './conf/servers_properties.json';

/* === Default Command Configuration Paramater Values === */
// The default values for a new command.
// Commands that have no configuration declaration in the commands_properties.json configuration file will be given these values by default.
var COMMANDS_DEFAULT_CONFIG = {
  oplevel:            2,
  description:        '',
  help_text:          '',
  allowed_channels:   'all',
  excluded_channels:  'none',
  cooldown:           'none',
  aliases:            'none'
};

/* === Default Server Configuration Paramater Values === */
// The default values for a new server.
// Servers that have no configuration declaration in the servers_properties.json configuration file will be given these values by default.
var SERVERS_DEFAULT_CONFIG = {
  name:                   "",
  general_channel:        "",
  announcement_channel:   "",
  timeout_role_name:      "Timeout",
  admin_roles:            [],
  override_all_commands:  false
};

var server_specific_command_params = {
  enabled: '',
  overridden: ''
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
      for (var key in commands) {
        if(commands.hasOwnProperty(key)) {
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
      for (var key in commands) {
        if(commands.hasOwnProperty(key)) {
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
          if(commands[key] == null) {
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

  return true;

  /* === Command Properties End === */
}

/**
 * [loadServConf description]
 * @param  {[type]} bot [description]
 * @return {[type]}     [description]
 */
exports.loadServConf = function(bot) {

  var servers = bot.servers;

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

  for( var comm in SERVERS_DEFAULT_CONFIG['commands'] ) {
    if(SERVERS_DEFAULT_CONFIG['commands'].hasOwnProperty(comm)) {
      SERVERS_DEFAULT_CONFIG['commands'][comm].enabled = true;
      SERVERS_DEFAULT_CONFIG['commands'][comm].overridden = false;
    }
  }

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
            for (var comm in commands) {
              if(commands.hasOwnProperty(comm)) {
                if(server_properties[key]['commands'][comm] == null) {
                  console.log("\nSora: The following command has no configuration definition in the "+ server_properties[key]['name'] +" server: " + comm + ".\nSora: I will give it a default definition in the configuration file.");
                  server_properties[key]['commands'][comm] = COMMANDS_DEFAULT_CONFIG;
                  server_properties[key]['commands'][comm].enabled = true;
                  server_properties[key]['commands'][comm].overridden = false;
                }
              }
            }

            // Loops through the configurations object to tidy up before saving.
            for (var comm in server_properties[key]['commands']) {
              if(server_properties[key]['commands'].hasOwnProperty(comm)) {
                // Deletes any command configuration declarations of commands that have been removed.
                if(commands[comm] == null) {
                  // console.log("\nSora: The following command definition does not have a corresponding command in my code: " + comm + ".\nSora: I will remove it from the configuration file.");
                  delete server_properties[key]['commands'][comm];
                } else {

                  // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
                  // Parameters not in the default configuration will not be in *any* configuration.
                  for (var param in server_properties[key]['commands'][comm]) {
                    if(server_properties[key]['commands'][comm].hasOwnProperty(param)) {
                      if(COMMANDS_DEFAULT_CONFIG[param] == null && !(param in server_specific_command_params)) {
                        // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                        delete server_properties[key]['commands'][comm][param];
                      }
                      // sync the global properties to servers where they are not overriden.
                      if(!server_properties[key]['override_all_commands']) {
                        if(!server_properties[key]['commands'][comm]['overridden'] && server_properties[key]['commands'][comm][param] != commands_configuration[comm][param] && !(param in server_specific_command_params)) {
                          server_properties[key]['commands'][comm][param] = commands_configuration[comm][param];
                        }
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
