const { getTime } = global.utils;
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "groupEventsBN",
		version: "2.1",
		author: "Royal Custom by ChatGPT",
		category: "events"
	},

	onStart: async ({ api, message, event }) => {
		const { threadID, logMessageType, logMessageData, type, body, reaction } = event;

		const threadInfo = await api.getThreadInfo(threadID);
		const memberCount = threadInfo.participantIDs.length;
		const adminCount = threadInfo.adminIDs.length;
		const currentTime = new Date().toLocaleTimeString("bn-BD");
		const joinDate = new Date().toLocaleDateString("bn-BD", {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
		const uptime = process.uptime();
		const hours = Math.floor(uptime / 3600);
		const minutes = Math.floor((uptime % 3600) / 60);
		const prefix = global.utils.getPrefix(threadID);

		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir);
		}

		// --- Welcome Member ---
		if (logMessageType === "log:subscribe") {
			const botJoin = logMessageData.addedParticipants.find(p => p.userFbId == api.getCurrentUserID());
			if (botJoin) {
				const msg =
`━━━━━━━━━━━━━━━━━━
🤖 ধন্যবাদ আমাকে যুক্ত করার জন্য 🤖
━━━━━━━━━━━━━━━━━━

✅ বট Prefix: ${prefix}
📜 সকল কমান্ড দেখতে লিখুন: ${prefix}help

আমার সাথে মজা করতে প্রস্তুত তো?
━━━━━━━━━━━━━━━━━━`;
				return message.send(msg);
			}

			const newUser = logMessageData.addedParticipants[0];
			const userName = newUser.fullName;
			const userID = newUser.userFbId;

			const welcomeImgURL = "https://i.ibb.co.com/9mVK24DX/welcome-image.jpg";
			const welcomeImgPath = path.join(cacheDir, "welcome.jpg");

			const responseWelcome = await axios.get(welcomeImgURL, { responseType: "stream" });
			const writerWelcome = fs.createWriteStream(welcomeImgPath);
			responseWelcome.data.pipe(writerWelcome);

			await new Promise((resolve, reject) => {
				writerWelcome.on("finish", resolve);
				writerWelcome.on("error", reject);
			});

			const welcomeMsg =
`━━━━━━━━━━━━━━━━━━
🌟 নতুন অতিথি 🌟
━━━━━━━━━━━━━━━━━━

স্বাগতম, ${userName}!

আপনি হচ্ছেন আমাদের ${memberCount} তম সদস্য।

📅 জয়েন করেছেন: ${joinDate}
⏱️ বট অনলাইন আছে: ${hours} ঘন্টা ${minutes} মিনিট
👥 মোট সদস্য: ${memberCount} জন
🛡️ এডমিন সংখ্যা: ${adminCount} জন

আশা করি এই গ্রুপে আপনার সময়টা দারুণ কাটবে!

━━━━━━━━━━━━━━━━━━`;

			return message.send({
				body: welcomeMsg,
				attachment: fs.createReadStream(welcomeImgPath),
				mentions: [{ tag: userName, id: userID }]
			});
		}

		// --- Member Left ---
		if (logMessageType === "log:unsubscribe") {
			const leftID = logMessageData.leftParticipantFbId;
			if (leftID == api.getCurrentUserID()) return;

			const leftUser = await api.getUserInfo(leftID);
			const name = leftUser[leftID]?.name || "কেউ";

			const leaveImgURL = "https://i.ibb.co.com/p6wznzgc/leave-image.jpg";
			const leaveImgPath = path.join(cacheDir, "leave.jpg");

			const responseLeave = await axios.get(leaveImgURL, { responseType: "stream" });
			const writerLeave = fs.createWriteStream(leaveImgPath);
			responseLeave.data.pipe(writerLeave);

			await new Promise((resolve, reject) => {
				writerLeave.on("finish", resolve);
				writerLeave.on("error", reject);
			});

			const byeMsg =
`━━━━━━━━━━━━━━━━━━
👋 সদস্য বিদায়
━━━━━━━━━━━━━━━━━━

${name} গ্রুপ ছেড়ে চলে গেল...

আশা করি আবার দেখা হবে ইনশাআল্লাহ!

━━━━━━━━━━━━━━━━━━`;

			return message.send({
				body: byeMsg,
				attachment: fs.createReadStream(leaveImgPath)
			});
		}

		// --- Other Events (same as before) ---
		if (logMessageType === "log:thread-name") {
			const newName = logMessageData.name;
			return message.send(`⚠️ গ্রুপের নাম এখন "${newName}" রাখা হয়েছে! দারুণ নাম!`);
		}
		if (logMessageType === "log:thread-nickname") {
			const newNick = logMessageData.nickname;
			const changedFor = logMessageData.participant_id;
			return message.send(`${changedFor} এর নতুন nickname: "${newNick}" রাখা হয়েছে!`);
		}
		if (logMessageType === "log:thread-icon") {
			const emoji = logMessageData.icon;
			return message.send(`গ্রুপের ইমোজি এখন: ${emoji}`);
		}
		if (logMessageType === "log:call") {
			return message.send("📞 কল শুরু হয়েছে! সবাই জয়েন হও ভাইরা!");
		}
		if (logMessageType === "log:call-ended") {
			const dur = logMessageData.callDuration;
			const m = Math.floor(dur / 60);
			const s = dur % 60;
			return message.send(`📴 কল শেষ! মোট সময়: ${m} মিনিট ${s} সেকেন্ড!`);
		}
		if (type === "message_reaction" && reaction === "😂") {
			return message.send("মজা পাইলা বুঝি?");
		}
		if (type === "message" && body?.toLowerCase().includes("@everyone")) {
			const mentions = threadInfo.participantIDs.map(id => ({ id, tag: " " }));
			return message.send({
				body: `@everyone বলেছেন! সবাই একবার দেখে নাও!`,
				mentions
			});
		}
	}
};
