const handler = async (msg, { 
client, usedPrefix 
}) => {
var listHit = []
for (let i of hitBot) {
listHit.push({
title: `Fitur : ${i.id}`, rowId: `${usedPrefix + i.id}`, description: `Penggunaan : ${i.total} Kali`})
}
const sections = [{
title: "DAFTAR TOTAL PENGGUNAAN FITUR BOT",
rows: listHit
}]
const listMessage = {
text: '🚩 Berikut adalah total penggunaan fitur bot, pilih fitur yang ingin digunakan disini.',
buttonText: "Daftar Penggunaan Fitur",
sections
}
client.sendMessage(msg.from, listMessage, { quoted: msg })
}
handler.help = ['dashboard']
handler.tags = ['info']
handler.command = /^(db|dashboard)$/i

module.exports = handler
