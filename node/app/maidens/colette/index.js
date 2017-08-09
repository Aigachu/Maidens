
// Project root relative path.
global.coletteroot = __dirname + '/';

// Project source code relative path.
global.colettespace = coletteroot + 'src/';

// Project resources relative path.
// Images, icons, files, etc.
global.colette_assets = coletteroot + 'assets/';

var ColetteDiscordClass = require('./src/colettediscord/ColetteDiscord');
var ColetteDiscordClient = new ColetteDiscordClass(require('./settings'));

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
  ColetteDiscord: ColetteDiscordClient,
};