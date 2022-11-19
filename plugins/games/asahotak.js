var fetch = require('node-fetch')
var handler = async(msg, { 
client, usedPrefix 
}) => {
client.asahotak = client.asahotak ? client.asahotak : {}
if (msg.from in client.asahotak) return client.reply(msg.from, '🚩 Masih ada soal belum terjawab di chat ini.', client.asahotak[msg.from][0])
var gh = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Games/asahotak.json')
if (!gh.ok) return await client.reply(msg.from, `${gh.status} ${gh.statusText}`, msg)
var data = await gh.json()
var v = await Func.pickRandom(data)
var but = await Func.satuButton('.ao','Bantuan')
client.asahotak[msg.from] = [
await client.reply(msg.from, `*乂  A S A H - O T A K*

${v.soal}

Timeout : *[ ${(120000 / 1000).toFixed(2)} Detik ]*
Ketik ${usedPrefix}ao untuk bantuan.
`.trim(), msg, { buttons: but, headerType: 5, footer: wm }),
v, msg.sender,
setTimeout(async () => {
if (client.asahotak[msg.from]) await client.reply(msg.from, `*🚩 Waktu habis!*\n\nJawaban : *[ ${v.jawaban} ]*`, client.asahotak[msg.from][0])
delete client.asahotak[msg.from]
}, 120000)
]
}
handler.help = ['asahotak']
handler.tags = ['gm']
handler.command = /^asahotak/i

module.exports = handler
