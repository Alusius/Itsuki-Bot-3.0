var handler = async(msg, { 
text, usedPrefix, command
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <judul>\n\n*Contoh :* ${usedPrefix + command} Perfect - Ed Sheeran`)
try {
require('@bochilteam/scraper').lyricsv2(text).then(async v => {
msg.reply(`*${v.title} - ${v.author}*\n\n${v.lyrics}`)
})
} catch {
msg.reply(`🚩 Hasil tidak ditemukan.`)
}
}
handler.help = ['lirik','lyrics']
handler.tags = ['web']
handler.command = /^(lirik|lyrics)$/i

handler.limit = true

module.exports = handler
