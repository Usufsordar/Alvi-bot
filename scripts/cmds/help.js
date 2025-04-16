const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ ✨ | Goat Bot V2.0]";
/**
* @author aminul Sorder
* @author: do not delete it
* @message if you delete or edit it you will get a global ban
* @modified by: [Your Name]
* @description Enhanced help command with better formatting and visuals
*/

module.exports = {
	config: {
		name: "help",
		version: "1.22",
		author: "Aminul sordar ",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem cách sử dụng của các lệnh - Phiên bản nâng cao",
			en: "View command usage - Enhanced version"
		},
		category: "info",
		guide: {
			vi: "   {pn} [để trống | <số trang> | <tên lệnh>]"
				+ "\n   {pn} <command name> [-u | usage | -g | guide]: chỉ hiển thị phần hướng dẫn sử dụng lệnh"
				+ "\n   {pn} <command name> [-i | info]: chỉ hiển thị phần thông tin về lệnh"
				+ "\n   {pn} <command name> [-r | role]: chỉ hiển thị phần quyền hạn của lệnh"
				+ "\n   {pn} <command name> [-a | alias]: chỉ hiển thị phần tên viết tắt của lệnh",
			en: "{pn} [empty | <page number> | <command name>]"
				+ "\n   {pn} <command name> [-u | usage | -g | guide]: only show command usage"
				+ "\n   {pn} <command name> [-i | info]: only show command info"
				+ "\n   {pn} <command name> [-r | role]: only show command role"
				+ "\n   {pn} <command name> [-a | alias]: only show command alias"
		},
		priority: 1
	},

	langs: {
		vi: {
			help: "╭─────────────⭓"
				+ "\n%1"
				+ "\n├─────⭔"
				+ "\n│ 🌟 Trang [ %2/%3 ]"
				+ "\n│ 🤖 Hiện tại bot có %4 lệnh có thể sử dụng"
				+ "\n│ 📌 » Gõ %5help <số trang> để xem danh sách các lệnh"
				+ "\n│ 📌 » Gõ %5help <tên lệnh> để xem chi tiết cách sử dụng"
				+ "\n├────────⭔"
				+ "\n│ ✨ %6"
				+ "\n╰─────────────⭓",
			help2: "%1├───────⭔"
				+ "\n│ 📌 Hiện tại bot có %2 lệnh có thể sử dụng"
				+ "\n│ 📌 Gõ %3help <tên lệnh> để xem chi tiết cách sử dụng"
				+ "\n│ ✨ %4"
				+ "\n╰─────────────⭓",
			commandNotFound: "⚠️ Lệnh \"%1\" không tồn tại",
			getInfoCommand: "╭── 🎯 TÊN LỆNH ────⭓"
				+ "\n│ %1"
				+ "\n├── ℹ️ THÔNG TIN"
				+ "\n│ 📝 Mô tả: %2"
				+ "\n│ 🔤 Tên gọi khác: %3"
				+ "\n│ 🏷️ Tên gọi khác trong nhóm: %4"
				+ "\n│ 🏷️ Version: %5"
				+ "\n│ 🔒 Role: %6"
				+ "\n│ ⏱️ Thời gian chờ: %7s"
				+ "\n│ 👤 Tác giả: %8"
				+ "\n├── 📖 CÁCH DÙNG"
				+ "\n│%9"
				+ "\n├── 📌 GHI CHÚ"
				+ "\n│ <XXXXX> - Nội dung có thể thay đổi"
				+ "\n│ [a|b|c] - Chọn a hoặc b hoặc c"
				+ "\n╰──────⭔",
			onlyInfo: "╭── ℹ️ THÔNG TIN ────⭓"
				+ "\n│ 🎯 Tên lệnh: %1"
				+ "\n│ 📝 Mô tả: %2"
				+ "\n│ 🔤 Tên gọi khác: %3"
				+ "\n│ 🏷️ Tên gọi khác trong nhóm: %4"
				+ "\n│ 🏷️ Version: %5"
				+ "\n│ 🔒 Role: %6"
				+ "\n│ ⏱️ Thời gian chờ: %7s"
				+ "\n│ 👤 Tác giả: %8"
				+ "\n╰─────────────⭓",
			onlyUsage: "╭── 📖 CÁCH DÙNG ────⭓"
				+ "\n│%1"
				+ "\n╰─────────────⭓",
			onlyAlias: "╭── 🔤 TÊN GỌI KHÁC ────⭓"
				+ "\n│ 📌 Tên gọi khác: %1"
				+ "\n│ 🏷️ Tên gọi khác trong nhóm: %2"
				+ "\n╰─────────────⭓",
			onlyRole: "╭── 🔒 QUYỀN HẠN ────⭓"
				+ "\n│%1"
				+ "\n╰─────────────⭓",
			doNotHave: "Không có",
			roleText0: "👶 0 (Tất cả người dùng)",
			roleText1: "👮 1 (Quản trị viên nhóm)",
			roleText2: "👑 2 (Admin bot)",
			roleText0setRole: "👶 0 (Đã đặt role, tất cả người dùng)",
			roleText1setRole: "👮 1 (Đã đặt role, quản trị viên nhóm)",
			pageNotFound: "⚠️ Trang %1 không tồn tại"
		},
		en: {
			help: "╭─────────────⭓"
				+ "\n%1"
				+ "\n├─────⭔"
				+ "\n│ 🌟 Page [ %2/%3 ]"
				+ "\n│ 🤖 Currently, the bot has %4 commands available"
				+ "\n│ 📌 » Type %5help <page> to view command list"
				+ "\n│ 📌 » Type %5help <command> for details"
				+ "\n├────────⭔"
				+ "\n│ ✨ %6"
				 + "\n├─── OWNER INFO ───⭔"
  + "\n│ 👑 Name: Aminul Sordar"
  + "\n│ 📩 FB: https://fb.com/profile.php?id=100071880593545"
  + "\n╰─────────────────⭓",
			help2: "%1├───────⭔"
				+ "\n│ 📌 Currently %2 commands available"
				+ "\n│ 📌 Type %3help <command> for details"
				+ "\n│ ✨ %4"
				+ "\n├─── OWNER INFO ───⭔"
  + "\n│ 👑 Name: Aminul Sordar"
  + "\n│ 📩 FB: https://fb.com/profile.php?id=100071880593545"
  + "\n╰─────────────────⭓",
			commandNotFound: "⚠️ Command \"%1\" not found",
			getInfoCommand: "╭── 🎯 COMMAND NAME ────⭓"
				+ "\n│ %1"
				+ "\n├── ℹ️ INFO"
				+ "\n│ 📝 Description: %2"
				+ "\n│ 🔤 Aliases: %3"
				+ "\n│ 🏷️ Group Aliases: %4"
				+ "\n│ 🏷️ Version: %5"
				+ "\n│ 🔒 Role: %6"
				+ "\n│ ⏱️ Cooldown: %7s"
				+ "\n│ 👤 Author: %8"
				+ "\n├── 📖 USAGE"
				+ "\n│%9"
				+ "\n├── 📌 NOTES"
				+ "\n│ <XXXXX> - Replaceable content"
				+ "\n│ [a|b|c] - Choose a or b or c"
				+ "\n╰──────⭔",
			onlyInfo: "╭── ℹ️ INFO ────⭓"
				+ "\n│ 🎯 Command: %1"
				+ "\n│ 📝 Description: %2"
				+ "\n│ 🔤 Aliases: %3"
				+ "\n│ 🏷️ Group Aliases: %4"
				+ "\n│ 🏷️ Version: %5"
				+ "\n│ 🔒 Role: %6"
				+ "\n│ ⏱️ Cooldown: %7s"
				+ "\n│ 👤 Author: %8"
				+ "\n╰─────────────⭓",
			onlyUsage: "╭── 📖 USAGE ────⭓"
				+ "\n│%1"
				+ "\n╰─────────────⭓",
			onlyAlias: "╭── 🔤 ALIASES ────⭓"
				+ "\n│ 📌 Global Aliases: %1"
				+ "\n│ 🏷️ Group Aliases: %2"
				+ "\n╰─────────────⭓",
			onlyRole: "╭── 🔒 ROLE ────⭓"
				+ "\n│%1"
				+ "\n╰─────────────⭓",
			doNotHave: "None",
			roleText0: "👶 0 (All users)",
			roleText1: "👮 1 (Group admins)",
			roleText2: "👑 2 (Bot admin)",
			roleText0setRole: "👶 0 (Custom role, all users)",
			roleText1setRole: "👮 1 (Custom role, group admins)",
			pageNotFound: "⚠️ Page %1 doesn't exist"
		}
	},

	onStart: async function ({ message, args, event, threadsData, getLang, role, globalData }) {
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
		let customLang = {};
		const pathCustomLang = path.normalize(`${process.cwd()}/languages/cmds/${langCode}.js`);
		if (fs.existsSync(pathCustomLang))
			customLang = require(pathCustomLang);

		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);
		let sortHelp = threadData.settings.sortHelp || "name";
		if (!["category", "name"].includes(sortHelp))
			sortHelp = "name";
		const commandName = (args[0] || "").toLowerCase();
		let command = commands.get(commandName) || commands.get(aliases.get(commandName));
		const aliasesData = threadData.data.aliases || {};

		if (!command) {
			for (const cmdName in aliasesData) {
				if (aliasesData[cmdName].includes(commandName)) {
					command = commands.get(cmdName);
					break;
				}
			}
		}

		if (!command) {
			const globalAliasesData = await globalData.get('setalias', 'data', []);
			for (const item of globalAliasesData) {
				if (item.aliases.includes(commandName)) {
					command = commands.get(item.commandName);
					break;
				}
			}
		}

		// ———————————————— LIST ALL COMMANDS ——————————————— //
		if (!command && !args[0] || !isNaN(args[0])) {
			const arrayInfo = [];
			let msg = "";
			if (sortHelp == "name") {
				const page = parseInt(args[0]) || 1;
				const numberOfOnePage = 30;
				
				// Get all commands
				for (const [name, value] of commands) {
					if (value.config.role > 1 && role < value.config.role)
						continue;
					
					let describe = name;
					let description;
					const descriptionCustomLang = customLang[name]?.description;
					
					if (descriptionCustomLang != undefined)
						description = checkLangObject(descriptionCustomLang, langCode);
					else if (value.config.description)
						description = checkLangObject(value.config.description, langCode);
					
					if (description)
						describe += `: ${cropContent(description.charAt(0).toUpperCase() + description.slice(1), 50)}`;
					
					arrayInfo.push({
						data: describe,
						priority: value.priority || 0
					});
				}

				// Sort commands
				arrayInfo.sort((a, b) => a.data.localeCompare(b.data)); // sort by name
				arrayInfo.sort((a, b) => a.priority > b.priority ? -1 : 1); // sort by priority
				
				// Pagination
				const { allPage, totalPage } = global.utils.splitPage(arrayInfo, numberOfOnePage);
				if (page < 1 || page > totalPage)
					return message.reply(getLang("pageNotFound", page));

				// Format the message
				const returnArray = allPage[page - 1] || [];
				const startNumber = (page - 1) * numberOfOnePage + 1;
				msg += (returnArray || []).reduce((text, item, index) => text += `│ ${index + startNumber}${index + startNumber < 10 ? " " : ""}. ${item.data}\n`, '').slice(0, -1);
				
				await message.reply(getLang("help", msg, page, totalPage, commands.size, prefix, doNotDelete));
			}
			else if (sortHelp == "category") {
				// Group commands by category
				for (const [, value] of commands) {
					if (value.config.role > 1 && role < value.config.role)
						continue;
					
					const category = value.config.category?.toLowerCase() || "uncategorized";
					const indexCategory = arrayInfo.findIndex(item => item.category == category);

					if (indexCategory != -1)
						arrayInfo[indexCategory].names.push(value.config.name);
					else
						arrayInfo.push({
							category,
							names: [value.config.name]
						});
				}
				
				// Sort categories alphabetically
				arrayInfo.sort((a, b) => a.category.localeCompare(b.category));
				
				// Format the message
				arrayInfo.forEach((data, index) => {
					const categoryUpcase = `${index == 0 ? `╭` : `├`}─── ${data.category.toUpperCase()} ${index == 0 ? "⭓" : "⭔"}`;
					data.names = data.names.sort().map(item => `│ ${item}`);
					msg += `${categoryUpcase}\n${data.names.join("\n")}\n`;
				});
				
				message.reply(getLang("help2", msg, commands.size, prefix, doNotDelete));
			}
		}
		// ———————————— COMMAND DOES NOT EXIST ———————————— //
		else if (!command && args[0]) {
			return message.reply(getLang("commandNotFound", args[0]));
		}
		// ————————————————— COMMAND INFO ————————————————— //
		else {
			const formSendMessage = {};
			const configCommand = command.config;

			// Get command guide
			let guide = configCommand.guide?.[langCode] || configCommand.guide?.["en"];
			if (guide == undefined)
				guide = customLang[configCommand.name]?.guide?.[langCode] || customLang[configCommand.name]?.guide?.["en"];

			guide = guide || { body: "" };
			if (typeof guide == "string")
				guide = { body: guide };
				
			// Replace placeholders in guide
			const guideBody = guide.body
				.replace(/\{prefix\}|\{p\}/g, prefix)
				.replace(/\{name\}|\{n\}/g, configCommand.name)
				.replace(/\{pn\}/g, prefix + configCommand.name);

			// Get aliases information
			const aliasesString = configCommand.aliases ? configCommand.aliases.join(", ") : getLang("doNotHave");
			const aliasesThisGroup = threadData.data.aliases ? (threadData.data.aliases[configCommand.name] || []).join(", ") : getLang("doNotHave");

			// Get role information
			let roleOfCommand = configCommand.role;
			let roleIsSet = false;
			if (threadData.data.setRole?.[configCommand.name]) {
				roleOfCommand = threadData.data.setRole[configCommand.name];
				roleIsSet = true;
			}

			const roleText = roleOfCommand == 0 ?
				(roleIsSet ? getLang("roleText0setRole") : getLang("roleText0")) :
				roleOfCommand == 1 ?
					(roleIsSet ? getLang("roleText1setRole") : getLang("roleText1")) :
					getLang("roleText2");

			// Get command description
			const author = configCommand.author;
			const descriptionCustomLang = customLang[configCommand.name]?.description;
			let description = checkLangObject(configCommand.description, langCode);
			if (description == undefined)
				description = descriptionCustomLang ? checkLangObject(descriptionCustomLang, langCode) : getLang("doNotHave");

			let sendWithAttachment = false;

			// Handle different help options
			if (args[1]?.match(/^-g|guide|-u|usage$/)) {
				formSendMessage.body = getLang("onlyUsage", guideBody.split("\n").join("\n│"));
				sendWithAttachment = true;
			}
			else if (args[1]?.match(/^-a|alias|aliase|aliases$/))
				formSendMessage.body = getLang("onlyAlias", aliasesString, aliasesThisGroup);
			else if (args[1]?.match(/^-r|role$/))
				formSendMessage.body = getLang("onlyRole", roleText);
			else if (args[1]?.match(/^-i|info$/))
				formSendMessage.body = getLang(
					"onlyInfo",
					configCommand.name,
					description,
					aliasesString,
					aliasesThisGroup,
					configCommand.version,
					roleText,
					configCommand.countDown || 1,
					author || ""
				);
			else {
				// Full command info
				formSendMessage.body = getLang(
					"getInfoCommand",
					configCommand.name,
					description,
					aliasesString,
					aliasesThisGroup,
					configCommand.version,
					roleText,
					configCommand.countDown || 1,
					author || "",
					guideBody.split("\n").join("\n│")
				);
				sendWithAttachment = true;
			}

			// Handle attachments if needed
			if (sendWithAttachment && guide.attachment) {
				if (typeof guide.attachment == "object" && !Array.isArray(guide.attachment)) {
					const promises = [];
					formSendMessage.attachment = [];

					for (const keyPathFile in guide.attachment) {
						const pathFile = path.normalize(keyPathFile);

						if (!fs.existsSync(pathFile)) {
							// Create directory structure if needed
							const cutDirPath = path.dirname(pathFile).split(path.sep);
							for (let i = 0; i < cutDirPath.length; i++) {
								const pathCheck = `${cutDirPath.slice(0, i + 1).join(path.sep)}${path.sep}`;
								if (!fs.existsSync(pathCheck))
									fs.mkdirSync(pathCheck);
							}
							
							// Download the file
							const getFilePromise = axios.get(guide.attachment[keyPathFile], { responseType: 'arraybuffer' })
								.then(response => {
									fs.writeFileSync(pathFile, Buffer.from(response.data));
								});

							promises.push({
								pathFile,
								getFilePromise
							});
						}
						else {
							promises.push({
								pathFile,
								getFilePromise: Promise.resolve()
							});
						}
					}

					await Promise.all(promises.map(item => item.getFilePromise));
					for (const item of promises)
						formSendMessage.attachment.push(fs.createReadStream(item.pathFile));
				}
			}

			return message.reply(formSendMessage);
		}
	}
};

function checkLangObject(data, langCode) {
	if (typeof data == "string")
		return data;
	if (typeof data == "object" && !Array.isArray(data))
		return data[langCode] || data.en || undefined;
	return undefined;
}

function cropContent(content, max) {
	if (content.length > max) {
		content = content.slice(0, max - 3);
		content = content + "...";
	}
	return content;
				    }
