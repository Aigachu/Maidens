/**
 * Run File for Maiden main features.
 *
 * Use these links to get others to add the maidens to their servers:
 *
 * {Sora Akanegasaki - The First Lady}
 * https://discordapp.com/oauth2/authorize?&client_id=344561767050903554&scope=bot&permissions=1546959939
 *
 * {Colette Brunel - The Goddess}
 * https://discordapp.com/oauth2/authorize?&client_id=344562549615755285&scope=bot&permissions=1546959939
 *
 * {Lady Maria - Lady Death}
 * https://discordapp.com/oauth2/authorize?&client_id=344885267808911360&scope=bot&permissions=1546959939
 *
 * {Monika - Club President}
 * https://discordapp.com/oauth2/authorize?&client_id=398515117358055434&scope=bot&permissions=1546959939
 *
 * Current valid permission bit: 1546959939
 * To calculate the permissions bit, go here: https://discordapi.com/permissions.html
 *
 * Last note - See README.md for more details!
 *
 * "Happy Blick Winkel! ;-) <3" - Sora
 *
 */

// Get all globals that are used across the application.
require('./globals.js');

/**
 * === Instantiation ===
 */

// Core JS file with all of Sora's Components.
global.sora = require('./app/maidens/sora');

// Core JS file with all of Colette's Components.
global.colette = require('./app/maidens/colette');

// Core JS file with all of Maria's Components.
global.maria = require('./app/maidens/maria');

// Core JS file with all of the Monika's Components.
global.monika = require('./app/maidens/monika');
