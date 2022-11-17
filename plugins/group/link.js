var handler = async (msg, { 
client 
}) => {
var groupMetadata = msg.isGroup ? await client.groupMetadata(msg.from).catch(e => {}) : ''
var response = await client.groupInviteCode(msg.from)
client.reply(msg.from, `https://chat.whatsapp.com/${response}\n\n*Link Group :* ${groupMetadata.subject}`, msg)
}
handler.help = ['linkgc','linkgroup']
handler.tags = ['group']
handler.command = /^(link|linkgroup|linkgc)$/i

handler.botAdmin = true
handler.group = true

module.exports = handler

// 😇
