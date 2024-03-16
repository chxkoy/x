const axios = require("axios");
const fs = require('fs');

function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = {
  config: {
    name: "spotify",
    version: "1.0",
    author: "Rishad",
    countDown: 10,
    role: 0,
    shortDescription: "Download Spotify musics by searching",
    longDescription: "Download Spotify musics by searching",
    category: "music",
    guide: "{pn} goosebumps"
  },

  run: async function ({ api, event, args }) {
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("Baka 🗿 provide a track name.", event.threadID);
    }

    const SearchapiUrl = `https://for-devs.onrender.com/api/spsearch?apikey=fuck&query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(SearchapiUrl);
      const tracks = response.data.slice(0, 6);

      if (tracks.length === 0) {
        return api.sendMessage("❎ No tracks found for the given query.", event.threadID);
      }

      const selectedTrack = tracks[0]; 
      const downloadingMessage = await api.sendMessage(`✅ Downloading track "${selectedTrack.title}"`, event.threadID);

      const SpdlApiUrl = 'https://for-devs.onrender.com/api/spotifydl?apikey=fuck&url=' + encodeURIComponent(selectedTrack.url);

      try {
        const apiResponse = await axios.get(SpdlApiUrl);

        if (apiResponse.data.id) {
          const {
            artists,
            title,
            album,
            releaseDate,
            downloadUrl
          } = apiResponse.data;

          const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(__dirname + '/cache/spotifyAudio.mp3', Buffer.from(audioResponse.data));

          const fileSize = fs.statSync(__dirname + '/cache/spotifyAudio.mp3').size;
          const sizeFormatted = formatSize(fileSize);

          const attachment = fs.createReadStream(__dirname + '/cache/spotifyAudio.mp3');

          const form = {
            body: `🎶 Now playing:\n\n👤 Artists: ${artists}\n🎵 Title: ${title}\n📀 Album: ${album}\n📅 Release Date: ${releaseDate}\n📦 Size: ${sizeFormatted}`,
            attachment: attachment
          };

          api.sendMessage(form, event.threadID);
        } else {
          api.sendMessage("Sorry, the Spotify content could not be downloaded.", event.threadID);
        }
      } catch (error) {
        console.error(error);
        api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
      }

      api.unsendMessage(downloadingMessage.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Error: " + error, event.threadID);
    }
  }
}; 