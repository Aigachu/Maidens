class TimeoutHandler {

	constructor(client) {
		this.client = client;

		this.timeouts = {};
	}

	watch(guild) {
		this.client.listeners.watchdog = {
			listen: (client, msg) => {
				// Add messages to watchdog and do all necessary actions in here.
			},
		}
	}

	timeout(member) {
		member.addRole(member.guild.roles.find('name', 'Colette::Timeout'));
		return;
	}
}

module.exports = TimeoutHandler;