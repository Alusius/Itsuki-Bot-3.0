var handler = async (msg, { 
client, text, usedPrefix, command 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <query>\n\n*Contoh :* ${usedPrefix + command} Patrick`)
client.sendReact(msg.from, '🕒', msg.key)
try {
Scraper.stickersearch(text).then(res => {
for (let i = 0; i < res.sticker.length; i++) {
client.sendImageAsSticker(msg.from, res.sticker[i], msg, { packname: Info.stickerpack, author: Info.botName })
}
})
} catch {
client.sendReact(msg.from, '❌', msg.key)
msg.reply(`*🚩 Hasil tidak ditemukan.*`)
}
}
handler.help = ['stickersearch','stikersearch'].map(v => v + ' <url>')
handler.tags = ['web']
handler.command = /^(searchsticker|stickersearch|stikersearch)$/i

handler.limit = true

module.exports = handler
