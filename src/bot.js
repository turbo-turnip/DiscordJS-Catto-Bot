const discord = require('discord.js');
const { readFile, writeFile } = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const client = new discord.Client();

client.on('ready', () => {
    console.log(`Hello, ${client.user.username}! How are you today?`);
});

let currentKitty = "";

client.on('message', message => {
    if (message.content === 'kitty plz') {
        fetch("https://api.thecatapi.com/v1/images/search")
            .then(response => response.json())
            .then(response => {
                currentKitty = response[0].url;
                const embed = new discord.MessageEmbed()
                    .setTitle('coot floof')
                    .setColor('#0099ff')
                    .setImage(currentKitty);
                message.channel.send(embed);
            });
    } else if (message.content === 'aw so coot') {
        if (currentKitty !== "") {
            readFile("src/kitties.json", (_, data) => {
                const kitties = JSON.parse(data);
                kitties.unshift(currentKitty);
                writeFile("src/kitties.json", JSON.stringify(kitties, null, 2), e => {
                    e ? message.channel.send("oh noes there be a problem when adding kitter to favorites :cry:") :
                    message.channel.send("coot kitter added to favorites! :smiley_cat:");
                });
            });
        } else message.channel.send('there be no catto to add to favorites! :(');
    } else if (message.content.search(/plz show [1-9] coot floofs?/gm) > -1) {
        readFile("src/kitties.json", (_, data) => {
            const kitties = JSON.parse(data);
            const kittiesToShow = parseInt(message.content.replace(/(plz show )|( coot floofs?)/gm, ''));
            const cootFloofs = kitties.slice(0, kittiesToShow);
            message.channel.send(`${kittiesToShow} coot floofs`, {
                files: cootFloofs
            });
        });
    } else if (message.content === 'help floof') {
        const embed = new discord.MessageEmbed()
            .setTitle('help!!')
            .setColor('#ffff00')
            .addFields(
                { name: 'kitty plz', value: 'This command will show a picture of a coot floof!' },
                { name: 'help floof', value: 'This command will show you this embed that you are seeing!' },
                { name: 'aw so coot', value: 'This command will save the previous catto pic to your favorites!' },
                { name: 'plz show 5 coot floofs', value: 'This command will show the number you typed in as the amount of floof pictures in your favorites.'}
            );
        message.channel.send(embed);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);