const axios = require('axios');
const { google } = require('googleapis');

module.exports = {
  config: {
    name: "drive",
    version: "5.0.0",
    author: "aminul sordar",
    countDown: 10,
    role: 0,
    description: {
      en: "🚀 Upload files to Google Drive or list/play existing videos"
    },
    category: "cloud",
    guide: {
      en: "{pn} upload <url> - Upload from URL\nReply to media with {pn} upload - Upload attachment\n{pn} list [page] - List videos\nReply with a number to play"
    }
  },

  langs: {
    en: {
      missingInput: "📌 Please provide a valid URL or reply to a media message",
      invalidUrl: "❌ Invalid URL format. Please provide a proper http/https link",
      uploadProgress: "⏳ Uploading to Google Drive...",
      uploadSuccess: "✅ Upload Successful!\n\n📥 Download: {url}\n🆔 File ID: {id}\n📦 Storage: Google Drive",
      uploadFail: "❌ Upload failed. The file may be too large or unavailable",
      serverError: "⚠️ Server is busy. Please try again later",
      networkError: "📡 Network issue detected. Check your connection",
      loading: "⏳ Fetching video list from Google Drive...",
      noVideos: "❌ No videos found in your Drive",
      listHeader: "📁 Google Drive Videos (Page {page}):\n\n",
      listItem: "{index}. {name}\n   🆔 ID: {id}\n   🔗 Link: {link}\n",
      videoInfo: "▶️ Now Playing: {name}",
      invalidNumber: "❌ Please reply with a valid number from the list",
      error: "⚠️ Error: {error}",
      timeout: "⌛ Upload timed out. The file might be too large",
      authError: "🔒 Authentication failed. Check Google Drive credentials"
    }
  },

  onStart: async function ({ message, event, args, getLang }) {
    try {
      const action = args[0]?.toLowerCase();

      if (action === "upload") {
        const inputUrl = event?.messageReply?.attachments?.[0]?.url || args[1];

        if (!inputUrl) {
          return message.reply(getLang("missingInput"));
        }
        if (!/^https?:\/\/\S+$/i.test(inputUrl)) {
          return message.reply(getLang("invalidUrl"));
        }

        message.reply(getLang("uploadProgress"));

        const apiUrl = `https://dive-uploder.onrender.com/api/v1/upload?url=${encodeURIComponent(inputUrl)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        if (!data?.success || !data?.data?.downloadLink) {
          return message.reply(getLang("uploadFail"));
        }

        const successMessage = getLang("uploadSuccess")
          .replace("{url}", data.data.downloadLink)
          .replace("{id}", data.data.fileId || "N/A");

        return message.reply(successMessage);
      }

      // Handle list command
      const page = args[1] ? parseInt(args[1]) : 1;
      const perPage = 10;

      await message.reply(getLang("loading"));

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: "driver-uploaded@drive-upload-457315.iam.gserviceaccount.com",
          private_key: process.env.GOOGLE_PRIVATE_KEY || 
            "-----BEGIN PRIVATE KEY-----\n" +
            "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2rY1L2EU/7cKs\n" +
            "eo2XPuWfDmMbckGaCoRL25BdtoYi/8GloHDxKxH5fFYaRLPe8FkDlaBNXoEEtTyM\n" +
            "2YlJ4anAGaOSzcCe9vCGOXx6JXze8DZz0bFhTXlZBgAKTXag/9bL9R6rcAsYzrQI\n" +
            "DCRZC+uEZHXvy0xd0nAuCAeg1RrovwtwKiyK7Ybga0FcbloOmutHrPeD/jgktpqV\n" +
            "3aSX0RIDliYKrvfG9cieoU6WCnWxkG2fqX0UhdkKl7JYfGgwjo259VLScyKIG2qX\n" +
            "Yrjlk1A9Qx9xIKjAX+2OJV/YonG350ESGU3jy0gytDNToV16lvgPmhZAwcte73N+\n" +
            "WPrUE7GxAgMBAAECggEABjWqkKoymmx22l2VHA/NhuVajZeJ7tZOLnTxeJoIf76R\n" +
            "YtOsGyqTYxdsptpwgdLKN9K5fv/II3SUsRYA8nO7DTZh5s7bLhwnS2y/VDibgMmK\n" +
            "FFBLtwrG5fWMAU2mS20+7DJyHzJBElAOcxqUjrlWwWqXzrWqrCLH4Oyxc7BiyIgN\n" +
            "Q7yPtI3i5+oOv7rlUrMKBoJOZJtYOwCO24BtRhDoiu+FtXfTwgml8uWxRyDcL+cB\n" +
            "7ASWMtHJFdGZLfc0bAqk46VH8Oe9FmeUjxuUI1HgWt0hoZPcwpPJfLgc5M6/6XCq\n" +
            "/PR3S4G2D4t12iU5gJ+8PPslQ78SlFUesg/kgrN08QKBgQDazgzTDvJ6+fIgNNCR\n" +
            "9LmPsmuPSLdFfc7ORBuWwEt8wRA9vQCHMjjghY/Qi4SrJoeHb8pQpL9TjAkWntQ1\n" +
            "yTSvoTT58Sw/Z97y36hWgwRC85Y2YxrtMn4+tq/fA2Vl5SR8uJqwX/6QWrv98viy\n" +
            "dFiEP4pJpw/U3HUW/Srr7BjcWQKBgQDVu1RfErVxGugs3yV13nxLLGpp/nXSoyM5\n" +
            "kS/LTrISMIC4PeBmxXjoYUaQBFveZKGN2ATXLlzIXMep0tYlj/6MKIhRC19Oq0qx\n" +
            "RKAvM9DZUandoCLwggLiwN3rIz+p+xYlPKCv9jIt+YWmpFz66Dlaw+xDNEX+DCak\n" +
            "plgx1E31GQKBgEeuRSlHtkxvYdEHPGT0hW38B5yzN8c+RefxDBDBAnnmTcnMB0ZD\n" +
            "P7reRpUNf/MJ9lB6YQ82Sa+3KqsMcX0FY4s+BrrzNYm4H6P1fZKJ7XV5k3ZR1Vpr\n" +
            "tkwZUViAJlHRVbi+SX8Kk7z63Kd/V9Yuo2j/3+/tGRSk/H8BhXQwrpxRAoGAHDqx\n" +
            "2hzOejHjmImgmQDZydQD+hvx0/BYJrJWbbPnMR/W4H7LtMdAQPEYMM1ilO0VqXZu\n" +
            "rT0iZBRdCsEeJ7ftFvYDizDFVc6p/t/hiFp/qzRuCyerdbi2SNzQcs4lCn5vXluz\n" +
            "nYoW9puOW4Q6A6nIaYSXIAk3dWaFdBnEbFBuO4ECgYByM47GtIPmSjsoSjdnMgaE\n" +
            "41jDO5RJR66n5DSja1MurWbLKdih7yTiAck7VkI/eNsm2Q/bivaz5R95LY4szpwY\n" +
            "HYXURxFbwAE00qNgHokab4p1qTWaE6rfj/M/fEScT08P+6D/pQwabSmJOQmg+T3j\n" +
            "Fct5MdqjnK4gwjZNQBzjog==\n" +
            "-----END PRIVATE KEY-----\n"
        },
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
      });

      const drive = google.drive({ version: 'v3', auth });
      const res = await drive.files.list({
        q: "mimeType contains 'video/' and trashed = false",
        fields: 'files(id,name,webViewLink)',
        pageSize: perPage,
        orderBy: 'name',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true
      });

      if (!res.data.files || res.data.files.length === 0) {
        return message.reply(getLang("noVideos"));
      }

      let replyMsg = getLang("listHeader").replace('{page}', page);
      res.data.files.forEach((file, index) => {
        replyMsg += getLang("listItem")
          .replace('{index}', index + 1)
          .replace('{name}', file.name || 'Untitled')
          .replace('{id}', file.id || 'N/A')
          .replace('{link}', file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`);
      });

      if (res.data.files.length === perPage) {
        replyMsg += `\n📌 Use "${this.config.name} list ${page + 1}" for next page`;
      }

      replyMsg += "\n\n▶️ Reply with a number to play that video";

      return message.reply(replyMsg, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            files: res.data.files
          });
        }
      });

    } catch (error) {
      console.error('Drive Error:', error);
      if (error.code === 'ECONNABORTED') {
        return message.reply(getLang("timeout"));
      }
      if (error.response?.status === 400) {
        return message.reply(getLang("invalidUrl"));
      }
      if (error.message.includes("invalid_grant") || error.message.includes("credentials")) {
        return message.reply(getLang("authError"));
      }
      return message.reply(getLang("error").replace('{error}', error.message));
    }
  },

  onReply: async function({ message, event, getLang, Reply }) {
    try {
      const { author, files } = Reply;
      if (author !== event.senderID) return;

      const selectedNumber = parseInt(event.body);
      if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > files.length) {
        return message.reply(getLang("invalidNumber"));
      }

      const selectedFile = files[selectedNumber - 1];
      const videoUrl = `https://drive.google.com/uc?export=view&id=${selectedFile.id}`;

      await message.reply({
        body: getLang("videoInfo").replace('{name}', selectedFile.name || 'Untitled'),
        attachment: await global.utils.getStreamFromURL(videoUrl)
      });

    } catch (error) {
      console.error('Reply Error:', error);
      return message.reply(getLang("error").replace('{error}', error.message));
    }
  }
};
