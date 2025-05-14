const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");
const Canvas = require("canvas");
const pidusage = require("pidusage");

const FONT_PATHS = {
  avo: path.join(__dirname, "cache", "UTM-Avo.ttf"),
  pheno: path.join(__dirname, "cache", "phenomicon.ttf"),
  caviar: path.join(__dirname, "cache", "CaviarDreams.ttf")
};

// Register fonts
Canvas.registerFont(FONT_PATHS.avo, { family: "Avo" });
Canvas.registerFont(FONT_PATHS.pheno, { family: "Phenomicon" });
Canvas.registerFont(FONT_PATHS.caviar, { family: "Caviar" });

// Preload background image
let cachedBG = null;
Canvas.loadImage("https://i.ibb.co/gZDJmP98/blue-clouds-day-fluffy-53594.jpg")
  .then(img => cachedBG = img)
  .catch(err => console.error("Failed to load background:", err));

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up"],
    version: "2.1",
    author: "AminulDev",
    role: 0,
    shortDescription: "Show bot uptime with styled panel",
    longDescription: "Displays bot and system uptime with a stylish graphic and background.",
    category: "system",
    guide: "{p}uptime"
  },

  onStart: async function ({ api, event }) {
    try {
      if (!cachedBG) {
        return api.sendMessage("⚠️ Background not loaded yet. Try again shortly.", event.threadID);
      }

      const timeStart = Date.now();

      // Uptime
      const uptime = process.uptime();
      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      const timeFormat = `${d}d ${h}h ${m}m ${s}s`;

      // System stats
      const usage = await pidusage(process.pid);
      const memory = (usage.memory / 1024 / 1024).toFixed(2);
      const cpu = usage.cpu.toFixed(1);
      const chips = os.cpus()[0].model;
      const speed = os.cpus()[0].speed;
      const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
      const usedMemPerc = ((os.freemem() * 100) / os.totalmem()).toFixed(1);
      const totalUsers = global.data?.allUserID?.length || "N/A";
      const totalThreads = global.data?.allThreadID?.length || "N/A";
      const ping = Date.now() - timeStart;

      // Canvas
      const width = 750, height = 260;
      const canvas = Canvas.createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background + overlay
      ctx.drawImage(cachedBG, 0, 0, width, height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);

      // Text on image
      ctx.fillStyle = "#ffffff";
      ctx.font = "32px Phenomicon";
      ctx.fillText("Bot Uptime", 40, 60);

      ctx.font = "28px Avo";
      ctx.fillStyle = "#00ffff";
      ctx.fillText(timeFormat, 40, 100);

      ctx.fillStyle = "#ffffff";
      ctx.font = "26px Phenomicon";
      ctx.fillText("Memory Usage:", 40, 160);

      ctx.font = "24px Avo";
      ctx.fillStyle = "#00ff99";
      ctx.fillText(`${memory} MB`, 220, 160);

      ctx.fillStyle = "#ffffff";
      ctx.font = "26px Phenomicon";
      ctx.fillText("CPU Usage:", 40, 210);

      ctx.font = "24px Avo";
      ctx.fillStyle = "#ffff00";
      ctx.fillText(`${cpu}%`, 220, 210);

      // Save image
      const imgPath = path.join(__dirname, "cache", `uptime-${Date.now()}.png`);
      fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

      // Message body
      const msg = `☁️ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲 𝗥𝗲𝗽𝗼𝗿𝘁

⏱️ Uptime: ${timeFormat}
⚙️ CPU: ${chips}
🚀 Speed: ${speed} MHz
🧠 RAM: ${freeMem} / ${totalMem} MB (${usedMemPerc}% free)

👤 Total Users: ${totalUsers}
👥 Total Groups: ${totalThreads}
⚡ CPU Usage: ${cpu}%
📦 RAM Usage: ${memory} MB
📶 Ping: ${ping} ms

👨‍💻 Admin: https://www.facebook.com/100071880593545`;

      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath));

    } catch (err) {
      console.error("Uptime Error:", err);
      api.sendMessage("❌ An error occurred while generating the uptime panel.", event.threadID);
    }
  }
};
