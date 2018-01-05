/**
 * Class [Twitch]
 *
 * This class defines the properties of the [Twitch] plugin.
 *
 * This plugin exposes and extends features having to do with Twitch.TV.
 * Note that it integrates directly with Discord, and has nothing to do with Twitch Chat bots.
 *
 * @TODO - Clean this SHIT UP. IT'S SO DIRTY.
 *
 */
class Twitch {
    
    constructor(client) {
        
        // The Maiden client.
        this.client = client;
        
        // Role and configuration setup
        this.build();
        
        // Set listener.
        this.listen();
    
        // Set the pinger.
        // The pinger is basically a function that will run every *minute* to check if a stream must be
        // fired. This is intensive, I know, but it's the best (first) way I thought of doing this.
        setInterval(() => {
            this.ping();
        }, 60000);
        
    }
    
    /**
     *
     */
    ping() {
        this.client.guilds.every((guild) =>{
           // TTVAnn
           if (this.guilds[guild.id].ttvann.enabled) {
               // If there is no announcement channel set for this guild, we do nothing.
               if (this.guilds[guild.id].ttvann.ann_channel === null)
                   return true;
               
               // If there are no streams to announce, we do nothing.
               if (_.isEmpty(this.guilds[guild.id].ttvann.streams))
                   return true;
    
               // If we pass all the checks, we run ttvann.
               this.ttvann(this.guilds[guild.id].ttvann);
           }
           return true;
        });
    }
    
    /**
     *
     * @param guild
     */
    ttvann(guild) {
        guild.streams.every((stream_user) => {
            this.getUserStream(stream_user).then((data) => {
                if (data.stream !== null)  {
                    this.ttvannFire(guild, data.stream, stream_user)
                } else {
                    this.ttvannRemoveStreamLive(guild.id, stream_user);
                    this.save();
                }
               return true;
            });
            return true;
        });
    }
    
    /**
     *
     * @param guild
     * @param stream_data
     */
    ttvannFire(guild, stream_data, stream_user) {
        
        if (guild.live.indexOf(stream_user) > -1)
            return;
        
        let announcement_channel = this.client.channels.find('id', guild.ann_channel);
        
        let name = stream_data.channel.display_name;
        let game = stream_data.game;
        let url = stream_data.channel.url;
        
        announcement_channel.send(`Hey @here! ${name} is streaming ${game} on Twitch! Come take a look! :eyes: ${url}`);
        this.ttvannAddStreamLive(guild.id, stream_user);
        this.save();
    }
    
    /**
     *
     * @param guild_id
     * @param stream_user
     */
    ttvannAddStream(guild_id, stream_user) {
        this.guilds[guild_id].ttvann.streams.push(stream_user);
        this.save();
    }
    
    /**
     *
     * @param guild_id
     * @param stream_user
     */
    ttvannAddStreamLive(guild_id, stream_user) {
        this.guilds[guild_id].ttvann.live.push(stream_user);
        this.save();
    }
    
    /**
     *
     * @param guild_id
     * @param channel_id
     */
    ttvannSetAnnChannel(guild_id, channel_id) {
        this.guilds[guild_id].ttvann.ann_channel = channel_id;
        this.save();
    }
    
    /**
     *
     * @param guild_id
     * @param stream_user
     */
    ttvannRemoveStream(guild_id, stream_user) {
        this.guilds[guild_id].ttvann.streams.splice(this.guilds[guild_id].ttvann.streams.indexOf(stream_user), 1);
        this.guilds[guild_id].ttvann.live.splice(this.guilds[guild_id].ttvann.live.indexOf(stream_user), 1);
        this.save();
    }
    
    /**
     *
     * @param guild_id
     * @param stream_user
     */
    ttvannRemoveStreamLive(guild_id, stream_user) {
        this.guilds[guild_id].ttvann.live.splice(this.guilds[guild_id].ttvann.live.indexOf(stream_user), 1);
        this.save();
    }
    
    /**
     * Listener for the Watchdog plugin.
     * This listener will determine what the Watchdog will do upon receiving messages.
     */
    listen() {
        // We need to add a ready around this, or else the client will not be set when we try to push the listener.
        this.client.on('ready', () => {
            
            // Add listener to client.
            this.client.listeners.push({
                // Push the listener's listen function.
                listen: (client, message) => {
                    
                    // Add listener functionality here...
                },
                
            });
            
            
        });
    }
    
    /**
     * Enable the Watchdog in a given guild.
     * @param feature
     * @param  {Guild} guild Guild to enable the Watchdog in.
     */
    enable(feature, guild) {
        this.guilds[guild.id][feature].enabled = true;
        this.save();
        return true;
    }
    
    /**
     * Disable the Watchdog in a given guild.
     * @param feature
     * @param  {Guild} guild Guild to disable the Watchdog in.
     */
    disable(feature, guild) {
        this.guilds[guild.id][feature].enabled = false;
        this.save();
        return false;
    }
    
    /**
     * Get the status of the Watchdog in a given guild.
     * @param feature
     * @param  {Guild} guild Guild to get the Watchdog status from.
     */
    status(feature, guild) {
        return this.guilds[guild.id][feature].enabled;
    }
    
    /**
     * Save configurations.
     */
    save() {
        fs.writeFileSync(this.config_path, JSON.stringify(this.guilds, null, 2));
    }
    
    /**
     * Build core Watchdog necessities.
     */
    build() {
        
        // A ready container is needed her since this is done on construction.
        // We can only manipulate guilds after the client is ready.
        this.client.on('ready', () => {
            // Make configuration directory if it doesn't exist.
            let config_dir = this.client.coreroot + 'plugins/twitch/config';
            if (!fs.existsSync(config_dir)) {
                fs.mkdirSync(config_dir);
            }
    
            // Get path to the appropriate configuration directory or make it if it
            // doesn't exist.
            let desired_config_dir = this.client.coreroot + 'plugins/twitch/config/' + this.client.maiden_name;
            if (!fs.existsSync(desired_config_dir)) {
                fs.mkdirSync(desired_config_dir);
            }
    
            // Store path to the configuration in the Watchdog object.
            this.config_path = desired_config_dir + '/guilds.json';
    
            // Build Configurations and store them in the Watchdog.
            this.guilds = {};
    
            // If the configurations already exist, load them.
            if (fs.existsSync(this.config_path)) {
                this.guilds = JSON.parse(fs.readFileSync(this.config_path));
            }
    
            // If the configurations were loaded, we'll stop here.
            if (!_.isEmpty(this.guilds)) {
                console.log('Maiden Twitch: Loaded guild config from files.');
            } else {
                // If the configurations couldn't be loaded, we'll initialize them here and save them to the config path.
                console.log('Maiden Twitch: Guild config not found. Created default guild config.');
                this.client.guilds.every((guild) => {
                    this.guilds[guild.id] = {
                        ttvann: {
                            id: guild.id,
                            enabled: false,
                            streams: [],
                            ann_channel: null,
                            live: [],
                        }
                    };
                    return true;
                });
            }
    
            // Save guild configurations.
            this.save();
        });
    }
    
    /**
     *
     * @param name
     */
    getUserByName(name) {
        return new Promise((resolve, reject) => {
            twitch.users.usersByName({users: [name]}, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.users[0]);
                }
            });
        });
    }
    
    /**
     *
     * @param user
     */
    getUserStream(user) {
        return new Promise((resolve, reject) => {
            if (typeof user !== 'object') {
                this.getUserByName(user).then((result) => {
                   resolve(this.getUserStream(result));
                });
            } else {
                resolve(this.getStreamData(user._id));
            }
        });
    }
    
    /**
     *
     * @param id
     * @returns {Promise}
     */
    getStreamData(id) {
        return new Promise((resolve, reject) => {
            twitch.streams.channel({channelID: id}, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

module.exports = Twitch;