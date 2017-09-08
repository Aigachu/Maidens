let MariaDiscordClass = require('./src/mariadiscord/MariaDiscord');
let MariaDiscordClient = new MariaDiscordClass(require('./settings'));

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
  MariaDiscord: MariaDiscordClient,
};