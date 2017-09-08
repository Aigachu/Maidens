/**
 * Class [CommandManager]
 *
 * This class defines the properties of a [CommandManager] object.
 * The CommandManager is the interpreter for commands, and will read every message
 * received in Discord and determine if there's anything to do with them. Directly
 * related to [Command] type objects, that can be found in the file in the './objects' folder.
 *
 * === Properties ===
 * - {client}     : The Discord Bot client.
 * - {commands}   : Commands retrieved from reading all files in the "./commands" folder.
 */
class MaidenCommandManager {

  /**
   * Constructor for the CommandManager class.
   * Takes the client of the bot as an argument.
   */
  constructor(client) {

    // Instantiate the class properties.
    this.client = client;

    // Instantiate the client with core commands.
    this.build(client);

  }

  /**
   * Interpret method.
   * Determines what to do with a message that has been heard.
   * @param  {Message} msg Message received (or heard) in Discord.
   */
  interpret(msg) {

    // Detect command from message
    let key = this.detectCommand(msg);
  
    // Checks if a command is heard. If not, get out.
    if (key) {
      // Discerns the command.
      this.discernCommand(msg, key);
    }

  }

  /**
   * detectCommand method.
   * Simple. Checks if the message heard is a command or not.
   * @param  {Message}  msg   Message received (or heard) in Discord.
   * @return {Boolean/String} Returns the key of the command if found. False if no command is found.
   */
  detectCommand(msg) {

    // If this message comes from the bot, it's not a command!
    if (msg.author.id === this.client.user.id) {
      return false;
    }

    // Divide text into distinct parameters.
    let split = msg.content.split(" ");
  
    // Checks if there are even two words separated by a space in the given text.
    if(split[1] === null || split[1].length === 0) {
      return false;
    }

    // Check if it contains the command syntax.
    // The command syntax can be described in the following examples.
    // @Mikuchu setname Hatsune Miku -- @BOT_TAG COMMAND_KEY INPUT
    // maidev setname Hatsune Miku -- COMMAND_PREFIX COMMAND_KEY INPUT
    if (split[0] !== this.client.cprefix && split[0] !== `<@${this.client.user.id}>` && split[0] !== `<@!${this.client.user.id}>`) {
      return false;
    }

    // If the command is in the list of command definitions, return it.
    // Commands have already been loaded, so we can check if the given key is in the object.
    if (split[1].toLowerCase() in this.commands) {
      return split[1].toLowerCase();
    }

    // Check if the second word in the message is a command alias, and return the key of the parent command.
    // Some commands have aliases (extra keys) that they can be called from. Check if the user is
    // using one of those aliases.
    if (split[1].toLowerCase() in this.commands.aliases) {
      return this.commands.aliases[split[1].toLowerCase()];
    }

    return false;
  }

  /**
   * Discern Command method.
   * This determines what to do with a command that has been heard.
   * Depending on options or parameters, the outcome may be different.
   *
   * @param  {Message}  msg   Message heard or received that has been identified as a command.
   * @param  {String}   key   Key of the command that will be parsed.
   * @return {Boolean}        Can return 'false' if the command fails.
   */
  discernCommand(msg, key) {

    let command = this.commands[key];

    // Here, we're gonna need to do a couple of extra checks to make sure that whoever invoked the command
    // is allowed to use it in this given context.

    // Check if the command is allowed by this user.
    // We'll only do this check if the command's 'users' auth is not empty.
    if (!_.isEmpty(command.config.auth.users) && _.indexOf(command.config.auth.users, msg.author.id) < 0) {
      return false;
    }

    // If an 'oplevel' is defined, we'll make some checks to see if the user
    // is an admin or a god.
    // It's important to note that when loaded, gods are automatically merged into the
    // admins. So this check works fine.
    if ("oplevel" in command.config.auth) {
      if ( command.config.auth.oplevel === 1 && !(msg.author.id in this.client.admins)) {
        return false;      
      }
      if ( command.config.auth.oplevel === 2 && !(msg.author.id in this.client.gods)) {
        return false;      
      }
    }

    // Check if the command is being called in PMs and if it's allowed to be.
    if (msg.channel.type === "dm" && !command.config.auth.pms) {
      return false;
    }

    // Check if the command is allowed in this guild.
    // We'll only do this check if the command's 'guilds' auth is not empty.
    if (!_.isEmpty(command.config.auth.guilds) && _.indexOf(command.config.auth.guilds, msg.guild.id) < 0) {
      return false;
    }

    // Check if the command is allowed in this channel.
    // We'll only do this check if the command's 'channels' auth is not empty.
    if (!_.isEmpty(command.config.auth.channels) && _.indexOf(command.config.auth.channels, msg.channel.id) < 0) {
      return false;
    }

    // For the help and description options, we will treat them here if they are present.
    // Nothing else happens if these options are found.
    if (msg.content.includes("--help")) {
      command.help(msg);
      return true;
    }

    if (msg.content.includes("--desc")) {
      command.desc(msg);
      return true;
    }

    // Analyze the command into it's different parts and process their syntactic roles.
    this.parseCommand(msg, key);
    
    return true;

  }

  /**
   * Parse Command
   * Use this to extract parameters from a heard command.
   * Words surrounded by "" should be treated as one parameter.
   * @param  {Message}  message The message object of the message heard as a command.
   * @param  {String}   key     Key of the command that will be parsed.
   * @return {String}           Array of parameters arranged by the order they appear in.
   */
  parseCommand(message, key) {

    // Adding extra documentation here because the parsing of commands has undergone quite a change.
    // Follow through properly!
    
    // !! September 2017 Note !!
    // I have removed all 'return' calls from error throws because commands were way too strict.
    // We will check what to do with this but for now, as long as the commands still run, it's fine.
    // @TODO -- Adding this here to check on this at a later date.

    // Get the command that will be parsed.
    let command = this.commands[key];
  
    // First, we check if the command is a Simple command.
    // Simple commands don't have any input, or options. You simply enter the
    // command key, and it'll handle the rest.
    // If any input is given, an error should be thrown.
    if (_.isEmpty(command.input) && _.isEmpty(command.options) && message.content.trim().replace(/\s{2,}/g, ' ').split(" ").length > 2) {
      command.error(message.content, "InputGivenWhenSimpleCommand", message);
    }

    // Regex to get regular options in the message.
    // i.e. -x -d -o
    let get_options_regex = /-([\w-]*)/g;

    // Now we check if the command is optionless. If it is, then no options should be given.
    if (_.isEmpty(command.options) && message.content.match(get_options_regex) !== null) {
      command.error(message.content, "OptionsGivenWhenOptionlessCommand", message);
    }

    // To do any following checks, we need the input of the command.
    let input = this.getCommandInput(message.content);

    // We're diving into callback lake, so we'll set the client to a variable for safety.
    let client = this.client;

    // If the command takes options, and options were submitted, compare the options inputted.
    // Invalid options should not pass through to the command.
    // NOTE: As stated above, return statements were removed. So commands will no longer stop execution
    // even if errors are thrown.
    // @todo - show invalid options in error text.
    if (!_.isEmpty(command.options) && !_.isEmpty(input.options)) {
      
      // We initialize a variable that will store an error.
      let error = false;
      
      Object.keys(input.options).forEach(function(key) {
        
        // If the given option is not in the command's available options, fire an error.
        if (!(key in command.options)) {
          error = "InvalidOption";
        }
        
        // If the given option needs text but the value given isn't a string, fire an error.
        if (command.options[key].needs_text && input.options[key].constructor.name !== "String") {
          error = "OptionGivenWithoutInput";
        }
        
        // If the given option isn't allowed to be used by this user, remove it from the options that are sent to the data.
        // No error is fired. It's a soft failure, so the user will just not receive anything.
        if ("oplevel" in command.options[key]) {
          if ( command.options[key].oplevel === 1 && !(message.author.id in client.admins)) {
            delete input.options[key];      
          }
          if ( command.options[key].oplevel === 2 && !(message.author.id in client.gods)) {
            delete input.options[key];      
          }
        }
        
      });
      
      // If there's an error, we fire it.
      if (error) {
        command.error(key, error, message);
      }
      
    }

    // If the command takes input, check to see if the command's input was entered.
    if (!_.isEmpty(command.input) && _.isEmpty(input.array)) {
      command.error(message.content, "InputRequiredButNotEntered", message);
    }

    // Run Command if it passed through the parsing.
    command.execute(message, input);
  }

  /**
   * Get input from a command.
   * Input 
   * @param  {String} msg_content Raw content of the message from the received command.
   * @return {Object}             Object containing the input that was obtained, split in different formats.
   */
  getCommandInput(msg_content) {

    // We'll store the input in this object.
    let input = {};

    // We'll get the raw input first.
    // Raw input is everything that comes after the command prefix or bot tag, and the command key.
    // Some commands don't take any options into consideration. They'll always use raw input.
    input.raw = msg_content.split(' ');
    input.raw.splice(0, 2);
    input.raw = input.raw.join(' ').trim();

    // @TODO - Set a flag in commands for the type of input they take.
    // If we do this, we can avoid running all the code below when commands don't
    // take any options.

    // Array to store options keys found in the command message.
    let options = {};

    // Regex to get any input options in the message.
    let get_options_with_text_regex = /-([\w-]?)"([^"]*)"/g;
    let t_opts = msg_content.match(get_options_with_text_regex);

    // If we find some input-options in the message... e.g. '$s ping -c"This is a custom message"'
    if(t_opts !== null) {
      // For each match, add the option to the options array and remove it from the message.
      // This will clean options out of the message so we're only left with the raw input (if needed)
      t_opts.forEach((t_opt) => {
        options[t_opt.substr(0, 2).replace("-", "")] = t_opt.substr(2, t_opt.length).replace(/"/g, "");
        msg_content = msg_content.replace(t_opt, "");
      });
    }

    // Regex to get regular options in the message.
    let get_options_regex = /-([\w-#!$%?]*)/g;
    let opts = msg_content.match(get_options_regex);

    // If we find some regular options in the message... e.g. '$s ping -c -d'
    if(opts !== null) {
      // For each match, add the option to the options array and remove it from the message.
      // This will clean options out of the message so we're only left with the raw input (if needed)
      opts.forEach((opt) => {
        options[opt.charAt(1)] = (opt.substr(2, opt.length)) ? opt.substr(2, opt.length) : opt.charAt(1);
        msg_content = msg_content.replace(opt, "");
      });
    }

    // Assign the options array to the input object.
    input.options = options;

    // At this point, the message is stripped of any sort of options.
    // e.g. -d -c"This is custom input in an option."
    // Things like the example up above are removed.

    // Remove any extra whitespace in the message.
    // Extra whitespace can be user inputted or can be the result of removing others
    msg_content = msg_content.replace(/\s{2,}/g, ' ');

    // Get an array with all words in the message separate by a space.
    let raw_input_array = msg_content.trim().split(" ");

    // The difference between input.full and input.raw is that input.full has all of the
    // options text stripped. Commands that don't care about the options will want to have all text,
    // regardless of all the manipulations and regex we have above.
    input.array = raw_input_array;
    raw_input_array.splice(0, 2);
    input.full = raw_input_array.join(' ').trim();

    // @TODO - All commands that don't use options should use input.raw in their tasks.
    // Otherwise, they'll use input.full. We need a task to check all of the commands and do this cleanup.

    return input;
  }

  /**
   * Build all commands into the manager.
   * This method reads all of the files in the "./commands" directory and turns them into commands.
   * @param  {MaidenDiscordClient}  client      The client that will be used and where the commands will be loaded.
   */
  build(client) {

    // Object to store the commands we're about to get.
    let commands = {};

    // We'll store the aliases inside of the object itself.
    commands.aliases = {};

    // Get General Commands
    // General commands are commands that will be callable through all Maidens.
    // They can be found in the './commands' folder.
    glob.sync(__dirname + '/commands**/*.js').forEach((file) => {

      // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
      let filename = file.replace(/^.*[\\\/]/, '');

      // Get the key of the command by interpreting the filename.
      let command_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

      // Require the Command's Class.
      let CommandClass = require('./commands/' + filename);

      // Instantiate the [Command] and store it in the {commands} array.
      commands[command_key] = new CommandClass(client);

      // If the instantiated command has aliases, we'll add them to the aliases array.
      if (typeof commands[command_key].aliases !== 'undefined' && commands[command_key].aliases.length > 0) {
        commands[command_key].aliases.forEach((alias) => {
          commands.aliases[alias] = command_key;
        });
      }

    });

    // Get Maiden Specific Commands
    // Maiden specific commands are found in the maiden's namespace.
    // They each have their own 'commands' folders, and these are commands
    // that can only be called through them. For the given client, we'll load
    // these too.
    glob.sync(client.namespace + 'commands**/*.js').forEach((file) => {

      // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
      let filename = file.replace(/^.*[\\\/]/, '');

      // Get the key of the command by interpreting the filename.
      let command_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

      // Require the Command's Class.
      let CommandClass = require(client.namespace + 'commands/' + filename);

      // Instantiate the [Command] and store it in the {commands} array.
      commands[command_key] = new CommandClass(client);

      // If the instantiated command has aliases, we'll add them to the aliases array.
      if (typeof commands[command_key].aliases !== 'undefined' && commands[command_key].aliases.length > 0) {
        commands[command_key].aliases.forEach((alias) => {
          commands.aliases[alias] = command_key;
        });
      }

    });

    // Get Commands from plugins
    // Plugins have their own commands too, and have their own 'commands' folders.
    // We'll load commands for each plugin this client has 'plugged' to it.
    this.client.plugins.every((plugin) => {
      glob.sync(plugin.path + '/commands**/*.js').forEach((file) => {

        // Remove a huge part of the path that we don't need. We only want the name of the File at the end.
        let filename = file.replace(/^.*[\\\/]/, '');

        // Get the key of the command by interpreting the filename.
        let command_key = filename.replace(/\.[^/.]+$/, "").toLowerCase();

        // Require the Command's Class.
        let CommandClass = require(plugin.path + '/commands/' + filename);

        // Instantiate the [Command] and store it in the {commands} array.
        commands[command_key] = new CommandClass(client);

        // If the instantiated command has aliases, we'll add them to the aliases array.
        if (typeof commands[command_key].aliases !== 'undefined' && commands[command_key].aliases.length > 0) {
          commands[command_key].aliases.forEach((alias) => {
            commands.aliases[alias] = command_key;
          });
        }

      });

      return true;

    });

    // Set the commands to the command manager.
    this.commands = commands;

  }
}

// Export the Command Manager.
module.exports = MaidenCommandManager;