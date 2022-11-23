var handler = async (msg, { 
client, usedPrefix, command, text
}) => {
if (command == 'cnn' || command == 'cnn-news' || command == 'cnnnews') {
var listBerita = []
var Berita = await require('dhn-api').CNNNews()
var forFirst = Func.pickRandom(Berita)
var firstNews = await client.sendImage(msg.from, forFirst.berita_thumb, `*乂 C N N  -  N E W S*\n\n  *◦ Berita :* ${forFirst.berita}\n  *◦ Link :* ${forFirst.berita_url}`, msg, { isUrl:true })
Func.sleep(500)
for (let i of Berita) {
listBerita.push({
title: i.berita, rowId: `.madenewberita ${i.berita_thumb}|${i.berita_url}|${i.berita}`, description: `Link: ${i.berita_url}`})
}
const sections = [{
title: "LIST BERITA CNN NEWS HARI INI",
rows: listBerita
}]
const listMessage = {
text: 'Berikut adalah berita lainnya pada hari ini, pilih berita yang ingin dibaca disini.',
buttonText: "CNN TODAY",
sections
}
client.sendMessage(msg.from, listMessage, { quoted: firstNews })
} 
if (command == 'madenewberita') {
var [buf, link, ber] = text.split`|`
client.sendImage(msg.from, buf, `*乂 C N N  -  N E W S*\n\n  *◦ Berita :* ${ber}\n  *◦ Link :* ${link}`, msg, { isUrl:true })
}
}
handler.help = ['cnn-news']
handler.tags = ['web']
handler.command = /^(cnn-news|cnnnews|cnn|madenewberita)$/i

handler.limit = true

module.exports = handler
