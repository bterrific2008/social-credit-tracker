const { captureRejectionSymbol } = require('events');
const fs = require('fs');
const Users = require('../dbObjects.js');
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const data = fs.readFileSync('./scores.json', 'utf8');
		client.socialCreditScores = JSON.parse(data);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};