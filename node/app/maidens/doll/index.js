let DollDiscordClass = require('./src/dolldiscord/DollDiscord');
let DollDiscordClient = new DollDiscordClass(require('./settings'));

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
  DollDiscord: DollDiscordClient,
};