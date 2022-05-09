/* Discord porting soon! */

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require('./config.json');
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.content === '.ping') {
    message.channel.send('pong');
  }
  if (message.content === '.start') {
    message.channel.send('Hello There! 🤗\nWelcome to Weblookup bot! (Discord porting)\nYou can check status of website by using Telegram!\n\n-/start - Welcome to bot!\n-/upordown - Check this website are up or down?\n-/screenshot - Screenshot Webpage\n-/fullpagescreenshot - Screenshot Webpage with full page\n-/record - Recording Video while Webpage is loading.\n\nAzure Sign up Bot (Demo)\n\n-/devplan email:pass - Auto register azure (Developer plan)\n\nWARNING: MAKE SURE YOUR DONE AZURE REGISTER STEP! (Legal info, Number phone verfiy, Payment Methods)\n\n\nDeveloper: https://t.me/MeowKawaiiii');
  }
});

client.login(config.discord_token);