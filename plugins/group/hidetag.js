var handler = async(msg, { 
client, text, participants 
}) => {
client.reply(msg.from, text == 'undefined' ? text : msg.quoted.text == 'undefined' ? msg.quoted.text : ' ', msg, { mentions: participants.map(a => a.id)})
}
handler.help = ['hidetag <pesan>']
handler.tags = ['group']
handler.command = /^(hidetag)$/i

handler.group = true
handler.admin = true

module.exports = handler
