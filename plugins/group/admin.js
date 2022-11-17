const handler = async (msg, { 
client, text, command, usedPrefix 
}) => {
var who = msg.mentionedJid[0] ? msg.mentionedJid : msg.quoted ? msg.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (!text && !msg.quoted) return msg.reply(`🚩 Mention or reply target`)
if (command === 'kick') {
client.groupParticipantsUpdate(msg.from, who, 'remove').then((res) => msg.reply(Func.jsonformat(res))).catch((err) => msg.reply(Func.jsonformat(err)))
}
if (command === 'add') {
client.groupParticipantsUpdate(msg.from, who, 'add').then((res) => msg.reply(Func.jsonformat(res))).catch((err) => msg.reply(Func.jsonformat(err)))
}
if (command === 'promote') {
client.groupParticipantsUpdate(msg.from, who, 'promote').then((res) => msg.reply(Func.jsonformat(res))).catch((err) => msg.reply(Func.jsonformat(err)))
}
if (command === 'demote') {
client.groupParticipantsUpdate(msg.from, who, 'demote').then((res) => msg.reply(Func.jsonformat(res))).catch((err) => msg.reply(Func.jsonformat(err)))
}
}
handler.help = ['kick','add','promote','demote'].map(v => v + ' <@tag/reply>')
handler.tags = ['group']
handler.command = /^(kick|add|promote|demote)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler
