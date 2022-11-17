const handler = async (msg, { 
client, usedPrefix 
}) => {
var listHit = []
for (let i of hitBot) {
listHit.push({
title: `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 : ${usedPrefix + i.id}`, rowId: `${usedPrefix + i.id}`, description: `𝗣𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗮𝗻 : ${i.total}x`})
}
const sections = [{
title: "DAFTAR TOTAL PENGGUNAAN FITUR BOT",
rows: listHit
}]
const listMessage = {
text: '🚩 Berikut adalah total penggunaan fitur bot, pilih fitur yang ingin digunakan disini.',
footer: Info.botWm,
title: `*乂 D A S H B O A R D - B O T*\n`,
buttonText: "Daftar Penggunaan Fitur",
sections
}
client.sendMessage(msg.from, listMessage, { quoted: msg })
}
handler.help = ['dashboard']
handler.tags = ['info']
handler.command = /^(db|dashboard)$/i

module.exports = handler
