let MonikaDiscordClass = require('./src/monikadiscord/MonikaDiscordClient');
let MonikaDiscordClient = new MonikaDiscordClass(require('./settings'));

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
    MonikaDiscord: MonikaDiscordClient,
};