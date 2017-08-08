
// Project root relative path.
global.soraroot = __dirname + '/';

// Project source code relative path.
global.soraspace = soraroot + 'src/';

// Project resources relative path.
// Images, icons, files, etc.
global.sora_assets = soraroot + 'assets/';

var SoraDiscordClass = require('./src/soradiscord/SoraDiscord');
var SoraDiscordClient = new SoraDiscordClass(require('./settings'));

/**
* === Exports ===
* When this folder is required, this is what's sent to the variable.
*/
module.exports = {
  SoraDiscord: SoraDiscordClient,
};