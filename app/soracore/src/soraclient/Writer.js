// @TODO - Make this a class instead of an array of exports.
// SoraWriter

/* === Default Command Configuration Paramater Values === */
// The default values for a new command.
// Commands that have no configuration declaration in the commands_properties.json configuration file will be given these values by default.
var default_command_config = {
  oplevel:            2,
  description:        '',
  help_text:          '',
  allowed_channels:   'all',
  excluded_channels:  'none',
  cooldown:           'none',
  aliases:            'none'
};

/* === Default PMCommand Configuration Paramater Values === */
// The default values for a new pmcommand.
// PMCommands that have no configuration declaration in the pmcommands_properties.json configuration file will be given these values by default.
var default_pmcommand_config = {
  oplevel:            2,
  description:        '',
  help_text:          '',
  cooldown:           'none',
  aliases:            'none'
};

/* === Default Server Configuration Paramater Values === */
// The default values for a new server.
// Servers that have no configuration declaration in the servers_properties.json configuration file will be given these values by default.
var default_server_config = {
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
exports.loadCommConf = function(client, callback) {
  /* === Command Properties Configuration === */

  var commands = client.commands;

  // Write new command configuration values to the JSON file.
  jsonfile.readFile(commands_configuration_path, function(err, obj) {
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
          command_properties[key] = default_command_config;
        }
      }

      jsonfile.writeFileSync(commands_configuration_path, command_properties, {spaces: 2});

      callback();

    } else { // If the file is found and successfully loaded...
      var command_properties = obj;

      // Loops in the Commands array and generates a default configuration entry for each command that does not yet have an entry.
      for (var key in commands) {
        if(commands.hasOwnProperty(key)) {
          if(command_properties[key] == null) {
            console.log("\nSora: The following command has no configuration definition: " + key + ".\nSora: I will give it a default definition in the configuration file.");
            command_properties[key] = default_command_config;
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
                if(default_command_config[param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                  delete command_properties[key][param];
                }
              }
            }

            // Loops through the default configuration object to set any new configuration parameters to older commands that may not have them.
            for (var param in default_command_config) {
              if(default_command_config.hasOwnProperty(param)) {
                if(command_properties[key][param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                  command_properties[key][param] = default_command_config[param];
                }
              }
            }
          }
        }
      }

      jsonfile.writeFileSync(commands_configuration_path, command_properties, {spaces: 2});

      callback();

    }
  });

  /* === Command Properties End === */
}

/**
 * [loadCommConf description]
 * @return {[type]} [description]
 */
exports.loadPMCommConf = function(client, callback) {
  /* === Command Properties Configuration === */

  var pmcommands = client.pmcommands;

  // Write new pmcommand configuration values to the JSON file.
  jsonfile.readFile(pmcommands_configuration_path, function(err, obj) {
    if(err) { // If the file is not found or another error occurs...
      // This is most likely to happen if the file is not found.
      // In this case, log the error.
      // console.log(err);

      // Friendly Message from Sora telling us that she will generate a pmcommands configuration file.
      console.log("Sora: There doesn't seem to be a pmcommands configuration file or there was an error reading it.\nSora: Not to worry, I will generate a default one. You can go ahead and set the pmcommand properties afterwards.");

      // We will now proceed to generate a default pmcommands configuration file.
      var pmcommand_properties = {};

      // Loops in the pmCommands array and generates a default configuration entry for each of them.
      for (var key in pmcommands) {
        if(pmcommands.hasOwnProperty(key)) {
          pmcommand_properties[key] = default_pmcommand_config;
        }
      }

      jsonfile.writeFileSync(pmcommands_configuration_path, pmcommand_properties, {spaces: 2});

      callback();

    } else { // If the file is found and successfully loaded...
      var pmcommand_properties = obj;

      // Loops in the pmCommands array and generates a default configuration entry for each pmcommand that does not yet have an entry.
      for (var key in pmcommands) {
        if(pmcommands.hasOwnProperty(key)) {
          if(pmcommand_properties[key] == null) {
            console.log("\nSora: The following pmcommand has no configuration definition: " + key + ".\nSora: I will give it a default definition in the configuration file.");
            pmcommand_properties[key] = default_pmcommand_config;
          }
        }
      }

      // Loops through the configurations object to tidy up before saving.
      for (var key in pmcommand_properties) {
        if(pmcommand_properties.hasOwnProperty(key)) {
          // Deletes any pmcommand configuration declarations of pmcommands that have been removed.
          if(pmcommands[key] == null) {
            console.log("\nSora: The following pmcommand definition does not have a corresponding pmcommand in my code: " + key + ".\nSora: I will remove it from the configuration file.");
            delete pmcommand_properties[key];
          } else {
            // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
            // Parameters not in the default configuration will not be in *any* configuration.
            for (var param in pmcommand_properties[key]) {
              if(pmcommand_properties[key].hasOwnProperty(param)) {
                if(default_pmcommand_config[param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been removed from the default pmcommand configuration: " + param + "\nSora: I will proceed to remove it from all pmcommand configurations.");
                  delete pmcommand_properties[key][param];
                }
              }
            }

            // Loops through the default configuration object to set any new configuration parameters to older pmcommands that may not have them.
            for (var param in default_pmcommand_config) {
              if(default_pmcommand_config.hasOwnProperty(param)) {
                if(pmcommand_properties[key][param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been added to the default pmcommand configuration: " + param + "\nSora: I will proceed to add it to all pmcommand configurations with the default value.");
                  pmcommand_properties[key][param] = default_pmcommand_config[param];
                }
              }
            }
          }
        }
      }

      jsonfile.writeFileSync(pmcommands_configuration_path, pmcommand_properties, {spaces: 2});

      callback();
    }
  });

  /* === PMCommand Properties End === */
}

/**
 * [loadServConf description]
 * @param  {[type]} bot [description]
 * @return {[type]}     [description]
 */
exports.loadServConf = function(client, callback) {

  var servers = client.guilds;
  var commands = client.commands;

  // Get commands configuration properties.
  // You are now in tools.js, so you need to add a dot to indicate a return to the other directory.

  try{
    var commands_configuration = require(commands_configuration_path);
  } catch(err) {
    if(err) {
      console.log(err);
      return false;
    }
  }

  default_server_config.commands = commands_configuration;

  for( var comm in default_server_config['commands'] ) {
    if(default_server_config['commands'].hasOwnProperty(comm)) {
      default_server_config['commands'][comm].enabled = true;
      default_server_config['commands'][comm].overridden = false;
    }
  }

  jsonfile.readFile(servers_configuration_path, function(err, obj) {
    if(err) { // If the file is not found or another error occurs...
      // This is most likely to happen if the file is not found.
      // In this case, log the error.
      // console.log(err);

      // Friendly Message from Sora telling us that she will generate a commands configuration file.
      console.log("Sora: There doesn't seem to be a servers configuration file or there was an error reading it.\nSora: Not to worry, I will generate a default one. You can go ahead and set the servers properties afterwards.");

      // We will now proceed to generate a default server configuration file.
      var server_properties = {};

      servers.forEach(function(item, index, array) {
        server_properties[index] = default_server_config;
      });

      jsonfile.writeFileSync(servers_configuration_path, server_properties, {spaces: 2});

      callback();

    } else {
      var server_properties = obj;

      servers.forEach(function(item, index, array) {
        if(server_properties[index] == null) {
          console.log("\nSora: The following server has no configuration definition: " + servers[index].name + ".\nSora: I will give it a default definition in the configuration file.");
          server_properties[item.id] = default_server_config;
        }

        // Update the name entry in the configuration file.
        if(item.id in server_properties) {
          // console.log("\nSora: I have updated the name of the following server: " + servers[key].name);
          server_properties[item.id]['name'] = item.name;
        }
      });

      // Loops through the configurations object to tidy up before saving.
      for (var key in server_properties) {
        if(server_properties.hasOwnProperty(key)) {
          // Deletes any command configuration declarations of commands that have been removed.
          if(client.guilds.find("id", key) == null) {
            console.log("\nSora: The following server definition does not have a corresponding server in my cache: " + key + ".\nSora: I will remove it from the configuration file.");
            delete server_properties[key];
          } else {
            // Loops through the default configuration object to delete any parameters that are not set in the default configuration.
            // Parameters not in the default configuration will not be in *any* configuration.
            for (var param in server_properties[key]) {
              if(server_properties[key].hasOwnProperty(param)) {
                if(default_server_config[param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been removed from the default command configuration: " + param + "\nSora: I will proceed to remove it from all command configurations.");
                  delete server_properties[key][param];
                }
              }
            }

            // Loops through the default configuration object to set any new configuration parameters to older servers that may not have them.
            for (var param in default_server_config) {
              if(default_server_config.hasOwnProperty(param)) {
                if(server_properties[key][param] == null) {
                  // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                  server_properties[key][param] = default_server_config[param];
                }
              }
            }

            // Loops in the server configuration's commands object and generates a default configuration entry for each command that does not yet have an entry.
            for (var comm in commands) {
              if(commands.hasOwnProperty(comm)) {
                if(server_properties[key]['commands'][comm] == null) {
                  console.log("\nSora: The following command has no configuration definition in the "+ server_properties[key]['name'] +" server: " + comm + ".\nSora: I will give it a default definition in the configuration file.");
                  server_properties[key]['commands'][comm] = default_command_config;
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
                      if(default_command_config[param] == null && !(param in server_specific_command_params)) {
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
                  for (var param in default_command_config) {
                    if(default_command_config.hasOwnProperty(param)) {
                      if(server_properties[key]['commands'][comm][param] == null) {
                        // console.log("Sora: The following configuration parameter seems to have been added to the default command configuration: " + param + "\nSora: I will proceed to add it to all command configurations with the default value.");
                        server_properties[key]['commands'][comm][param] = default_command_config[param];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      jsonfile.writeFileSync(servers_configuration_path, server_properties, {spaces: 2});

      callback();
    }
  });

}
