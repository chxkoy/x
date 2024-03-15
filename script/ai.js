const axios = require('axios');

module.exports.config = {
    name: "ashley",
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
    const content = args.join(' ');
    const apiUrl = `https://markdev69-51fd0d410a95.herokuapp.com/api/gpt4?query=${content}`;

    if (!content) return api.sendMessage("Please provide a question first.", event.threadID, event.messageID);

    try {
      api.sendMessage("Please bear with me while I ponder your request...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const { Mark } = response.data;

        api.sendMessage(`𝗔𝗜 🚀\n━━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${question}\n━━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${Mark}\n\ncredits: www.facebook.com/mark.dev69`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
