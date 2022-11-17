var handler = msg => msg
handler.before = async function(msg) {
var buy = (typeof msg.text == 'string' ? msg.text : '')
if (msg.isGroup && buy.match(`chat.whatsapp.com`) && db.data.chats[msg.from].antilink && !msg.fromMe) {
var groupMeta = msg.isGroup ? await this.groupMetadata(msg.from).catch(e => {}) : ''
var partici = msg.isGroup ? await groupMeta.participants : ''
var groupAdmin = msg.isGroup ? await Func.getGroupAdmins(partici) : ''
var botAdmi = msg.isGroup ? groupAdmin.includes(botNumber) : false
var isAdmi = msg.isGroup ? groupAdmin.includes(msg.sender) : false
var qyr = `🚩 Hi *@${msg.sender.split('@')[0]}*, kamu terdeteksi mengirim link group.\n\nKamu akan di kick karena melanggar peraturan grup.`
this.reply(msg.from, qyr, msg, { mentions: this.parseMention(qyr)})
if (!botAdmi) return msg.reply(`Ehh bot gak admin T_T`)
let gclink = (`https://chat.whatsapp.com/`+await this.groupInviteCode(msg.from))
let isLinkThisGc = new RegExp(gclink, 'i')
let isgclink = isLinkThisGc.test(msg.text)
if (isgclink) return this.reply(msg.from, `🚩 Ehh maaf gak jadi, karena kamu ngirim link group ini`, msg)
if (isAdmi) return this.reply(msg.from, `🚩 Ehh maaf kamu admin`, msg)
let key = {}
key.remoteJid = msg.quoted ? msg.quoted.fakeObj.key.remoteJid : msg.key.remoteJid
key.fromMe = msg.quoted ? msg.quoted.fakeObj.key.fromMe : msg.key.fromMe
key.id = msg.quoted ? msg.quoted.fakeObj.key.id : msg.key.id
key.participant = msg.quoted ? msg.quoted.fakeObj.participant : msg.key.participant
await this.sendMessage(msg.from, { delete: key })
Func.sleep(100)
this.groupParticipantsUpdate(msg.from, [msg.sender], 'remove')
}
return !0
}

module.exports = handler
