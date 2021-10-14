const fs = require('fs');
const { scoreResponse } = require('./utilities/scoreResponse');
module.exports = {
	name: 'messageCreate',
	execute(message, client) {
		scoreResponse(message, client.socialCreditScores, client);
	},
};