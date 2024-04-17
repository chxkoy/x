module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['info'],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Develeoper',
};
module.exports.run = async function({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `• —— [ 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ] —— •\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `╭─❍\n➠ ${prefix}${commands[i]}\n╰───────────⟡\n\n`;
      }
      helpMessage += '\n• —— [ 𝗔𝗟𝗟 𝗘𝗩𝗘𝗡𝗧𝗦 ] —— •\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `╭─❍\n➠ ${prefix}${eventCommand}\n╰───────────⟡\n\n`;
      });
      helpMessage += `\n› Page ${page}/${Math.ceil(commands.length / pages)}\n› To view the next page, type “${prefix}help page number” To view information about a specific command, type “${prefix}help command name”\n› Create your own bot here using appstate\n› https://x3x-v0xr.onrender.com/`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `• —— [ 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ] —— •\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `╭─❍\n➠ ${prefix}${commands[i]}\n╰───────────⟡\n`;
      }
      helpMessage += '\n• —— [ 𝗔𝗟𝗟 𝗘𝗩𝗘𝗡𝗧𝗦 ] —— •\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `╭─❍\n➠ ${prefix}${eventCommand}\n╰───────────⟡\n`;
      });
      helpMessage += `\n› Page ${page}/${Math.ceil(commands.length / pages)}\n› To view the next page, type “${prefix}help page number” To view information about a specific command, type “${prefix}help command name”\n› Create your own bot here using appstate\n› https://x3x-v0xr.onrender.com/`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          description,
          usage,
          credits,
          cooldown,
          hasPrefix
        } = command;
        const roleMessage = role !== undefined ? (role === 0 ? '╭─❍\n➠ 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: user\n╰───────────⟡\n' : (role === 1 ? '╭─❍\n➠ 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: admin\n╰───────────⟡\n' : (role === 2 ? '╭─❍\n➠ 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: thread Admin\n╰───────────⟡\n' : (role === 3 ? '╭─❍\n➠ 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: super Admin\n╰───────────⟡\n' : '')))) : '';
        const aliasesMessage = aliases.length ? `╭─❍\n➠ 𝗔𝗟𝗜𝗔𝗦𝗘𝗦: ${aliases.join(', ')}\n╰───────────⟡\n` : '';
        const descriptionMessage = description ? `╭─❍\n➠ 𝗗𝗘𝗦𝗖: ${description}\n╰───────────⟡\n` : '';
        const usageMessage = usage ? `╭─❍\n➠ 𝗨𝗦𝗔𝗚𝗘: ${usage}\n╰───────────⟡\n` : '';
        const creditsMessage = credits ? `╭─❍\n➠ 𝗖𝗥𝗘𝗗𝗜𝗧𝗦: ${credits}\n╰───────────⟡\n` : '';
        const versionMessage = version ? `╭─❍\n➠ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${version}\n╰───────────⟡\n` : '';
        const cooldownMessage = cooldown ? `╭─❍\n➠ 𝗖𝗢𝗢𝗟 𝗗𝗢𝗪𝗡: ${cooldown} second(s)\n╰───────────⟡\n` : '';
        const message = `╭─❍\n➠ 𝗡𝗔𝗠𝗘: ${name}\n╰───────────⟡\n${versionMessage}${roleMessage}${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports.handleEvent = async function({
  api,
  event,
  prefix
}) {
  const {
    threadID,
    messageID,
    body
  } = event;
  const message = prefix ? 'this is my prefix : ' + prefix : "╭─❍\n➠ Sorry i don't have prefix\n╰───────────⟡";
  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(message, threadID, messageID);
  }
}
