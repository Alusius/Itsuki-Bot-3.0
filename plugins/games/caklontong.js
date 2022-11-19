var fetch = require('node-fetch')
var handler = async(msg, { 
client, usedPrefix 
}) => {
client.caklontong = client.caklontong ? client.caklontong : {}
if (msg.from in client.caklontong) return client.reply(msg.from, '🚩 Masih ada soal belum terjawab di chat ini.', client.caklontong[msg.from][0])
var gh = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Games/caklontong.json')
if (!gh.ok) return await client.reply(msg.from, `${gh.status} ${gh.statusText}`, msg)
var data = await gh.json()
var v = await Func.pickRandom(data)
var but = await Func.satuButton('.calo','Bantuan')
client.caklontong[msg.from] = [
await client.reply(msg.from, `*乂  C A K - L O N T O N G*

${v.soal}

Timeout : *[ ${(120000 / 1000).toFixed(2)} Detik ]*
Ketik ${usedPrefix}calo untuk bantuan.
`.trim(), msg, { buttons: but, headerType: 5, footer: wm }),
v, msg.sender,
setTimeout(async () => {
if (client.caklontong[msg.from]) await client.reply(msg.from, `*🚩 Waktu habis!*\n\nJawaban : *[ ${v.jawaban} ]\nDeskripsi : ${v.deskripsi}*`, client.caklontong[msg.from][0])
delete client.caklontong[msg.from]
}, 120000)
]
}
handler.help = ['caklontong']
handler.tags = ['gm']
handler.command = /^caklontong/i

module.exports = handler
