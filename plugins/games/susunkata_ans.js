const similarity = require('similarity')
const threshold = 0.72

const fs = require('fs')
var handler = msg => msg
handler.before = async function (msg) {
var poin = await Func.angkaBesar()
var id = msg.from
if (!msg.quoted || !msg.quoted.fromMe || !msg.quoted.isBaileys || !/Ketik.*sunkes/i.test(msg.quoted.contentText)) return !0
this.susunkata = this.susunkata ? this.susunkata : {}
if (!(id in this.susunkata)) return msg.reply('🚩 Soal itu telah berakhir.')
if (msg.quoted.id == this.susunkata[id][0].id) {
let json = JSON.parse(JSON.stringify(this.susunkata[id][1]))
if (['.sunkes', 'Bantuan', ''].includes(msg.text)) return !0
if (msg.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
user.point += poin * 1
await this.sendMessage(msg.from, { sticker: fs.readFileSync('./global/media/Benar.webp')}, { quoted: msg })
this.reply(msg.from, `*+ ${poin} Poin.*`, msg)            
clearTimeout(this.susunkata[id][3])
delete this.susunkata[id]
} else if (similarity(msg.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) msg.reply(`🚩 Sedikit Lagi Benar!`)
else {
this.sendMessage(msg.from, { sticker: fs.readFileSync('./global/media/Salah.webp')}, { quoted:msg })
}
}
return !0
}
handler.exp = 0

module.exports = handler
