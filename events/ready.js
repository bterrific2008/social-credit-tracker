const fs = require('fs');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const data = fs.readFileSync('./scores.json', 'utf8');
		client.socialCreditScores = JSON.parse(data);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};