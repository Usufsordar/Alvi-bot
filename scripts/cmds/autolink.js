const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

function loadAutoLinkStates() {
  try {
    const data = fs.readFileSync("autolink.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveAutoLinkStates(states) {
  fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports = {
  config: {
    name: 'autolink',
    version: '1.1',
    author: 'Aminulsordar',
    countDown: 5,
    role: 0,
    shortDescription: 'Auto-download video from link',
    category: 'media',
    guide: {
      en: '[autolink on/off] — Enable or disable auto link video downloading for this thread.'
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    const input = args[0]?.toLowerCase();

    if (input === "on") {
      autoLinkStates[threadID] = true;
      saveAutoLinkStates(autoLinkStates);
      return api.sendMessage("✅ Auto link download has been *enabled* for this thread.", threadID);
    }

    if (input === "off") {
      autoLinkStates[threadID] = false;
      saveAutoLinkStates(autoLinkStates);
      return api.sendMessage("❌ Auto link download has been *disabled* for this thread.", threadID);
    }

    return api.sendMessage("Use: autolink on/off", threadID);
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const message = event.body;

    if (!autoLinkStates[threadID]) return;

    const linkMatch = message.match(/(https?:\/\/[^\s]+)/);
    if (!linkMatch) return;

    const url = linkMatch[0];
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    api.sendMessage("Downloading for you...", threadID, event.messageID);

    try {
      const res = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`);
      if (!res.data.data || (!res.data.data.high && !res.data.data.low)) {
        return api.sendMessage("⚠️ Couldn't fetch the video. Try another link.", threadID, event.messageID);
      }

      const { title, high, low } = res.data.data;
      const videoUrl = high || low;
      const msg = `《 TITLE 》🎬 : *${title}*`;

      request(videoUrl)
        .pipe(fs.createWriteStream("video.mp4"))
        .on("close", () => {
          api.sendMessage({
            body: msg,
            attachment: fs.createReadStream("video.mp4")
          }, threadID, () => fs.unlinkSync("video.mp4"));
        });
    } catch (err) {
      console.error("Error fetching video:", err);
      api.sendMessage("❌ Error while fetching video. Please try again later.", threadID, event.messageID);
    }
  }
};
