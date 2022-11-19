var fetch = require('node-fetch')
var handler = async(msg, { 
client, usedPrefix 
}) => {
client.susunkata = client.susunkata ? client.susunkata : {}
if (msg.from in client.susunkata) return client.reply(msg.from, '🚩 Masih ada soal belum terjawab di chat ini.', client.susunkata[msg.from][0])
var gh = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Games/susunkata.json')
if (!gh.ok) return await client.reply(msg.from, `${gh.status} ${gh.statusText}`, msg)
var data = await gh.json()
var v = await Func.pickRandom(data)
var but = await Func.satuButton('.sunkes','Bantuan')
client.susunkata[msg.from] = [
await client.reply(msg.from, `*乂  S U S U N - K A T A*

Soal ${v.soal}
Tipe ${v.tipe}

Timeout : *[ ${(120000 / 1000).toFixed(2)} Detik ]*
Ketik ${usedPrefix}sunkes untuk bantuan.
`.trim(), msg, { buttons: but, headerType: 5, footer: wm }),
v, msg.sender,
setTimeout(async () => {
if (client.susunkata[msg.from]) await client.reply(msg.from, `*🚩 Waktu habis!*\n\nJawaban : *[ ${v.jawaban} ]*`, client.susunkata[msg.from][0])
delete client.susunkata[msg.from]
}, 120000)
]
}
handler.help = ['susunkata']
handler.tags = ['gm']
handler.command = /^susunkata/i

module.exports = handler
