/**
 * Run File for Mikuchu, the devbot.
 *
 * Use this link to get others to add the mikuchu to their servers.
 * (THIS IS NOT RECOMMENDED. MIKUCHU SHOULD BE CONSIDERED UNSTABLE AT ALL TIMES)
 * {Mikuchu - The Devbot}
 * https://discordapp.com/oauth2/authorize?&client_id=344881699928145920&scope=bot&permissions=1546959939
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
global.mikuchu = require('./app/maidens/mikuchu');
