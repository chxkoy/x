const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes", //API BY MARK
    description: "EDUCATIONAL",
    usePrefix: true,
    commandCategory: "AI",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = (args.join(" "));
    const apiUrl = `https://jonellccapis-dbe67c18fbcf.herokuapp.com/api/globalgpt?content=${content}`;

    if (!content) return api.sendMessage("Please provide a question first.", event.threadID, event.messageID);

    try {
        api.sendMessage("Please bear with me while I ponder your request...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
      const result = response.data.content;

        api.sendMessage(`𝗔𝗜 🚀\n━━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${content}\n━━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${result}`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
