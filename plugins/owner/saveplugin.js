var handler = async (msg, { 
text, usedPrefix, command 
}) => {
if (!text) return msg.reply('🚩 Masukkan letak file.')
if (!msg.quoted.text) return msg.reply('🚩 Balas pesan yang ingin disimpan.')
var path = `${text}`
await require('fs').writeFileSync(path, msg.quoted.text)
await msg.reply(`🚩 Berhasil tersimpan di ${path}`)
process.send("reset")
}
handler.help = ['sf'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^sf$/i

handler.owner = true

module.exports = handler
