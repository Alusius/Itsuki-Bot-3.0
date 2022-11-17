var handler = async(msg, { 
text, usedPrefix, command
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <${command == 'pinterest' ? 'query' : 'url'}>`)
try {
if (command == 'pinterest' || command == 'pin') {
Scraper.pinterest(text).then(async v => {
let rs = await Func.pickRandom(v)
client.sendImage(msg.from, rs, `*🍟 Url :* ${rs}`, msg, { isUrl: true })
})
}
if (command == 'pinterestdl' || command == 'pindl') {
var b = await Func.getBuffer(text)
client.sendImage(msg.from, b, `*🍟 Fetching :* ${Func.speedNow()}`, msg, { isUrl: true })
}
} catch {
msg.reply(`🚩 Hasil tidak ditemukan.`)
}
}
handler.help = ['pin','pinterest','pindl','pinterestdl']
handler.tags = ['web']
handler.command = /^(pin|pinterest|pindl|pinterestdl)$/i

handler.limit = true

module.exports = handler
