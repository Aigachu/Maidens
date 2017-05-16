/**
 * Run File for Sora's main functionalities.
 * This file is used to manage connection to discord as well as to bring together
 * all other parts of Sora. Ideally, this file will remain clean, and will pull
 * in data and functions through module exports and requires.
 *
 * We will also be setting globals in this file for use across the application.
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

// Sora class.
var SoraClient = require(soraspace + 'SoraClient');

// Sora instance.
var sora = new SoraClient();

// Login to Discord after processing all the code above.
sora.soraLogin();
