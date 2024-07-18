import 'dotenv/config'
import { Bot } from 'grammy';
import { handleDownload } from './helpers/handle-download.js';
import { isValidUrl } from './helpers/validate-url.js';


const bot = new Bot(process.env.BOT_TOKEN);

bot.command('start', (ctx) => ctx.reply('Welcome! Send me an Instagram , TikTok or YouTube link to download the video'));

bot.on('message:text', async (ctx) => {
    const url = ctx.message.text;

    if (isValidUrl(url))
        return await handleDownload(ctx, url);

    return ctx.reply("Please send Instagram, TikTok or Youtube links");
});




bot.start();