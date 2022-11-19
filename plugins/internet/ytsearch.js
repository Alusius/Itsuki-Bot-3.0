var handler = async (msg, { 
client, usedPrefix, command, text
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <query>\n\n*Contoh :* ${usedPrefix + command} bot wa`)
var list = []
var result = await require('yt-search')(text)
var res = result.all
for (let i of res) {
list.push({
title: i.title, rowId: `.ytdl ${i.url}`, description: i.description })
}
const sections = [{
title: "Hasil pencarian dari " + text,
rows: list
}]
const listMessage = {
text: `🚩 Berikut merupakan hasil pencarian dari *${text}*`,
buttonText: "Pilih Disini",
sections
}
client.sendMessage(msg.from, listMessage, { quoted: msg })
}
handler.help = ['youtubesearch','ytsearch','yts']
handler.tags = ['web']
handler.command = /^(youtubesearch|ytsearch|yts)$/i

handler.limit = true

module.exports = handler

// silahkan ambil
