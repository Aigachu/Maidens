let SoraDiscordClass = require('./src/soradiscord/SoraDiscordClient');
let SoraDiscordClient = new SoraDiscordClass(require('./settings'));

/**
 * === Exports ===
 * When this folder is required, this is what's sent to the variable.
 */
module.exports = {
    SoraDiscord: SoraDiscordClient,
};