//Create discord bot using open api

require('dotenv').config();

// prepare to connect to discord api

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Prepare conn towards  OpenAI Api

const { Configuration , OpenAIApi } = require('openai');

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,

});

const openai = new OpenAIApi(configuration);

// check for messages on discord

client.on('messageCreate', async function(message){
    try {
        // dont respond to yourself or other bots
        if(message.author.bot) return;
        if(message.content.startsWith("!zip")) {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message.author.username + ": " + message.content + "\n",
            temperature: 0.5,
            max_tokens: 150,
            stop: [" Human:", " AI:"],
        });
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    }
        //check for error msg
    } catch(err){
        console.log(err)
    }
});

// Log 

client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is online on discord")