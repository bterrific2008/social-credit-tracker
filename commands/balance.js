module.exports = {
	name: 'balance',
	description: "Replies the User's current Social Credit Score",
	async execute(interaction, client) {
		const target = interaction.options.getUser('user') || interaction.user;
		await interaction.reply(
			`${target.tag} has ${client.currency.getBalance(target.id)} social credit points.`
		);
	},
};