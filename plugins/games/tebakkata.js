var fetch = require('node-fetch')
var handler = async(msg, { 
client, usedPrefix 
}) => {
client.tebakkata = client.tebakkata ? client.tebakkata : {}
if (msg.from in client.tebakkata) return client.reply(msg.from, '🚩 Masih ada soal belum terjawab di chat ini.', client.tebakkata[msg.from][0])
var gh = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Games/tebakkata.json')
if (!gh.ok) return await client.reply(msg.from, `${gh.status} ${gh.statusText}`, msg)
var data = await gh.json()
var v = await Func.pickRandom(data)
var but = await Func.satuButton('.teka','Bantuan')
client.tebakkata[msg.from] = [
await client.reply(msg.from, `*乂  T E B A K  - K A T A*

${v.soal}

Timeout : *[ ${(120000 / 1000).toFixed(2)} Detik ]*
Ketik ${usedPrefix}teka untuk bantuan.
`.trim(), msg, { buttons: but, headerType: 5, footer: wm }),
v, msg.sender,
setTimeout(async () => {
if (client.tebakkata[msg.from]) await client.reply(msg.from, `*🚩 Waktu habis!*\n\nJawaban : *[ ${v.jawaban} ]*`, client.tebakkata[msg.from][0])
delete client.tebakkata[msg.from]
}, 120000)
]
}
handler.help = ['tebakkata']
handler.tags = ['gm']
handler.command = /^tebakkata/i

module.exports = handler
