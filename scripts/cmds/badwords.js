// Badwords Auto-Reply | Author: Aminul Sordar

const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
	name: "badwords",
	version: "1.0.3",
	role: 0,
	author: "Aminul Sordar",
	prefix: false,
	category: "without prefix",
	guide: "[tag]",
	description: "Detects offensive language, warns user, and reports to admin.",
	cooldowns: 5
};

const ADMIN_ID = "100071880593545"; // Change or add more if needed

module.exports.onChat = async function ({ api, event }) {
	const { threadID, messageID, body, senderID, participantIDs, isGroup, threadName } = event;
	if (!body) return;

	const lowerText = body.toLowerCase();

	const keywords = [
		"magi", "bessa", "খানকি মাগি", "চুদানি", "চুদা", "চুদ",
		"ভুদা", "buda", "gali", "galibaz", "সাওয়া", "khanki",
		"maderxud", "xud", "xuda", "xudi", "cuda", "cudi", "mgi",
		"nodi", "নডি", "মাগি", "মাদারচুদ", "চুদি", "ষুদা", "ষুদি",
		"bal", "খাংকির পোলা", "খানকি মাকি", "SawYa", "Sawya",
		"tor mare xudi", "vuda", "heda", "bap"
	];

	const hasBadWord = keywords.some(word => lowerText.includes(word));
	if (!hasBadWord) return;

	// Try to get user name
	let userName = "Unknown User";
	try {
		const userInfo = await api.getUserInfo(senderID);
		userName = userInfo[senderID]?.name || "Unknown User";
	} catch (err) {}

	// 1. Send warning reply with image
	try {
		const imageURL = "https://i.ibb.co.com/Gf7Td8fQ/Picture.jpg";
		const imgPath = __dirname + "/cache/reply.jpg";

		const response = await axios.get(imageURL, { responseType: "arraybuffer" });
		fs.ensureDirSync(__dirname + "/cache");
		fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

		const msg = {
			body: "⚠️ ওহো! মুখ সামলাইয়া কথা কও!\nগালিগালাজ করলে কিন্তু তোর মুখে টেপ মাইরা দিবো — সিরিয়াসলি বলতেছি!",
			attachment: fs.createReadStream(imgPath)
		};

		api.sendMessage(msg, threadID, () => fs.unlinkSync(imgPath), messageID);
		api.setMessageReaction("😠", messageID, () => {}, true);

	} catch (err) {
		console.error("Image send failed:", err);
		api.sendMessage("দুঃখিত! কিছু একটা সমস্যা হয়েছে, তবে গালিগালাজ করবেন না।", threadID, messageID);
	}

	// 2. Send report to admin
	const reportMsg = 
		`⚠️ *Bad Word Detected*\n\n` +
		`👤 User: ${userName} (UID: ${senderID})\n` +
		`🗨️ Message: "${body}"\n` +
		`📍 In: ${isGroup ? `Group: ${threadName || "Unknown"}` : "Private Chat"}\n` +
		`🕒 Time: ${new Date().toLocaleString()}`;

	api.sendMessage(reportMsg, ADMIN_ID);
};

module.exports.onStart = function () {};
