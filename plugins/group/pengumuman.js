var handler = async(msg, { 
client, text, participants }) => {
var teks = `*乂 P E N G U M U M A N*
\n ${text == 'undefined' ? text : msg.quoted.text == 'undefined' ? msg.quoted.text : ' '}\n\n` // isilah atmin tomlol:v
for (let mem of participants) {
teks += `  ◦ @${mem.id.split('@')[0]}\n`
}
client.reply(msg.from, teks, msg, { mentions: participants.map(a => a.id)})
}
handler.help = ['tagall','pengumuman'].map(v => v + ' <pesan>')
handler.tags = ['group']
handler.command = /^(tagall|pengumuman)$/i

handler.group = true
handler.admin = true

module.exports = handler
