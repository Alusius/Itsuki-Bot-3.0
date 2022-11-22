var handler = async(msg, { 
isOwner 
}) => {
let grup = Object.keys(await client.groupFetchAllParticipating())
let lis = []
for (let i of grup) {
const data = await client.groupMetadata(i)
let isMem = data.participants
let isAtmin = (data.participants).filter(v => v.admin == 'admin')
let isOwner = (data.participants).filter(v => v.admin == 'superadmin')
lis.push({
title: data.subject, rowId: `${isOwner ? '.leave': '.gcmetadata'} ${data.id}`, description: `${isMem.length} Member || ${isAtmin.length + isOwner.length} Admin`})
}
let sections = [{
title: "LIST CHAT GROUP BOT",
rows: lis
}]
let listMessage = {
text: "Berikut adalah list group chat pada bot" + `${isOwner ? "\n\nPilih grup agar bot keluar dari grup yang kami pilih." : "\n\nPilih grup dibawah untuk mendapatkan informasi detail grup."}`,
buttonText: "LIST GROUP",
sections
}
client.sendMessage(msg.from, listMessage, { quoted: msg })
}
handler.help = ['listgroup', 'listgc']
handler.tags = ['info']
handler.command = /^(listgc|listgrup|listgroup|gruplist|grouplist|gclist)$/i

module.exports = handler

// id untuk owner sama user beda 🗿
