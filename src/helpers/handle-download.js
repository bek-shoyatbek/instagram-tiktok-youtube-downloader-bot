import axios from "axios";
import { getVideoInfo } from "./get-video-info.js";
import { InputFile } from "grammy";

export async function handleDownload(ctx, url) {
    try {
        const videoInfo = await getVideoInfo(url);

        const videoTitle = videoInfo?.title.replace(/[\W_]+/g, "_") || new Date().toDateString();



        console.log("videoTitle", videoTitle)

        if (videoInfo.success && videoInfo.links && videoInfo.links.length > 0) {
            await ctx.reply("File is processing...")
            // Prefer HD video if available, otherwise use the first available link
            const downloadLink = videoInfo.links.find(link => link.quality === 'video_hd_original_0')?.link
                || videoInfo.links[0].link;




            if (downloadLink) {
                const response = await axios.get(downloadLink, { responseType: "arraybuffer" });
                const fileBuffer = Buffer.from(response.data, "binary");



                await ctx.replyWithVideo(new InputFile(fileBuffer, videoTitle + ".mp4"));

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