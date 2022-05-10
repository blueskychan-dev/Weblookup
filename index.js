const { Telegraf } = require('telegraf');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const fullPageScreenshot = require("puppeteer-full-page-screenshot").default;
const http = require('https');
var request = require('request');
var config = require('./config.json');
const fs = require('fs');
const ytdl = require('ytdl-core');
const bot = new Telegraf(config.telegram_token);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let version = "0.1.1";
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello There! 🤗\nWelcome to Weblookup bot!\nYou can check status of website by using Telegram!\n\n-/start - Welcome to bot!\n-/upordown - Check this website are up or down?\n-/screenshot - Screenshot Webpage\n-/fullpagescreenshot - Screenshot Webpage with full page\n-/record - Recording Video while Webpage is loading.\n\nAzure Sign up Bot (Demo)\n\n-/devplan email:pass - Auto register azure (Developer plan)\n\nWARNING: MAKE SURE YOUR DONE AZURE REGISTER STEP! (Legal info, Number phone verfiy, Payment Methods)\n\nVideo manager\n\n-/ytvideo <URL> - Download youtube video to Telegram\n\nOff topic\n\n-/botcheck - Check Bot info, version, etc.\n\nDeveloper: https://t.me/MeowKawaiiii', {
    })
})
bot.command('upordown', ctx => {
    console.log(ctx.from)
    let url = ctx.message.text.substring(10);
    console.log(url);
    if (url == ""){
      bot.telegram.sendMessage(ctx.chat.id, "❌Failed to Checking❌\n\nDue to user didn't tell a target server or url")
    }
    else{
      if (url.startsWith("http")){

      }
      else{
        url = "http://" + url;
      }
        request(url , function (error, response, body) {

            if(error){
              console.error('Err: '+ error);
              bot.telegram.sendMessage(ctx.chat.id,"❌Error While Checking❌\n\nLog: " + error + "\n\nBut no worry this log been report to developer.")
              return false;
            }
          
          if(response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 202){
            bot.telegram.sendMessage(ctx.chat.id,"✅Checking success✅\n\nStatus: 200 (Website is up!!!)\nHost: " + url + "\n\nCheck by: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii")
            return false;
          }
          
          if(response.statusCode == 301 || response.statusCode == 302){
            bot.telegram.sendMessage(ctx.chat.id,"✅Checking success✅\n\nStatus: 301 (Website just redirecting.)\nHost: " + url + "\n\nCheck by: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii")
            return false;
          }
          
          if(response.statusCode == 401){
            bot.telegram.sendMessage(ctx.chat.id,"✅Checking success✅\n\nStatus: 401 (You are unauthorized.)\nHost: " + url + "\n\nCheck by: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii")
            return false;
          }
          if(response.statusCode == 404){
            bot.telegram.sendMessage(ctx.chat.id,"✅Checking success✅\n\nStatus: 404 (Page not found!)\nHost: " + url + "\n\nCheck by: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii")
            return false;
          }else{
            bot.telegram.sendMessage(ctx.chat.id,"✅Checking success✅\n\nStatus: " + response.statusCode + " (Maybe down?, Unknown)\nHost: " + url + "\n\nCheck by: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii")
          }
        });
    }
})

bot.command('fullpagescreenshot', ctx => {
    console.log(ctx.from)
    let url = ctx.message.text.substring(20);
    if (url == ""){
        bot.telegram.sendMessage(ctx.chat.id,"❌Failed to Screenshot❌\n\nDue to user didn't tell a target server or url")
    }
    else{
      if (url.startsWith("http")){

      }
      else{
        url = "http://" + url;
      }
        bot.telegram.sendMessage(ctx.chat.id,'📸Screenshot process been starting...📸\n⏰This will take time to screenshot....⏰');
          (async () => {
            try
            {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({ width: 800, height: 600 });
            await page.goto(url);
            await delay(3000);
            await fullPageScreenshot(page, { path:'./images/' + ctx.from.username + '.png' });
            await browser.close();
            ctx.replyWithDocument({ source:'./images/' + ctx.from.username + '.png' }, {caption: "✅Screenshot success✅\nHost: " + url + "\n\nScreenshot By: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii"});
            }
            catch (e){
              console.error(e);
          bot.telegram.sendMessage(ctx.chat.id,"Failed to Screenshot! With error: " + e)
            }
         })();
    }
})

bot.command('screenshot', ctx => {
  console.log(ctx.from)
  let url = ctx.message.text.substring(12);
  if (url == ""){
      bot.telegram.sendMessage(ctx.chat.id,"❌Failed to Screenshot❌\n\nDue to user didn't tell a target server or url")
  }
  else{
    if (url.startsWith("http")){
      bot.telegram.sendMessage(ctx.chat.id,'📸Screenshot process been starting...📸\n⏰This will take time to screenshot....⏰');
    }
    else{
      url = "http://" + url;
      bot.telegram.sendMessage(ctx.chat.id,'📸Screenshot process been starting...📸\n⏰This will take time to screenshot....⏰');
    }
        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setViewport({ width: 800, height: 600 });
          try{
          await page.goto(url);
          await delay(3000);
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          await browser.close();
          ctx.replyWithPhoto({ source: './images/' + ctx.from.username + '.png' }, {caption: "✅Screenshot success✅\nHost: " + url + "\n\nScreenshot By: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii"});
          }
          catch(e){
            console.error(e);
            bot.telegram.sendMessage(ctx.chat.id,"Failed to Screenshot! With error: " + e)
          }
       })();
  }
})
bot.command('record', ctx => {
  console.log(ctx.from)
  let url = ctx.message.text.substring(8);
  if (url == ""){
      bot.telegram.sendMessage(ctx.chat.id,"❌Failed to Recording❌\n\nDue to user didn't tell a target server or url")
  }
  else{
    if (url.startsWith("http")){

    }
    else{
      url = "http://" + url;
    }
      bot.telegram.sendMessage(ctx.chat.id,'📸Record page process been starting...📸\n⏰This will take time to Recording....⏰');
        (async () => {
          try
          {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          const recorder = new PuppeteerScreenRecorder(page);
          const SavePath = './videos/' + ctx.from.username + '.mp4';
          await recorder.start(SavePath);
          await page.goto(url);
          await delay(3000);
          await recorder.stop();
          await browser.close();
          ctx.replyWithVideo({ source: './videos/' + ctx.from.username + '.mp4' }, {caption: "✅Recording success✅\nHost: " + url + "\n\nEvent By: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii"});
          }
          catch(e){
            console.error(e);
          bot.telegram.sendMessage(ctx.chat.id,"Failed to Recording! With error: " + e)
          }
       })();
  }
})

bot.command('devplan', ctx => {
  console.log(ctx.from)
  let userpass = ctx.message.text.substring(9);
  let logininfo = userpass.split(":");
  if (userpass == ""){
    bot.telegram.sendMessage(ctx.chat.id, "email:pass is null!")
  }
  else
      bot.telegram.sendMessage(ctx.chat.id,'📸Hacking process been starting...📸\n⏰This will take time to Hacking....⏰');
        let url = "https://signup.azure.com/signup?offer=MS-AZR-0043P&appId=IbizaCatalogBlade";
        (async () => {
          try{
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          const recorder = new PuppeteerScreenRecorder(page);
          const SavePath = './videos/' + ctx.from.username + '.mp4';
          await recorder.start(SavePath);
          console.log("Go to azure signup");
          await page.goto(url);
          await delay(3000);
          await page.type('input[id=i0116]', `${logininfo[0]}`, {delay: 10})
          console.log("input a email.");
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          await page.click('[id="idSIButton9"]');
          await delay(3000);
          console.log("input a password.");
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          await page.type('input[id=i0118]', `${logininfo[1]}`, {delay: 20})
          await page.click('[id="idSIButton9"]')
          await delay(2000);
          console.log("Clicking Yes")
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          await page.click('[id="idSIButton9"]')
          console.log("Sleep for 15 sec");
          await delay(15000);
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          console.log("Clicking agree terms")
          await page.click('[id="accept-terms"]')
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          console.log("Clicking Next")
          await page.click('[id="accept-terms-submit-button"]')
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          await page.evaluate(() => {
            document.getElementById("accept-terms").click();
            document.getElementById("accept-terms-submit-button").click();
        });
        await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          await delay(9000);
          await page.click('[id="signup-button"')
          console.log("Clicking Submit")
          await page.evaluate(() => {
            document.getElementById("signup-button").click();
        });
        console.log("Sleep for 19 sec")
          await delay(19000);
          console.log("Success.")
          await page.screenshot({ path: './images/' + ctx.from.username + '.png' });
          ctx.replyWithPhoto({source: './images/' + ctx.from.username + '.png'})
          await recorder.stop();
          await browser.close();
          ctx.replyWithVideo({ source: './videos/' + ctx.from.username + '.mp4' }, {caption: "✅Recording success✅\nHost: " + url + "\n\nEvent By: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii"});
      }
      catch(e){
        console.error(e);
        bot.telegram.sendMessage(ctx.chat.id,"Failed to Hacking! With error: " + e)
        bot.telegram.sendPhoto(ctx.chat.id, {source: './images/' + ctx.from.username + '.png'});
    }
      })();
})

bot.command('ytvideo', ctx => {
  console.log(ctx.from)
  let url = ctx.message.text.substring(9);
  if (url == ""){
    bot.telegram.sendMessage(ctx.chat.id, "ERROR: Your didn't tell a video url.")
  }
  else{
    bot.telegram.sendMessage(ctx.chat.id, "This will take a time to downloading a yt video.\nIf Video won't sending? check this\n-Make sure url,format are correct like: /ytvideo https://www.youtube.com/watch?v=xxXxxxXxxX or xxXxxxXxxX\n-Make sure video didn't too long or 4K,8K because file is too big, Telegram are limited file for bot (60 mb)\n-Still error? Please asking Developer, Hosting for more info. (unoffical bot will take time to update)")
      ytdl(url, {filter: 'audioandvideo'}).pipe(fs.createWriteStream(('./videos/' + ctx.from.username+ '.mp4')).on("finish", function() {
        console.log("Finished!");
        ctx.replyWithVideo({ source: './videos/' + ctx.from.username + '.mp4' }, {caption: "✅Download Youtube Video Success✅\n\n\nEvent By: @" + ctx.from.username + "\nDeveloper: @MeowKawaiiii"});
  }));
}
})

process.on('uncaughtException', function (err) {
  console.error(err);
console.log("This is pid " + process.pid);
setTimeout(function () {
    process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit();
}, 5000);
});

bot.command('botcheck', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, "Checking Please wait....");
  const file = fs.createWriteStream("botinfo.json");
const request = http.get("https://raw.githubusercontent.com/fusedevgithub/Weblookup-Botinfo/main/checkinfo.json", function(response) {
   response.pipe(file);
   file.on("finish", () => {
       file.close();
       const botinfo = require("./botinfo.json");
       let offical;
       let trusted;
       let outofdated = true;
       if (bot.botInfo.username == botinfo.Offical_Bot_ID){
         offical = true;
       }
       if (bot.botInfo.username == botinfo.Offical_Bot_ID){
        offical = true;
      }
      if (bot.botInfo.username == botinfo.Partner_ID){
        let trusted = true;
      }
      if (version == botinfo.Version){
        outofdated = false;
      }
      if (offical = true){
        bot.telegram.sendMessage(ctx.chat.id, "✅Check been successfully✅\nThis is offical bot! : Mean this bot will fastest to update and patching bugs.\n\nDeveloper: @MeowKawaiiii");
      }
      else if (trusted = true){
        if (outofdated == true){
        bot.telegram.sendMessage(ctx.chat.id, "✅Check been successfully✅\nThis is Trusted bot! : Mean this bot been Partner! Ask before use.\nBut this bot are outofdated! Please contect a owner bot to fixing it.\n\nDeveloper: @MeowKawaiiii");
        }
        else{
          bot.telegram.sendMessage(ctx.chat.id, "✅Check been successfully✅\nThis is Trusted bot! : Mean this bot been Partner! Ask before use.\n\nDeveloper: @MeowKawaiiii");
        }
      }
      else{
        if (outofdated == true){
        bot.telegram.sendMessage(ctx.chat.id, "✅Check been successfully✅\nThis is Unknown! : Mean this bot is leaks from original, This bot always have modify or bad thing...\nI will not help you if found any bugs or issues.\nAlso This bot are out of dated!\n\nDeveloper: @MeowKawaiiii");
        }
        else
        {
          bot.telegram.sendMessage(ctx.chat.id, "✅Check been successfully✅\nThis is Unknown! : Mean this bot is leaks from original, This bot always have modify or bad thing...\nI will not help you if found any bugs or issues.\n\nDeveloper: @MeowKawaiiii");
        }
      }
   });
});
})
try{
    bot.launch();
}
catch(e){
    console.error("Bot unable to start with error: " + e)
}
finally{
    console.log("Bot been deployed and running.")
}