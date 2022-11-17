var handler = async (msg, { 
client, usedPrefix, command, text
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <query>\n\n*Contoh :* ${usedPrefix + command} elaina`)
try {
if (command == 'alphacoders') {
var listAlpha = []
var alp = await Scraper.alphacoders(text)
var Alpha = alp.result
var forFirst = Func.pickRandom(Alpha)
for (let i of Alpha) {
listAlpha.push({
title: i.img, rowId: `.madenewcode ${i.img}|${i.widthl}|${i.height}|${i.ext}|${i.url}|${i.thumb}`, description: `ID: ${i.id}`})
}
const sections = [{
title: "Hasil Keseluruhan Dari " + text,
rows: listAlpha
}]
const listMessage = {
text: '🚩 Berikut adalah hasil lainnya secara keseluruhan, pilih gambar yang ingin diunduh disini.',
footer: Info.botWm,
title: `*乂 R E S U L T  -  A L P H A C O D E R S*\n`,
buttonText: "Hasil keseluruhan dari " + text,
sections
}
var firstAlpha = await client.sendImage(msg.from, forFirst.thumb, `*乂 A L P H A C O D E R S*\n\n  *◦ Url :* ${forFirst.img}\n  *◦ Width :* ${forFirst.width}\n  *◦ Height :* ${forFirst.height}\n  *◦ Ext :* ${forFirst.ext}\n  *◦ Source :* ${forFirst.url}`, msg, { isUrl:true })
setTimeout(() => {
client.sendMessage(msg.from, listMessage, { quoted: firstAlpha })
}, 2500)
setTimeout(() => {
firstAlpha
}, 0)
} 
if (command == 'madenewcode') {
var [a, b, c, d, e, f] = text.split`|`
client.sendImage(msg.from, f, `*乂 A L P H A C O D E R S*\n\n  *◦ Url :* ${a}\n  *◦ Width :* ${b}\n  *◦ Height :* ${c}\n  *◦ Ext :* ${d}\n  *◦ Source :* ${e}`, msg, { isUrl:true })
}
} catch {
msg.reply('*🚩 Hasil tidak ditemukan.*')
}
}
handler.help = ['alphacoders']
handler.tags = ['web']
handler.command = /^(alphacoders|madenewcode)$/i

handler.limit = true

module.exports = handler

// ???
