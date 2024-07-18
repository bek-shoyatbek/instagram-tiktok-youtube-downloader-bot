import fs from "fs";
import axios from "axios";


export async function downloadInstagram(ctx, url) {
    // Note: You'll need to use a third-party API or service to download Instagram content
    // This is a simplified example and may not work due to Instagram's restrictions
    try {
        console.log(url);
        const response = await axios.get(url);
        const videoUrl = extractVideoUrl(response.data);
        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });

        const fileName = `instagram_video_${Date.now()}.mp4`;
        fs.writeFileSync(fileName, videoResponse.data);

        await ctx.replyWithVideo({ source: fileName });
        fs.unlinkSync(fileName);
    } catch (error) {
        console.error('Instagram download error:', error);
        ctx.reply('Failed to download Instagram content.');
    }
}

function extractVideoUrl(html) {
    // Implement logic to extract video URL from Instagram page HTML
    // This is a placeholder and won't work as-is
    const match = html.match(/<meta property="og:video" content="(.+?)"/);
    return match ? match[1] : null;
}