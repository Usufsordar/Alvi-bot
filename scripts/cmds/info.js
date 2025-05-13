const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');
const request = require('request');

module.exports = {
    config: {
        name: "info",
        version: "1.3",
        author: "𝐀𝐌𝐈𝐍𝐔𝐋-𝐒𝐎𝐑𝐃𝐀𝐑",
        countDown: 20,
        role: 0,
        shortDescription: {
            vi: "🌟 Thông tin Bot & Chủ Sở Hữu 🌟",
            en: "🌟 Bot & Owner Information 🌟"
        },
        longDescription: {
            vi: "✨ Hiển thị thông tin chi tiết về Bot và Chủ Sở Hữu. ✨",
            en: "✨ Displays detailed information about the Bot and its Owner. ✨"
        },
        category: "owner",
        guide: {
            en: "Type 'info' to unveil the Bot's secrets! 🕵️‍♂️"
        },
        envConfig: {}
    },

    onStart: async function ({ message }) {
        try {
            const botName = "─꯭─⃝͎̽𓆩𝐀𝐌𝐈𝐍𝐔𝐋 𝐁𝐎𝐓‣᭄𓆪___//😘😇😈";
            const botPrefix = "/";
            const authorName = "『😽👉𝐀𝐌𝐈𝐍𝐔𝐋 𝐒𝐎𝐑𝐃𝐀𝐑👈😽』";
            const teamName = "🚀 Github Team 🚀";
            const authorFB = "https://www.facebook.com/profile.php?id=100071880593545";
            const address = "𝐑𝐀𝐉𝐒𝐇𝐀𝐇𝐈, 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇";
            const religion = "𝐈𝐒𝐋𝐀𝐌";
            const gender = "𝐌𝐀𝐋𝐄";
            const relation = "𝐒𝐈𝐍𝐆𝐋𝐄";
            const work = "𝐒𝐓𝐔𝐃𝐘";
            const whatsapp = "+8801704407109";

            const now = moment().tz('Asia/Dhaka');
            const date = now.format('DD/MM/YYYY');
            const time = now.format('HH:mm:ss');

            const uptime = process.uptime();
            const format = n => String(Math.floor(n)).padStart(2, '0');
            const seconds = format(uptime % 60);
            const minutes = format((uptime / 60) % 60);
            const hours = format((uptime / 3600) % 24);
            const days = format(uptime / 86400);
            const uptimeString = `${days}:${hours}:${minutes}`;

            const infoMessage = `
╔═══════✿𝐁𝐎𝐓 𝐈𝐍𝐅𝐎✿══════╗
        💐আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ💐
╚══════════════════════╝

➤ 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 : ${authorName}
➤ 𝗔𝗗𝗗𝗥𝗘𝗦𝗦 : ${address}
➤ 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡 : ${religion}
➤ 𝗚𝗘𝗡𝗗𝗘𝗥 : ${gender}
➤ 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣 : ${relation}
➤ 𝗪𝗢𝗥𝗞 : ${work}
➤ 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 : ${whatsapp}
➤ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 : ${authorFB}

╔═══════✿𝐒𝐘𝐒𝐓𝐄𝐌✿════════╗
➤ 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘 : ${botName}
➤ 𝗣𝗥𝗘𝗙𝗜𝗫 : ${botPrefix}
➤ 𝗗𝗔𝗧𝗘 : ${date}
➤ 𝗧𝗜𝗠𝗘 : ${time}
➤ 𝗨𝗣𝗧𝗜𝗠𝗘 : ${uptimeString}
➤ 𝗧𝗘𝗔𝗠 : ${teamName}
╚═══════════════════════╝

🫶 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 ${botName}
`;

            const imagePath = __dirname + "/cache/1.png";
            const callback = () => {
                const msg = {
                    body: infoMessage,
                    attachment: fs.createReadStream(imagePath)
                };
                message.reply(msg, () => fs.unlinkSync(imagePath));
            };

            request(encodeURI(`https://graph.facebook.com/100071880593545/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
                .pipe(fs.createWriteStream(imagePath))
                .on("close", callback);

        } catch (error) {
            console.error("💥 info কমান্ডে ত্রুটি:", error);
            message.reply("⚠️ দুঃখিত, কিছু একটা সমস্যা হয়েছে info কমান্ডে!");
        }
    },

    onChat: async function ({ event, message, args, api }) {
        if (event.body && event.body.toLowerCase() === "info") {
            this.onStart({ event, message, args, api });
        }
    }
};
