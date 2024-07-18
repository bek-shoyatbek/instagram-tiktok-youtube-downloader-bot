import 'dotenv/config'
import { Bot, InputFile } from 'grammy';
import { getVideoInfo } from './helpers/downloaders/rapidapi.js';
import axios from 'axios';


const bot = new Bot(process.env.BOT_TOKEN);

bot.command('start', (ctx) => ctx.reply('Welcome! Send me an Instagram or TikTok link to download the video/music.'));

bot.on('message:text', async (ctx) => {
    const url = ctx.message.text;
    if (isValidUrl(url)) {
        await handleDownload(ctx, url);
    } else {
        ctx.reply('Please send a valid Instagram or TikTok URL.');
    }
});

bot.on('message:text', async (ctx) => {
    const url = ctx.message.text;
    if (isValidUrl(url)) {
        await handleDownload(ctx, url);
    } else {
        ctx.reply('Please send a valid Instagram or TikTok URL.');
    }
});

function isValidUrl(url) {
    // Implement URL validation logic here
    return url.includes('instagram.com') || url.includes('tiktok.com');
}


async function handleDownload(ctx, url) {
    try {
        const videoInfo = await getVideoInfo(url);

        const fileType = videoInfo?.stats?.is_video;

        if (videoInfo.success && videoInfo.links && videoInfo.links.length > 0) {
            console.log("videoInfo", videoInfo)
            // Prefer HD video if available, otherwise use the first available link
            const downloadLink = videoInfo.links.find(link => link.quality === 'video_hd_original_0')?.link
                || videoInfo.links[0].link;




            if (downloadLink) {
                await ctx.reply("File is processing...")
                const response = await axios.get(downloadLink, { responseType: "arraybuffer" });
                const fileBuffer = Buffer.from(response.data, "binary");



                await ctx.replyWithDocument(new InputFile(fileBuffer, "filename.mp4"));

            } else {
                ctx.reply('Failed to get download URL for the video.');
            }
        } else {
            ctx.reply('Failed to retrieve video information.');
        }
    } catch (error) {
        console.error('Download error:', error);
        ctx.reply('An error occurred while processing your request.');
    }
}

bot.start();