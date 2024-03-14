const axios = require('axios');
const fs = require('fs').promises;

const storageFile = 'user_data.json';
const chatRecordFile = 'chat_records.json';
const axiosStatusFile = 'axios_status.json';

const primaryApiUrl = 'https://hiro-api.replit.app/ai/hercai';
const backupApiUrl = 'https://jonellccapis-dbe67c18fbcf.herokuapp.com/api/globalgpt';

let isPrimaryApiStable = true;
let axiosSwitchedMessageSent = false;

module.exports.config = {
    name: "zai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATIONAL",
    usePrefix: false,
    commandCategory: "other",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const uid = event.senderID;

    const apiUrl = isPrimaryApiStable ? `${primaryApiUrl}?ask=${content}` : `${backupApiUrl}?content=${content}`;
    const apiName = isPrimaryApiStable ? 'Original Axios' : 'Backup Axios';

    if (!content) return api.sendMessage("Please provide a question first.", event.threadID, event.messageID);

    try {
        api.sendMessage(`Please bear with me while I ponder your request...`, event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const result = response.data.reply;

        if (result === undefined) {
            throw new Error("Axios response is undefined");
        }

        const userData = await getUserData(uid);
        userData.requestCount = (userData.requestCount || 0) + 1;
        userData.responses = userData.responses || [];
        userData.responses.push({ question: content, response: result });
        await saveUserData(uid, userData, apiName);

        recordChat(uid, content);

        const totalRequestCount = await getTotalRequestCount();
        const userNames = await getUserNames(api, uid);

        const responseMessage = `${result}\n\n📝 Request Count: ${userData.requestCount}\n👤 Asked by: ${userNames.join(', ')}`;
        api.sendMessage(responseMessage, event.threadID, event.messageID);

        await saveAxiosStatus(apiName);

        if (apiName !== 'Original Axios' && !axiosSwitchedMessageSent) {
            isPrimaryApiStable = true;
            axiosSwitchedMessageSent = true;
            api.sendMessage("🔃 | Switching back to the original Axios. Just please wait.", event.threadID);
        }

    } catch (error) {
        console.error(error);

        try {
            api.sendMessage("🔄 | Trying Switching Axios!", event.threadID);
            const backupResponse = await axios.get(`${backupApiUrl}?content=${content}`);
            const backupResult = backupResponse.data.content;

            if (backupResult === undefined) {
                throw new Error("Backup Axios response is undefined");
            }

            const userData = await getUserData(uid);
            userData.requestCount = (userData.requestCount || 0) + 1;
            userData.responses = userData.responses || [];
            userData.responses.push({ question: content, response: backupResult });
            await saveUserData(uid, userData, 'Backup Axios');

            const totalRequestCount = await getTotalRequestCount();
            const userNames = await getUserNames(api, uid);

            const responseMessage = `${backupResult}\n\n📝 Request Count: ${userData.requestCount}\n👤 Asked by: ${userNames.join(', ')}`;
            api.sendMessage(responseMessage, event.threadID, event.messageID);

            isPrimaryApiStable = false;

            await saveAxiosStatus('Backup Axios');

        } catch (backupError) {
            console.error(backupError);
            api.sendMessage("An error occurred while processing your request.", event.threadID);

            await saveAxiosStatus('Unknown');
        }
    }
};

async function getUserData(uid) {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData[uid] || {};
    } catch (error) {
        return {};
    }
}

async function saveUserData(uid, data, apiName) {
    try {
        const existingData = await getUserData(uid);
        const newData = { ...existingData, ...data, apiUsed: apiName };
        const allData = await getAllUserData();
        allData[uid] = newData;
        await fs.writeFile(storageFile, JSON.stringify(allData, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

async function getTotalRequestCount() {
    try {
        const allData = await getAllUserData();
        return Object.values(allData).reduce((total, userData) => total + (userData.requestCount || 0), 0);
    } catch (error) {
        return 0;
    }
}

async function getUserNames(api, uid) {
    try {
        const userInfo = await api.getUserInfo([uid]);
        return Object.values(userInfo).map(user => user.name || `User${uid}`);
    } catch (error) {
        c
