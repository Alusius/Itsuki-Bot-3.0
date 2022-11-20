const levelling = require('../../system/levelling')
const { MessageType } = require('@adiwajshing/baileys')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const moment = require('moment-timezone')
const defaultMenu = {
  before: ``,
  header: '*%category*',
  body: ' ◦ %cmd %islimit %isPremium',
  footer: '',
  after: ``,
}
const handler = async (msg, { 
client, usedPrefix: _p, args, command 
}) => {
var tags
var teks = `${args[0]}`.toLowerCase()
let arrayMenu = ['all','gm','xp','group','tools','convert','asupan','dl','nsfw','anime','web','random']
if (!arrayMenu.includes(teks)) teks = '404'
if (teks == 'all') tags = {
'gm': 'GAMES',
'xp': 'LIMIT & LEVELLING',
'group': 'GROUP',
'tools': 'TOOLS',
'convert': 'CONVERTER',
'asupan': 'ASUPAN',
'dl': 'DOWNLOADER',
'nsfw': 'NSFW',
'anime': 'ANIME',
'web': 'INTERNET',
'random': 'RANDOM',
}
if (teks == 'gm') tags = {
'gm': 'GAMES',
}
if (teks == 'xp') tags = {
'xp': 'LIMIT & LEVELLING',
}
if (teks == 'group') tags = {
'group': 'GROUP',
}
if (teks == 'tools') tags = {
'tools': 'TOOLS',
}
if (teks == 'convert') tags = {
'convert': 'CONVERTER',
}
if (teks == 'asupan') tags = {
'asupan': 'ASUPAN',
}
if (teks == 'dl') tags = {
'dl': 'DOWNLOADER',
}
if (teks == 'nsfw') tags = {
'nsfw': 'NSFW',
}
if (teks == 'anime') tags = {
'anime': 'ANIME',
}
if (teks == 'web') tags = {
'web': 'INTERNET'
}
if (teks == 'random') tags = {
'random': 'RANDOM'
}

try {
var package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../../package.json')).catch(_ => '{}'))
var { exp, limit, level, role, rank, money, registered } = global.db.data.users[msg.sender]
var { min, xp, max } = levelling.xpRange(level, global.multiplier)
var name = registered ? global.db.data.users[msg.sender].name : await(client.getName(msg.sender)) 
var d = new Date(new Date + 3600000)
var locale = 'id'
// d.getTimeZoneOffset()
// Offset -420 is 18.00
// Offset    0 is  0.00
// Offset  420 is  7.00
var weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
var week = d.toLocaleDateString(locale, { weekday: 'long' })
var date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
var dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
var time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
var _uptime = process.uptime() * 1000
var _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
var muptime = Func.clockString(_muptime)
var uptime = Func.clockString(_uptime)
var totalreg = Object.keys(global.db.data.users).length
var rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
var help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
return {
help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
prefix: 'customPrefix' in plugin,
limit: plugin.limit,
premium: plugin.premium,
enabled: !plugin.disabled,
}
})
if (teks == '404') {
return client.sendMessage(msg.from, {
text: `Sistem otomatis (WhatsApp Bot) yang dapat membantu untuk melakukan sesuatu, mencari dan mendapatkan data/informasi hanya melalui WhatsApp.`,
footer: Info.botWm,
buttonText: "LIST MENU",
"sections": [
{
"rows": [
{
"title": "SEMUA PERINTAH",
"description": "Menampilkan seluruh command bot.",
"rowId": ".? all"
},
{
"title": "GAME",
"description": "Menu dengan game seru dengan hadiah poin tertentu.",
"rowId": ".? gm"
},
{
"title": "LIMIT/LEVELLING",
"description": "Informasi mengenai status limit dan inventory user.",
"rowId": ".? xp"
},
{
"title": "GROUP",
"description": "Fitur yang dapat digunakan untuk mempermudah admin grup.",
"rowId": ".? group"
},
{
"title": "TOOLS",
"description": "Fitur yang membantu kamu untuk mendapatkan dan membentuk sesuatu.",
"rowId": ".? tools"
},
{
"title": "CONVERTER",
"description": "Fitur bot sebagai alat pengubah media yang dikirim.",
"rowId": ".? convert"
},
{
"title": "ASUPAN",
"description": "Fitur pemberian media yang mengandung seseorang berporos cantik.",
"rowId": ".? asupan"
},
{
"title": "DOWNLOADER",
"description": "Fitur bot sebagai pengunduh segala bentuk url.",
"rowId": ".? dl"
},
{
"title": "ANIME",
"description": "Fitur berisikan konten konten anime.",
"rowId": ".? anime"
},
{
"title": "INTERNET",
"description": "Fitur yang berfungsi sebagai pemberi informasi hanya melalui internet.",
"rowId": ".? web"
},
{
"title": "RANDOM",
"description": "Fitur random yang berisikan hiburan dengan internet.",
"rowId": ".? random"
},
{
"title": "NSFW/HENTAI",
"description": "Fitur yang mengandung pornografi dan bersifat vulgar.",
"rowId": ".? nsfw"
},
]
}
],
mentions: [Info.owner[0]]
}, { 
quoted: msg, 
contextInfo: {
stanzaId: msg.key.id,
participant: msg.sender
}
}
)
}
var groups = {}
for (let tag in tags) {
groups[tag] = []
for (let plugin of help)
if (plugin.tags && plugin.tags.includes(tag))
if (plugin.help) groups[tag].push(plugin)
// for (let tag of plugin.tags)
//   if (!(tag in tags)) tags[tag] = tag
}
client.menu = client.menu ? client.menu : {}
var before = client.menu.before || defaultMenu.before
var header = client.menu.header || defaultMenu.header
var body = client.menu.body || defaultMenu.body
var footer = client.menu.footer || defaultMenu.footer
var after = client.menu.after || (client.user.jid == global.client.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.client.user.jid.split`@`[0]}`) + defaultMenu.after
var _text = [
before,
...Object.keys(tags).map(tag => {
return header.replace(/%category/g, tags[tag]) + '\n' + [
...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
return menu.help.map(help => {
return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
.replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
.replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
.trim()
}).join('\n')
}),
footer
].join('\n')
}),
after
].join('\n')
text = typeof client.menu == 'string' ? client.menu : typeof client.menu == 'object' ? _text : ''
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: client.user.name,
npmname: package.name,
npmdesc: package.description,
version: package.version
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
var guf = await Func.getBuffer(Info.image.menu)
var buffer = await Func.resize(guf, 300, 150)
var but = await Func.duaButton('.db','📚 Dashboard','.owner','👨🏻‍💻 Owner')
var isOr = 'Ⓛ = Fitur memakai limit\nⓅ = Khusus pengguna premium'
await client.sendImage(msg.from, buffer, text, msg, { asLocation: true, buttons: but, headerType: 4, footer: isOr })
} catch (e) {
client.reply(msg.from, 'Maaf, menu sedang error', msg)
throw e
}
}
handler.help = ['menu', 'help', '?']
handler.command = /^(menu|help|\?)$/i

module.exports = handler
