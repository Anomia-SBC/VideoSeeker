const { config } = require('dotenv')
const axios = require('axios')
const { Webhook } = require('simple-discord-webhooks');
const webhook = new Webhook(process.env.WEBHOOK);

config()
let lastVideo = {};
axios.default.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&channelId=${process.env.CHANNEL_ID}&part=snippet,id&order=date&maxResults=200`).then((response) => {
    console.log(`Fetched the latest video. Starting to fetch...`)
    lastVideo = response.data.items[0]
})



setInterval(async () => {
    console.log(`${Date.now()} - Fetching latest videos...`)
    let { data } = await axios.default.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&channelId=${process.env.CHANNEL_ID}&part=snippet,id&order=date&maxResults=200`)
    let lastFetchedVideo = data.items[0]
    if (lastVideo.id.videoId != lastFetchedVideo.id.videoId) {
        console.log(`${Date.now()} - New Video found!`)
        await webhook.send("@everyone", [{
            title: "New PlanetCast Video",
            description: "PlanetCast has released a new video!",
            video: {
                url: `http://www.youtube.com/watch?v=${lastFetchedVideo.id.videoId}`
            }
        }])
        lastVideo = lastFetchedVideo
    }
}, 5000)