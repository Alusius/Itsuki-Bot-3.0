const sock = require('./socket')
const util = require('util')
const fs = require('fs')
const chalk = require('chalk')
const { proto, generateWAMessage, areJidsSameUser } = require('@adiwajshing/baileys')
const isNumber = x => typeof x === 'number' && !isNaN(x)

module.exports = {
async handler(chatUpdate) {
global.botNumber = await this.decodeJid(this.user.id)
global.Only = JSON.parse(fs.readFileSync('./global/message.json'))
global.hitCmd = require("./database/dashboard.js").addCmd
global.hitBot = JSON.parse(fs.readFileSync('./system/database/dashboard.json'))
global.wm = `${Info.bot.name} || ${Object.keys(db.data.users).length} User`

if (global.db.data == null) await loadDatabase()
this.msgqueque = this.msgqueque || []
if (!chatUpdate) return
let msg = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!msg) return
try {
msg = sock.smsg(this, msg) || msg
if (!msg) return
msg.exp = 0
msg.limit = false
try {
global.user = db.data.users[msg.sender]
if (typeof user !== 'object')
db.data.users[msg.sender] = {}
if (user) {
if (!isNumber(user.exp))
user.exp = 0
if (!isNumber(user.limit))
user.limit = 20
if (!isNumber(user.point))
user.point = 20
if (!isNumber(user.lastclaim))
user.lastclaim = 0
if (!('registered' in user))
user.registered = false
if (!user.registered) {
if (!('name' in user))
user.name = msg.name
if (!isNumber(user.age))
user.age = -1
if (!isNumber(user.regTime))
user.regTime = -1
}
if (!isNumber(user.afk))
user.afk = -1
if (!('afkReason' in user))
user.afkReason = ''
if (!('banned' in user))
user.banned = false
if (!isNumber(user.warn))
user.warn = 0
if (!isNumber(user.level))
user.level = 0
if (!('role' in user))
user.role = 'Beginner'
if (!('autolevelup' in user))
user.autolevelup = true

if (!isNumber(user.money))
user.money = 0
if (!isNumber(user.health))
user.health = 100
if (!isNumber(user.limit))
user.limit = 0
if (!isNumber(user.potion))
user.potion = 0
if (!isNumber(user.trash))
user.trash = 0
if (!isNumber(user.wood))
user.wood = 0
if (!isNumber(user.rock))
user.rock = 0
if (!isNumber(user.string))
user.string = 0
if (!isNumber(user.petFood))
user.petFood = 0

if (!isNumber(user.emerald))
user.emerald = 0
if (!isNumber(user.diamond))
user.diamond = 0
if (!isNumber(user.gold))
user.gold = 0
if (!isNumber(user.iron))
user.iron = 0

if (!isNumber(user.common))
user.common = 0
if (!isNumber(user.uncommon))
user.uncommon = 0
if (!isNumber(user.mythic))
user.mythic = 0
if (!isNumber(user.legendary))
user.legendary = 0
if (!isNumber(user.pet))
user.pet = 0

if (!isNumber(user.sapi))
user.sapi = 0
if (!isNumber(user.banteng))
user.banteng = 0
if (!isNumber(user.harimau))
user.harimau = 0
if (!isNumber(user.gajah))
user.gajah = 0
if (!isNumber(user.kambing))
user.kambing = 0
if (!isNumber(user.panda))
user.panda = 0
if (!isNumber(user.buaya))
user.buaya = 0
if (!isNumber(user.kerbau))
user.kerbau = 0
if (!isNumber(user.sapi))
user.sapi = 0
if (!isNumber(user.monyet))
user.monyet = 0
if (!isNumber(user.ayam))
user.ayam = 0
if (!isNumber(user.domba))
user.domba = 0

if (!isNumber(user.horse))
user.horse = 0
if (!isNumber(user.horseexp))
user.horseexp = 0
if (!isNumber(user.cat))
user.cat = 0
if (!isNumber(user.catexp))
user.catexp = 0
if (!isNumber(user.fox))
user.fox = 0
if (!isNumber(user.foxhexp))
user.foxexp = 0
if (!isNumber(user.dog))
user.dog = 0
if (!isNumber(user.dogexp))
user.dogexp = 0

if (!isNumber(user.horselastfeed))
user.horselastfeed = 0
if (!isNumber(user.catlastfeed))
user.catlastfeed = 0
if (!isNumber(user.foxlastfeed))
user.foxlastfeed = 0
if (!isNumber(user.doglastfeed))
user.doglastfeed = 0

if (!isNumber(user.armor))
user.armor = 0
if (!isNumber(user.armordurability))
user.armordurability = 0
if (!isNumber(user.sword))
user.sword = 0
if (!isNumber(user.sworddurability))
user.sworddurability = 0
if (!isNumber(user.pickaxe))
user.pickaxe = 0
if (!isNumber(user.pickaxedurability))
user.pickaxedurability = 0
if (!isNumber(user.fishingrod))
user.fishingrod = 0
if (!isNumber(user.fishingroddurability))
user.fishingroddurability = 0

if (!isNumber(user.lastclaim))
user.lastclaim = 0
if (!isNumber(user.lasthourly))
user.lasthourly = 0
if (!isNumber(user.lastadventure))
user.lastadventure = 0
if (!isNumber(user.lastfishing))
user.lastfishing = 0
if (!isNumber(user.lastdungeon))
user.lastdungeon = 0
if (!isNumber(user.lastduel))
user.lastduel = 0
if (!isNumber(user.lastmining))
user.lastmining = 0
if (!isNumber(user.lasthunt))
user.lasthunt = 0
if (!isNumber(user.lastweekly))
user.lastweekly = 0
if (!isNumber(user.lastmonthly))
user.lastmonthly = 0
} else
db.data.users[msg.sender] = {
exp: 0,
limit: 20,
point: 0,
lastclaim: 0,
registered: false,
name: msg.name,
age: -1,
regTime: -1,
afk: -1,
afkReason: '',
banned: false,
warn: 0,
level: 0,
role: 'Beginner',
autolevelup: true,

money: 0,
health: 100,
limit: 100,
potion: 10,
trash: 0,
wood: 0,
rock: 0,
string: 0,

emerald: 0,
diamond: 0,
gold: 0,
iron: 0,

common: 0,
uncommon: 0,
mythic: 0,
legendary: 0,
pet: 0,

sapi: 0,
banteng: 0,
harimau: 0,
gajah: 0,
kambing: 0,
panda: 0,
buaya: 0,
kerbau: 0,
sapi: 0,
monyet: 0,
ayam: 0,
domba: 0,

horse: 0,
horseexp: 0,
cat: 0,
catngexp: 0,
fox: 0,
foxexp: 0,
dog: 0,
dogexp: 0,

horselastfeed: 0,
catlastfeed: 0,
foxlastfeed: 0,
doglastfeed: 0,

armor: 0,
armordurability: 0,
sword: 0,
sworddurability: 0,
pickaxe: 0,
pickaxedurability: 0,
fishingrod: 0,
fishingroddurability: 0,

lastclaim: 0,
lasthourly: 0,
lastadventure: 0,
lastfishing: 0,
lastdungeon: 0,
lastduel: 0,
lastmining: 0,
lasthunt: 0,
lastweekly: 0,
lastmonthly: 0,
}

let chat = global.db.data.chats[msg.from]
if (typeof chat !== 'object') global.db.data.chats[msg.from] = {}
if (chat) {
if (!('isBan' in chat)) chat.isBan = false
if (!('welcome' in chat)) chat.welcome = true
if (!('info' in chat)) chat.info = false
if (!('delete' in chat)) chat.delete = true
if (!('antilink' in chat)) chat.antilink = true
if (!('autodl' in chat)) chat.autodl = false
if (!('toxic' in chat)) chat.toxic = false
if (!('once' in chat)) chat.once = false
if (!('nsfw' in chat)) chat.nsfw = false
if (!('sewa' in chat)) chat.sewa = false
if (!isNumber(chat.expired)) chat.expired = 0
} else global.db.data.chats[msg.from] = {
isBan: false,
welcome: true,
info: false,
delete: true,
antilink: true,
autodl: false,
toxic: false,
once: false, 
nsfw: false, 
sewa: false,
expires: 0,
}

let settings = global.db.data.settings[botNumber]
if (typeof settings !== 'object') global.db.data.settings[botNumber] = {}
if (settings) {
if (!'self' in settings) settings.self = false
if (!'anticall' in settings) settings.anticall = true
if (!'backup' in settings) settings.backup = false
if (!isNumber(settings.backupDB)) settings.backupDB = 0
if (!'grouponly' in settings) settings.grouponly = false
if (!'jadibot' in settings) settings.jadibot = false
if (!isNumber(settings.status)) settings.status = 0
if (!'autoread' in settings) settings.autoread = true
} else global.db.data.settings[botNumber] = {
self: false,
anticall: true,
backup: false,
backupDB: 0,
groupOnly: false,
jadibot: false,
status: 0,
autoread: 0
}
} catch (e) {
console.error(e)
}

for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin) continue
if (plugin.disabled) continue
if (!plugin.all) continue
if (typeof plugin.all !== 'function') continue
try {
await plugin.all.call(this, msg, chatUpdate)
} catch (e) {
if (typeof e === 'string') continue
console.error(e)
}
}

if (msg.isBaileys) return
msg.exp += Math.ceil(Math.random() * 10)

let usedPrefix
const _user = global.db.data && global.db.data.users && global.db.data.users[msg.sender]

// Sebagai Apa
const isOwner = [global.client.user.jid, ...Info.owner.number].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(msg.sender)
const isPremium = isOwner || Info.bot.premium.map(f => f.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(msg.sender)
const groupMetadata = msg.isGroup ? await client.groupMetadata(msg.from).catch(e => {}) : ''
const groupName = msg.isGroup ? groupMetadata.subject : ''
const participants = msg.isGroup ? await groupMetadata.participants : ''
const groupAdmins = msg.isGroup ? await Func.getGroupAdmins(participants) : ''
const isBotAdmins = msg.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = msg.isGroup ? groupAdmins.includes(msg.sender) : false
const myGc = await this.groupMetadata(Info.group.id)
const isJoin = Object.values(myGc.participants).filter(user => user.id === msg.sender)[0]
const logoBot = await Func.getBuffer(Info.image.logo)

// Ban Fitur Admin
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin) continue
if (plugin.disabled) continue
if (!opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) {
this.reply(msg.from, Only.restrict, msg)
continue
}

// Prefix && Read Command
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
const _prefix = plugin.customPrefix ? plugin.customPrefix : client.prefix ? client.prefix : global.prefix
const match = (_prefix instanceof RegExp ?
[[_prefix.exec(msg.text), _prefix]] :
Array.isArray(_prefix) ?
_prefix.map(p => {
let re = p instanceof RegExp ? // RegExp in Array?
p :
new RegExp(str2Regex(p))
return [re.exec(msg.text), re]
}) :
typeof _prefix === 'string' ? // String?
[[new RegExp(str2Regex(_prefix)).exec(msg.text), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find(p => p[1])
if (typeof plugin.before === 'function') if (await plugin.before.call(this, msg, {
match,
client: this,
participants,
groupMetadata,
isOwner,
isAdmins,
isBotAdmins,
isPremium,
chatUpdate,
})) continue
if (typeof plugin !== 'function') continue
if ((usedPrefix = (match[0] || '')[0])) {
let noPrefix = msg.text.replace(usedPrefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
args = args || []
let _args = noPrefix.trim().split` `.slice(1)
let text = _args.join` `
command = (command || '').toLowerCase()
let isAccept = plugin.command instanceof RegExp ? 
plugin.command.test(command) :
Array.isArray(plugin.command) ? // Array?
plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
cmd.test(command) :
cmd === command
) :
typeof plugin.command === 'string' ? 
plugin.command === command :
false

if (!isAccept) continue

// Mess
if (plugin.owner && !isOwner) { 
this.reply(msg.from, Only.owner, msg)
continue
}
if (plugin.premium && !isPremium) { 
this.reply(msg.from, Only.premium, msg)
continue
}
if (plugin.group && !msg.isGroup) { 
this.reply(msg.from, Only.group, msg)
continue
}
if (plugin.botAdmin && !isBotAdmins) { 
this.reply(msg.from, Only.botAdmin, msg)
continue
}
if (plugin.admin && !isAdmins) { 
this.reply(msg.from, Only.admin, msg)
continue
}
if (plugin.private && msg.isGroup) {
this.reply(msg.from, Only.personal, msg)
continue
}
if (plugin.nsfw && !db.data.chats[msg.from].nsfw) {
this.reply(msg.from, Only.nsfw, msg)
continue
}
if (plugin.register == true && _user.registered == false) { 
this.reply(msg.from, Only.regist, msg)
continue
}
if (!db.data.settings[botNumber].groupOnly && !msg.isGroup && !isJoin) { // teknik penambah member:v
this.sendOrder(msg.from, logoBot, '1000', '200', Info.bot.about, `🚩 Untuk dapat menggunakan bot pada personal chat, kamu harus bergabung terlebih dahulu dalam group official kami dibawah ini.

${Info.group.link}`, msg)
continue
}

msg.isCommand = true
msg.plugin = name

// Dashboard Hit
if (msg.isCommand && msg.plugin != 'eval.js' && msg.plugin != 'exec.js') { // kecuali eval, biar g masuk hit
hitCmd(command, 1, hitBot)
}

let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
if (xp > 200) msg.reply('Damn, so cool.') // Hehehe
else msg.exp += xp
if (!isPremium && plugin.limit && global.db.data.users[msg.sender].limit < plugin.limit * 1) {
this.reply(msg.from, `🚩 Limit anda habis, silahkan beli melalui *${usedPrefix}buy* atau bergabung menjadi anggota premium bot melalui *${usedPrefix}daftarpremium*`, msg)
continue 
}

// Sesuai Level
if (plugin.level > _user.level) {
this.reply(msg.from, `🚩 Diperlukan level *${plugin.level}* untuk menggunakan perintah ini.

• Levelmu : [ *${_user.level}* ]`, msg)
continue 
}

// Group Only
if (msg.isCommand && !isPremium && !msg.isGroup && db.data.settings[botNumber].groupOnly) {
var bufGc = await Func.getBuffer(Info.image.logo)
this.sendOrder(msg.from, bufGc, '1000', '200', Info.bot.about, `
*Mode : Group Only*

Hi kak ${msg.pushName}, bot sedang dalam mode hanya group. Tidak dapat menggunakan bot di pesan pribadi. Silahkan upgrade ke premium untuk menggunakan bot di pesan pribadi ketika dalam mode group only dengan command *#daftarprem*, atau join group official kami untuk menggunakan bot.\n\n${Info.group.link}
`.trim(), msg)
continue
}

let extra = {
match,
usedPrefix,
noPrefix,
_args,
args,
command,
text,
client: this,
participants,
groupMetadata,
isOwner,
isAdmins,
isBotAdmins,
isPremium,
chatUpdate,
}
try {
await plugin.call(this, msg, extra)
if (!isPremium) msg.limit = msg.limit || plugin.limit || false
} catch (e) {
// Error occured
msg.error = e
console.error(e)
if (e) {
let ingfoerror = `📁 *Plugin :* ${msg.plugin}
💬 *Chat :* ${msg.isGroup ? `${msg.from} [ GROUP ]` : '@' + msg.sender.split('@')[0]}
✍️ *Command :* ${msg.text}

*⚙️ Error Log :* 
\`\`\`${util.format(e)}\`\`\`
`.trim()
Info.owner.number.map(v => this.sendMessage(v + '@s.whatsapp.net', { text: ingfoerror, mentions: this.parseMention(ingfoerror)}, { quoted:msg }))
}
} finally {
// msg.reply(util.format(_user))
// msg.reply(Follow Ig: @sius_psrb)
if (typeof plugin.after === 'function') {
try {
await plugin.after.call(this, msg, extra)
} catch (e) {
console.error(e)
}
}
}
break
}
}
} catch (e) {
console.error(e)
} finally {
//console.log(global.db.data.users[msg.sender])
let user, stats = global.db.data.stats
if (msg) {
if (msg.sender && (user = global.db.data.users[msg.sender])) {
user.exp += msg.exp
user.limit -= msg.limit * 1
}

// Autoread chat dan sw
if (db.data.settings[botNumber].autoread) {
if (msg.key.remoteJid === 'status@broadcast') {
this.readMessages([msg.key]).then(_=> { console.log(`Read Sw : ${msg.name}`) })
}
this.readMessages([msg.key])
}

// Console By Me
if (msg.isCommand) {
console.log(chalk.keyword('cyan')(`[ ${msg.isGroup ? 'GROUP CHAT' : 'PERSONAL CHAT'} ]`), chalk.bold.rgb(239, 225, 3)(`${chalk.rgb(255, 255, 255)(new Date())}`), chalk.keyword('cyan')(`\n=> Dari ${msg.pushName}, ${msg.isGroup ? msg.from : msg.sender}`), chalk.bold.rgb(239, 225, 3)(`${chalk.rgb(255, 255, 255)(`\n=> ${msg.text || msg.mtype}\n---------------------------------------------------`)}`))
}

// Menfess Made By Hyzer Official, Silahkan Pakai 😇
if (msg.message && !msg.isCommand) {
this.menfess = this.menfess ? this.menfess : {}
if (this.menfess[msg.sender].id != 0 && msg.quoted.footerText == '_Menfess - Whatsapp Bot_') {
var txt =  `🚩 Hi kamu mendapatkan balasan menfess dari @${msg.sender.split('@')[0]}\n\n*Isi Balasan :* ${msg.text}`.trim()
this.reply(this.menfess[msg.sender].dari, txt, null, { mentions: this.parseMention(txt) })
this.reply(msg.from, "🚩 Berhasil mengirim balasan.", msg)
await Func.sleep(750)
delete this.menfess[msg.sender]
}
}

}
}
},

async participantsUpdate({ id, participants, action }) {
if (opts['self']) return
// if (id in client.chats) return // First login will spam
if (global.isInit) return
let chat = global.db.data.chats[id] || {}
let fetch = require('node-fetch')
let text = ''
switch (action) {
case 'add':
case 'remove':
if (chat.welcome) {
let groupMetadata = await this.groupMetadata(id) || (client.chats[id] || {}).metadata
for (let user of participants) {
let pp = await this.profilePictureUrl(user, 'image')
let welby = (action === 'add' ? (chat.sWelcome || this.welcome || client.welcome || 'Welcome @user To Group @subject').replace('@user', '@' + participants[0].split('@')[0]).replace('@subject', groupMetadata.subject) :
(chat.sBye || this.bye || client.bye || '@user Leaving Group @subject :(' )).replace('@user', '@' + participants[0].split('@')[0]).replace('@subject', groupMetadata.subject)
try {
this.sendImage(id, pp, welby, null, { isUrl: true })
} catch {
this.sendImage(id, fs.readFileSync('./global/media/bot/default.jpg'), welby, null)
}
}
}
break
case 'promote':
text = (chat.sPromote || this.spromote || client.spromote || '@user ```is now Admin```')
case 'demote':
if (!text) text = (chat.sDemote || this.sdemote || client.sdemote || '@user ```is no longer Admin```')
text = text.replace('@user', '@' + participants[0].split('@')[0])
if (chat.detect) this.sendMessage(id, text, MessageType.extendedText, {
contextInfo: {
mentionedJid: this.parseMention(text)
}
})
break
}
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright("Update Validation Bot."))
delete require.cache[file]
if (global.reloadHandler) console.log(global.reloadHandler())
})
