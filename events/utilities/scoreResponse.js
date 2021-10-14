const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const Sequelize = require('sequelize');

const attributeSettings = new Map();
attributeSettings.set(
    'negative', 
    {
        'imageFilePath': './images/minus_social_credit.png',
        'xPosition': 210,
        'yPosition': 110,
        'prefix': '-',
    }
    );
attributeSettings.set(
    'positive',
    {
        'imageFilePath': './images/plus_social_credit.png',
        'xPosition': 175,
        'yPosition': 85,
        'prefix': '+',
    }
    );

let createSocialCreditImage = async function(score, attribute) {
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    let params = attributeSettings.get(attribute);
    const background = await Canvas.loadImage(params.imageFilePath);

	// This uses the canvas dimensions to stretch the image onto the entire canvas
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Write "Awesome!"
    ctx.fillStyle = 'white';
    ctx.font = 'bold 62px Arial'
    ctx.fillText(`${params.prefix}${score}`, params.xPosition, params.yPosition)

	// Use the helpful Attachment class structure to process the file for you
	const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

	return attachment;
}

let scoreResponse = async function (message, reaction, client) {
    // get the appropriate server's scores
    reaction = (Object.prototype.hasOwnProperty.call(reaction, message.guildId)) ? reaction[message.guildId] : reaction['default'];

    // get the corresponding action for a term
    const scoreKeys = Object.keys(reaction);
    const responseActions = scoreKeys.filter(
        value => message.content.indexOf(value) !== -1,
    );

    console.log(message.content);
    let response;
    for (response of responseActions) {
        let attribute = reaction[response]['attribute'];
        let score = reaction[response]['score'];
        let sign = reaction[response]['sign'];
        let product = (score*sign);
        let attachment = await createSocialCreditImage(score, attribute);

        console.log(`${typeof product}`);
        client.currency.add(message.author.id, product);
     
        message.reply({ files: [attachment] });
    }
}

module.exports = {
	scoreResponse: scoreResponse
};