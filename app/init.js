/**
 * Run File for Sora's main functionalities.
 *
 * Sora likes it when it's clean, so keep it tidy!
 *
 * UPDATE 4/20/2016 BLAZE IT!!!
 * Sora is now using Discord's main API!
 *
 * Use this link to get others to add her to their servers:
 * https://discordapp.com/oauth2/authorize?&client_id=172474398308040704&scope=bot&permissions=0
 *
 * Last note - See README.md for more details!
 *
 * Happy Blick Winkel! ;-) <3
 *
 */

/**
 * === Instanciation ===
 */

// Core JS file with all of Sora's Components.
var soracore = require('./soracore');

// Sora instanciation.
global.soraclient = new soracore.SoraClient(require('./settings'));
