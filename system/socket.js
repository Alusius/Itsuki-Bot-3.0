const {
default: makeWASocket,
makeWALegacySocket,
extractMessageContent,
makeInMemoryStore,
proto,
prepareWAMessageMedia,
downloadContentFromMessage,
getBinaryNodeChild,
jidDecode,
areJidsSameUser,
generateForwardMessageContent,
generateWAMessageFromContent,
WAMessageStubType,
WA_DEFAULT_EPHEMERAL
} = require('baileys')
const socket = require("baileys")
const chalk = require('chalk')
const fetch = require('node-fetch')
const FileType = require('file-type')
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const path = require('path')
const pino = require('pino')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./exif')
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

exports.makeWASocket = (connectionOptions, options = {}) => {
let client = makeWASocket(connectionOptions)

client.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}
if (client.user && client.user.id) client.user.jid = client.decodeJid(client.user.id)
client.chats = {}
client.contacts = {}

function updateNameToDb(contacts) {
if (!contacts) return
for (let contact of contacts) {
let id = client.decodeJid(contact.id)
if (!id) continue
let chats = client.contacts[id]
if (!chats) chats = { id }
let chat = {
...chats,
...({
...contact, id, ...(id.endsWith('@g.us') ?
{ subject: contact.subject || chats.subject || '' } :
{ name: contact.notify || chats.name || chats.notify || '' })
} || {})
}
client.contacts[id] = chat
}
}
client.ev.on('contacts.upsert', updateNameToDb)
client.ev.on('groups.update', updateNameToDb)
client.ev.on('group-participants.update', async function updateParticipantsToDb({ id, participants, action }) {
id = client.decodeJid(id)
if (!(id in client.contacts)) client.contacts[id] = { id }
let groupMetadata = Object.assign((client.contacts[id].metadata || {}), await client.groupMetadata(id))
for (let participant of participants) {
participant = client.decodeJid(participant)
switch (action) {
case 'add': {
if (participant == client.user.jid) groupMetadata.readOnly = false
let same = (groupMetadata.participants || []).find(user => user && user.id == participant)
if (!same) groupMetadata.participants.push({ id, admin: null })
}
break
case 'remove': {
if (participant == client.user.jid) groupMetadata.readOnly = true
let same = (groupMetadata.participants || []).find(user => user && user.id == participant)
if (same) {
let index = groupMetadata.participants.indexOf(same)
if (index !== -1) groupMetadata.participants.splice(index, 1)
}
}
break
}
}
client.contacts[id] = {
...client.contacts[id],
subject: groupMetadata.subject,
desc: groupMetadata.desc.toString(),
metadata: groupMetadata
}
})

client.ev.on('groups.update', function groupUpdatePushToDb(groupsUpdates) {
for (let update of groupsUpdates) {
let id = client.decodeJid(update.id)
if (!id) continue
if (!(id in client.contacts)) client.contacts[id] = { id }
if (!client.contacts[id].metadata) client.contacts[id].metadata = {}
let subject = update.subject
if (subject) client.contacts[id].subject = subject
let announce = update.announce
if (announce) client.contacts[id].metadata.announce = announce
}
})
client.ev.on('chats.upsert', function chatsUpsertPushToDb(chats_upsert) {
if (chats_upsert[0].unreadCount != 0) {
console.log('Chat belum dibaca -> ', chats_upsert[0].id)
}
})
client.ev.on('presence.update', function presenceUpdatePushToDb({ id, presences }) {
let sender = Object.keys(presences)[0] || id
let _sender = client.decodeJid(sender)
let presence = presences[sender]['lastKnownPresence'] || 'composing'
if (!(_sender in client.contacts)) client.contacts[_sender] = {}
client.contacts[_sender].presences = presence
})

client.logger = {
...client.logger,
info(...args) { console.log(chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.cyan(...args)) },
error(...args) { console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.rgb(255, 38, 0)(...args)) },
warn(...args) { console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.keyword('orange')(...args)) }
}

client.sendOrder = async(jid, buffer, harga, item, title, text, qu) => {
const order = socket.generateWAMessageFromContent(jid, socket.proto.Message.fromObject({
 "orderMessage": {
"orderId": "391028153034238",
"thumbnail": buffer, 
"itemCount": item, 
"status": "INQUIRY", 
"surface": "CATALOG", 
"orderTitle": title, 
"message": text, // Ganti Messagenya
"sellerJid": "6287768886148@s.whatsapp.net",
"token": "AR7zJt8MasFx2Uir/fdxhkhPGDbswfWrAr2gmoyqNZ/0Wg==",
"totalAmount1000": harga,
"totalCurrencyCode": "IDR", 
}
}), { userJid: jid })
client.relayMessage(jid, order.message, { messageId: order.key.id}, { quoted: qu })
}

/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} caption 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
client.sendImage = async(jid, imeg, caption = '', quoted = '', options) => {
await client.sendPresenceUpdate("composing", jid)
if (options && options.isUrl) { 
return client.sendMessage(jid, { image: { url:imeg }, caption: caption, mentions: client.parseMention(caption), ...options }, { quoted })
}
return client.sendMessage(jid, { image: imeg, caption: caption, ...options }, { quoted })
}

/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} caption 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
client.sendVideo = async(jid, vid, caption = '', quoted = '', options) => {
await client.sendPresenceUpdate("composing", jid)
if (options && options.isUrl) { 
return client.sendMessage(jid, { video: { url:vid }, caption: caption, mentions: client.parseMention(caption), ...options }, { quoted })
} 
return client.sendMessage(jid, { video: vid, caption: caption, ...options }, { quoted })
}

/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} mime 
 * @param {*} options 
 * @returns 
 */
client.sendAudio = async(jid, audi, quoted = '', options) => {
await client.sendPresenceUpdate("recording", jid)
if (options && options.isUrl) {
return client.sendMessage(jid, { audio: { url: audi }, mimetype: 'audio/mpeg', fileName: `${audi}.mp3`, ...options }, { quoted })
} 
return client.sendMessage(jid, { audio: audi, mimetype: 'audio/mpeg', fileName: `${audi}.mp3`, ...options }, { quoted })
}

client.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await client.sendPresenceUpdate('composing', jid)
await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await client.sendPresenceUpdate('composing', jid)
await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

client.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

/**
 * Send Contact
 * @param {String} jid 
 * @param {String} number 
 * @param {String} name 
 * @param {Object} quoted 
 * @param {Object} options 
 */
client.sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await client.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(i + '@s.whatsapp.net')}\nFN:${await client.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:hyzerofficial86@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/@sius_psrb\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
})
}
await client.sendPresenceUpdate('composing', jid)
return client.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
}

/**
 * Reply to a message
 * @param {String} jid
 * @param {String|Object} text
 * @param {Object} quoted
 * @param {Object} options
 */
client.reply = async (jid, text = '', quoted, options) => {
await client.sendPresenceUpdate('composing', jid)
let bufet = await Func.getBuffer(Info.image.logo)
let buf = Info.image.logo
return client.sendMessage(jid, {
text: text,
mentions: await client.parseMention(text),
...options,
contextInfo:{externalAdReply:{
title: Info.bot.about,
body: Info.bot.footer,
mediaType: 1,
thumbnail: bufet,
mediaUrl: Info.owner.web,
sourceUrl: Info.owner.web
}
}
}, 
{ quoted: quoted }
)
}

client.reSize = async (image, width, height) => {
 let jimp = require('jimp')
 var oyy = await jimp.read(image);
 var kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
return kiyomasa
 }

client.sendReact = async (jid, emoticon, keys = {}) => {
let reactionMessage = {
react: {
text: emoticon,
key: keys
}
}
return await client.sendMessage(jid, reactionMessage)
}

/**
 * Exact Copy Forward
 * @param {String} jid
 * @param {Object} message
 * @param {Boolean|Number} forwardingScore
 * @param {Object} options
 */
client.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
let msg = generateForwardMessageContent(message, !!forwardingScore)
let mtype = Object.keys(msg)[0]
if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) msg[mtype].contextInfo.forwardingScore += forwardingScore
msg = generateWAMessageFromContent(jid, msg, { ...options, userJid: client.user.id })
await client.relayMessage(jid, msg.message, { messageId: msg.key.id, additionalAttributes: { ...options } })
return msg
}

/**
 * Download media message
 * @param {Object} msg
 * @param {String} type 
 * @param {fs.PathLike|fs.promises.FileHandle} filename
 * @returns {Promise<fs.PathLike|fs.promises.FileHandle|Buffer>}
 */
client.downloadM = async (msg, type, filename = '') => {
if (!msg || !(msg.url || msg.directPath)) return Buffer.alloc(0)
const stream = await downloadContentFromMessage(msg, type)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
if (filename) await fs.promises.writeFile(filename, buffer)
return filename && fs.existsSync(filename) ? filename : buffer
}

/**
 * Parses string into mentionedJid(s)
 * @param {String} text
 */
client.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

/**
 * Get name from jid
 * @param {String} jid
 * @param {Boolean} withoutContact
 */
client.getName = (jid, withoutContact = false) => {
jid = client.decodeJid(jid)
withoutContact = this.withoutContact || withoutContact
let v
if (jid.endsWith('@g.us')) return new Promise(async (resolve) => {
v = client.contacts[jid] || {}
if (!(v.name || v.subject)) v = await client.groupMetadata(jid) || {}
resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = jid === '0@s.whatsapp.net' ? {
jid,
vname: 'WhatsApp'
} : jid === client.user.jid ?
client.user :
(client.contacts[jid] || {})
return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

client.pushMessage = (msg) => {
if (['senderKeyDistributionMessage', 'protocolMessage'].includes(msg.mtype)) return 
let id = msg.from
let chats = client.chats[id]
if (!chats) chats = { id }
if (!chats.messages) chats.messages = {}
chats.messages[msg.id] = JSON.stringify(msg, null, 2)
}

/**
 * Serialize Message, so it easier to manipulate
 * @param {Object} msg
 */
client.serializeM = (msg) => {
return exports.smsg(client, msg)
}

Object.defineProperty(client, 'name', {
value: { ...(options.chats || {}) },
configurable: true,
})
if (client.user?.id) client.user.jid = client.decodeJid(client.user.id)
store.bind(client.ev)
return client
}

/**
 * Serialize Message
 * @param {WAConnection} client 
 * @param {Object} msg 
 * @param {Boolean} hasParent 
 */
exports.smsg = (client, msg, hasParent) => {
if (!msg) return msg
let MSG = proto.WebMessageInfo
if (msg.key) {
msg.id = msg.key.id
msg.isBaileys = msg.id && msg.id.length === 16 || false
msg.from = client.decodeJid(msg.key.remoteJid || msg.hyzerMess && msg.hyzerMess.groupId || '')
msg.from = client.decodeJid(msg.key.remoteJid || msg.hyzerMess && msg.hyzerMess.groupId || '')
msg.isGroup = msg.from.endsWith('@g.us')
msg.fromMe = msg.key.fromMe
msg.sender = client.decodeJid(msg.fromMe && client.user.id || msg.participant || msg.key.participant || msg.from || '')
}
if (msg.message) {
msg.mtype = Object.keys(msg.message)[0]
msg.hyzerMess = msg.message[msg.mtype]
if (msg.from == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(msg.mtype)) msg.from = msg.sender
if (msg.mtype == 'protocolMessage') {
if (msg.hyzerMess.key.remoteJid == 'status@broadcast') msg.hyzerMess.key.remoteJid = msg.from
if (!msg.hyzerMess.key.participant || msg.hyzerMess.key.participant == 'status_me') msg.hyzerMess.key.participant = msg.sender
msg.hyzerMess.key.fromMe = client.decodeJid(msg.hyzerMess.key.participant) === client.decodeJid(client.user.id)
if (!msg.hyzerMess.key.fromMe && msg.hyzerMess.key.remoteJid === client.decodeJid(client.user.id)) msg.hyzerMess.key.remoteJid = msg.sender
}
msg.text = msg.hyzerMess.text || msg.hyzerMess.caption || msg.hyzerMess.contentText || msg.hyzerMess || ''
msg.mentionedJid = msg.hyzerMess && msg.hyzerMess.contextInfo && msg.hyzerMess.contextInfo.mentionedJid && msg.hyzerMess.contextInfo.mentionedJid.length && msg.hyzerMess.contextInfo.mentionedJid || []
let quoted = msg.quoted = msg.hyzerMess && msg.hyzerMess.contextInfo && msg.hyzerMess.contextInfo.quotedMessage ? msg.hyzerMess.contextInfo.quotedMessage : null
if (msg.quoted) {
let type = Object.keys(msg.quoted)[0]
msg.quoted = msg.quoted[type]
if (typeof msg.quoted === 'string') msg.quoted = { text: msg.quoted }
msg.quoted.mtype = type
msg.quoted.id = msg.hyzerMess.contextInfo.stanzaId
msg.quoted.chat = client.decodeJid(msg.hyzerMess.contextInfo.remoteJid || msg.from || msg.sender)
msg.quoted.isBaileys = msg.quoted.id && msg.quoted.id.length === 16 || false
msg.quoted.sender = client.decodeJid(msg.hyzerMess.contextInfo.participant)
msg.quoted.fromMe = msg.quoted.sender === client.user.jid
msg.quoted.text = msg.quoted.text || msg.quoted.caption || ''
msg.quoted.mentionedJid = msg.quoted.contextInfo && msg.quoted.contextInfo.mentionedJid && msg.quoted.contextInfo.mentionedJid.length && msg.quoted.contextInfo.mentionedJid || []
let vM = msg.quoted.fakeObj = MSG.fromObject({
key: {
fromMe: msg.quoted.fromMe,
remoteJid: msg.quoted.chat,
id: msg.quoted.id
},
message: quoted,
...(msg.isGroup ? { participant: msg.quoted.sender } : {})
})
msg.getQuotedObj = msg.getQuotedMessage = () => {
if (!msg.quoted.id) return false
let q = ((client.chats[msg.quoted.chat] || {}).messages || {})[msg.quoted.id]
return exports.smsg(client, q ? q : vM)
}

if (msg.quoted.url || msg.quoted.directPath) msg.quoted.download = () => client.downloadM(msg.quoted, msg.quoted.mtype.toLowerCase().replace(/message/i, ''))

/**
 * Reply to quoted message
 * @param {String|Object} text
 * @param {String|false} chatId
 * @param {Object} options
 */
msg.quoted.reply = (text, chatId, options) => client.reply(chatId ? chatId : msg.chat, text, vM, options)

/**
 * Copy quoted message
 */
msg.quoted.copy = () => exports.smsg(client, MSG.fromObject(MSG.toObject(vM)))

/**
 * Exact Forward quoted message
 * @param {String} jid
 * @param {Boolean|Number} forceForward
 * @param {Object} options
*/
msg.quoted.copyNForward = (jid, forceForward = true, options = {}) => client.copyNForward(jid, vM, forceForward, options)

/**
 * Delete quoted message
 */
msg.quoted.delete = () => client.sendMessage(msg.quoted.chat, { delete: vM.key })
}
}
/**
 * Reply to this message
 * @param {String|Object} text
 * @param {String|false} chatId
 * @param {Object} options
 */
 msg.reply = async (text, chatId, options) => client.reply(chatId ? chatId : msg.from, text, msg)
 /*
 * Name
 */
msg.name = msg.pushName || client.getName(msg.sender)
if (msg.hyzerMess && msg.hyzerMess.url) msg.download = () => client.downloadM(msg.hyzerMess, msg.mtype.toLowerCase().replace(/message/i, ''))

/**
 * Exact Forward this message
 * @param {String} jid
 * @param {Boolean} forceForward
 * @param {Object} options
 */
msg.copyNForward = (jid = msg.from, forceForward = true, options = {}) => client.copyNForward(jid, m, forceForward, options)

/**
 * Modify this Message
 * @param {String} jid 
 * @param {String} text 
 * @param {String} sender 
 * @param {Object} options 
 */
msg.cMod = (jid, text = '', sender = msg.sender, options = {}) => client.cMod(jid, m, text, sender, options)

/**
 * Delete this message
 */
msg.delete = () => client.sendMessage(msg.from, { delete: m.key })

return msg
}

exports.logic = (check, inp, out) => {
if (inp.length !== out.length) throw new Error('Input and Output must have same length')
for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i]
return null
}

exports.protoType = () => {
Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
const ab = new ArrayBuffer(this.length);
const view = new Uint8Array(ab);
for (let i = 0; i < this.length; ++i) {
view[i] = this[i];
}
return ab;
}
/**
 * @returns {ArrayBuffer}
 */
Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
}
/**
 * @returns {Buffer}
 */
ArrayBuffer.prototype.toBuffer = function toBuffer() {
return Buffer.from(new Uint8Array(this))
}
// /**
//* @returns {String}
//*/
// Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
// return util.format(this)
// }
Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
return await fileTypeFromBuffer(this)
}
/**
 * @returns {Boolean}
 */
String.prototype.isNumber = Number.prototype.isNumber = isNumber
/**
 *
 * @returns {String}
 */
String.prototype.capitalize = function capitalize() {
return this.charAt(0).toUpperCase() + this.slice(1, this.length)
}
/**
 * @returns {String}
 */
String.prototype.capitalizeV2 = function capitalizeV2() {
const str = this.split(' ')
return str.map(v => v.capitalize()).join(' ')
}
String.prototype.decodeJid = function decodeJid() {
if (/:\d+@/gi.test(this)) {
const decode = jidDecode(this) || {}
return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
} else return this.trim()
}
/**
 * number must be milliseconds
 * @returns {string}
 */
Number.prototype.toTimeString = function toTimeString() {
// const milliseconds = this % 1000
const seconds = Math.floor((this / 1000) % 60)
const minutes = Math.floor((this / (60 * 1000)) % 60)
const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
const days = Math.floor((this / (24 * 60 * 60 * 1000)))
return (
(days ? `${days} day(s) ` : '') +
(hours ? `${hours} hour(s) ` : '') +
(minutes ? `${minutes} minute(s) ` : '') +
(seconds ? `${seconds} second(s)` : '')
).trim()
}
Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}

function isNumber() {
const int = parseInt(this)
return typeof int === 'number' && !isNaN(int)
}

function getRandom() {
if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
return Math.floor(Math.random() * this)
}

/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
function nullish(args) {
return !(args !== null && args !== undefined)
}

async function generateProfilePicture(buffer) {
const jimp = await jimp_1.read(buffer)
const min = jimp.getWidth()
const max = jimp.getHeight()
const cropped = jimp.crop(0, 0, min, max)
return {
img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
}
}
