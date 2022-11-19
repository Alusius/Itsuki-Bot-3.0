var fetch = require('node-fetch')
var handler = async(msg, { 
client, usedPrefix 
}) => {
client.tebaktebakan = client.tebaktebakan ? client.tebaktebakan : {}
if (msg.from in client.tebaktebakan) return client.reply(msg.from, '🚩 Masih ada soal belum terjawab di chat ini.', client.tebaktebakan[msg.from][0])
var gh = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Games/tebaktebakan.json')
if (!gh.ok) return await client.reply(msg.from, `${gh.status} ${gh.statusText}`, msg)
var data = await gh.json()
var v = await Func.pickRandom(data)
var but = await Func.satuButton('.tekod','Bantuan')
client.tebaktebakan[msg.from] = [
await client.reply(msg.from, `*乂  T E B A K - T E B A K A N*

${v.soal}

Timeout : *[ ${(120000 / 1000).toFixed(2)} Detik ]*
Ketik ${usedPrefix}tekod untuk bantuan.
`.trim(), msg, { buttons: but, headerType: 5, footer: wm }),
v, msg.sender,
setTimeout(async () => {
if (client.tebaktebakan[msg.from]) await client.reply(msg.from, `*🚩 Waktu habis!*\n\nJawaban : *[ ${v.jawaban} ]*`, client.tebaktebakan[msg.from][0])
delete client.tebaktebakan[msg.from]
}, 120000)
]
}
handler.help = ['tebaktebakan']
handler.tags = ['gm']
handler.command = /^tebaktebakan/i

module.exports = handler
