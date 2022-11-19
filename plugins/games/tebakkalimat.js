var fetch = require('node-fetch')
var handler = async(msg, { 
client, usedPrefix 
}) => {
client.tebakkalimat = client.tebakkalimat ? client.tebakkalimat : {}
if (msg.from in client.tebakkalimat) return client.reply(msg.from, '🚩 Masih ada soal belum terjawab di chat ini.', client.tebakkalimat[msg.from][0])
var gh = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Games/tebakkalimat.json')
if (!gh.ok) return await client.reply(msg.from, `${gh.status} ${gh.statusText}`, msg)
var data = await gh.json()
var v = await Func.pickRandom(data)
var but = await Func.satuButton('.kalisos','Bantuan')
client.tebakkalimat[msg.from] = [
await client.reply(msg.from, `*乂  T E B A K - K A L I M A T*

${v.soal}

Timeout : *[ ${(120000 / 1000).toFixed(2)} Detik ]*
Ketik ${usedPrefix}kalisos untuk bantuan.
`.trim(), msg, { buttons: but, headerType: 5, footer: wm }),
v, msg.sender,
setTimeout(async () => {
if (client.tebakkalimat[msg.from]) await client.reply(msg.from, `*🚩 Waktu habis!*\n\nJawaban : *[ ${v.jawaban} ]*`, client.tebakkalimat[msg.from][0])
delete client.tebakkalimat[msg.from]
}, 120000)
]
}
handler.help = ['tebakkalimat']
handler.tags = ['gm']
handler.command = /^tebakkalimat/i

module.exports = handler
