var ColetteDiscordClass = require('./src/colettediscord/ColetteDiscord');
var ColetteDiscordClient = new ColetteDiscordClass(require('./settings'));

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
  ColetteDiscord: ColetteDiscordClient,
};