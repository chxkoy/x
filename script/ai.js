/* 
If you encounter any errors, please give me feedback. Contact me on facebook https://facebook.com/joshg101
*/

const { get } = require('axios');
let url = "https://ai-tools.replit.app";

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "Deku",
    description: "Talk to AI with continuous conversation.",
    aliases:  ['Ai'],
    usages: "[prompt]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }
    if (!args[0]) return sendMessage('Please provide a question first.');
    const prompt = args.join(" ");
    try {
        api.sendMessage("Please bear with me while I ponder your request...", event.threadID, event.messageID);
        const response = await get(`${url}/gpt?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`);
        const data = response.data;
        return sendMessage(`𝗔𝗜 🚀\n━━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${prompt}\n━━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${data.gpt4}\n\ncredits: www.facebook.com/mark.dev69`);
    } catch (error) {
        return sendMessage(error.message);
    }
}
