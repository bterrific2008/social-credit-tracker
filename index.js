// Require the necessary discord.js classes
const fs = require('fs');
const { Op } = require('sequelize');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');
const { Users } = require('./dbObjects');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.currency = new Collection();

/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue On the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */

Reflect.defineProperty(client.currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
        console.log('add -------');
        console.log(`amount: ${typeof amount}, ${amount}`);
		const user = client.currency.get(id);
		if (user) {
			user.balance += Number(amount);
            console.log(`${user.balance}`);
            return user.save();
		}
        
		const newUser = await Users.create({ user_id: id, balance: amount });
        console.log(`newUser.balance:${typeof newUser.balance} ${newUser.balance}`);
		client.currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(client.currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = client.currency.get(id);
		return user ? user.balance : 0;
	},
});

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => client.currency.set(b.user_id, b));
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);
