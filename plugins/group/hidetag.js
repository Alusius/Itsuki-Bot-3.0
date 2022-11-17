var handler = async(msg, { 
client, text, participants 
}) => {
client.reply(msg.from, text.length > 0 ? text : msg.quoted.text.length > 0 ? msg.quoted.text : ' ', msg, { mentions: participants.map(a => a.id)})
}
handler.help = ['hidetag <pesan>']
handler.tags = ['group']
handler.command = /^(hidetag)$/i

handler.group = true
handler.admin = true

module.exports = handler
