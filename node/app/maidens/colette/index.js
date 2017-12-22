let ColetteDiscordClass = require('./src/colettediscord/ColetteDiscordClient');
let ColetteDiscordClient = new ColetteDiscordClass(require('./settings'));

/**
 * === Exports ===
 * When this folder is required, this is what's sent to the variable.
 */
module.exports = {
    ColetteDiscord: ColetteDiscordClient,
};