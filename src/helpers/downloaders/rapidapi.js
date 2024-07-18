import https from 'https';
import "dotenv/config";


const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export function getVideoInfo(url) {
    return new Promise((resolve, reject) => {
        const encodedUrl = encodeURIComponent(url);
        const options = {
            method: 'GET',
            hostname: 'social-media-video-downloader.p.rapidapi.com',
            port: null,
            path: `/smvd/get/all?url=${encodedUrl}`,
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
            }
        };

        const req = https.request(options, function (res) {
            const chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res.on('end', function () {
                const body = Buffer.concat(chunks);
                try {
                    const parsedData = JSON.parse(body.toString());
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', function (error) {
            reject(error);
        });

        req.end();
    });
}

// Usage example
export async function downloadVideo(url) {
    try {
        const videoInfo = await getVideoInfo(url);
        console.log('Video information:', videoInfo);
        // Here you would typically process the videoInfo to get the download URL
        // and then download the video file
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
// downloadVideo('https://www.instagram.com/reel/abcdefg123456/');