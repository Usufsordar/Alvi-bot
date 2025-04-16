module.exports = {
    config: {
        name: "prefix",
        version: "1.5-decorated",
        author: "NTKhang | Modified by Aminul sordar ",
        countDown: 5,
        role: 0,
        description: "🎯 Change bot prefix per group or globally (admin only)",
        category: "config",
        guide: {
            vi: "   {pn} <new prefix>: thay đổi prefix mới trong box chat của bạn"
                + "\n   Ví dụ:"
                + "\n    {pn} #"
                + "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
                + "\n   Ví dụ:"
                + "\n    {pn} # -g"
                + "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
            en: "   {pn} <new prefix>: change new prefix in your box chat"
                + "\n   Example:"
                + "\n    {pn} #"
                + "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
                + "\n   Example:"
                + "\n    {pn} # -g"
                + "\n\n   {pn} reset: change prefix in your box chat to default"
        }
    },

    langs: {
        vi: {
            reset: "✅ Đã reset prefix của bạn về mặc định: %1",
            onlyAdmin: "⛔ Chỉ admin mới có thể thay đổi prefix hệ thống bot",
            confirmGlobal: "⚠️ Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
            confirmThisThread: "⚠️ Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
            successGlobal: "✅ Đã thay đổi prefix hệ thống bot thành: %1",
            successThisThread: "✅ Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
            myPrefix: "🌐 Prefix hệ thống: %1\n🛸 Prefix nhóm của bạn: %2"
        },
        en: {
            reset: "✅ Your prefix has been reset to default: %1",
            onlyAdmin: "⛔ Only admin can change prefix of system bot",
            confirmGlobal: "⚠️ Please react to this message to confirm changing prefix of system bot",
            confirmThisThread: "⚠️ Please react to this message to confirm changing prefix in your box chat",
            successGlobal: "✅ Changed system bot prefix to: %1",
            successThisThread: "✅ Changed box chat prefix to: %1",
            myPrefix: "🌐 System prefix: %1\n🛸 Your box chat prefix: %2"
        }
    },

    onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
        if (!args[0]) return message.SyntaxError();

        // Reset prefix to default
        if (args[0] === 'reset') {
            await threadsData.set(event.threadID, null, "data.prefix");
            return message.reply(getLang("reset", global.GoatBot.config.prefix));
        }

        const newPrefix = args[0];
        const formSet = {
            commandName,
            author: event.senderID,
            newPrefix
        };

        if (args[1] === "-g") {
            if (role < 2) return message.reply(getLang("onlyAdmin"));
            formSet.setGlobal = true;
        } else {
            formSet.setGlobal = false;
        }

        return message.reply(
            args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
            (err, info) => {
                formSet.messageID = info.messageID;
                global.GoatBot.onReaction.set(info.messageID, formSet);
            }
        );
    },

    onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
        const { author, newPrefix, setGlobal } = Reaction;
        if (event.userID !== author) return;

        if (setGlobal) {
            global.GoatBot.config.prefix = newPrefix;
            fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
            return message.reply(getLang("successGlobal", newPrefix));
        } else {
            await threadsData.set(event.threadID, newPrefix, "data.prefix");
            return message.reply(getLang("successThisThread", newPrefix));
        }
    },

    onChat: async function ({ event, message, getLang, threadsData }) {
        if (event.body && event.body.toLowerCase() === "prefix") {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

            const botName = global.GoatBot?.config?.botName || "GoatBot";
            const botVersion = global.GoatBot?.config?.version || "1.0.0";
            const totalThreads = (await threadsData.getAll()).length;

            const tipsList = [
                "💡 আপনি চাইলে প্রতিটা গ্রুপে আলাদা prefix সেট করতে পারেন!",
                "⌨️ prefix reset দিয়ে গ্রুপের prefix ডিফল্টে নিয়ে আসুন।",
                "⚙️ শুধু bot admin-রা system prefix বদলাতে পারবেন!",
                "⏱️ prefix কমান্ড দিয়ে বটের আপটাইমও দেখতে পারবেন!",
                "✨ আপনার কমান্ডের শুরুতে prefix ভুলে গেলেন? শুধু 'prefix' লিখলেই বর্তমান prefix দেখে নিতে পারবেন!",
                "🛠️ কোনো prefix সেট না করা থাকলে, বট ডিফল্ট prefix ব্যবহার করে!"
            ];
            const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];

            const sysPrefix = global.GoatBot.config.prefix;
            const threadPrefix = utils.getPrefix(event.threadID);

            return () => {
                return message.reply(
                    `╔════════════════════════════╗\n` +
                    `║         🤖 ${botName} STATUS PANEL         ║\n` +
                    `╠════════════════════════════╣\n` +
                    `║ 🧠 Version         : ${botVersion.padEnd(10)} ║\n` +
                    `║ 🛡️ System Prefix   : ${sysPrefix.padEnd(10)} ║\n` +
                    `║ 🧩 Group Prefix    : ${threadPrefix.padEnd(10)} ║\n` +
                    `║ 🌐 Connected Groups: ${String(totalThreads).padEnd(10)} ║\n` +
                    `║ ⏱️ Uptime          : ${uptimeStr.padEnd(10)} ║\n` +
                    `╠════════════════════════════╣\n` +
                    `║ 💡 TIP: ${randomTip.padEnd(25)}\n` +
                    `╚════════════════════════════╝`
                );
            };
        }
    }
};
