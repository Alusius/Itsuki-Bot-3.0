const fs = require('fs')

var handler = async (msg, { 
client, args, usedPrefix, command 
}) => {
const zer = (msg.quoted || msg)
const quoted = (zer.mtype == 'buttonsMessage') ? zer[Object.keys(zer)[1]] : (zer.mtype == 'templateMessage') ? zer.hydratedTemplate[Object.keys(zer.hydratedTemplate)[1]] : (zer.mtype == 'product') ? zer[Object.keys(zer)[0]] : msg.quoted ? msg.quoted : msg
const mime = (quoted.hyzerMess || quoted).mimetype || ''
const qmsg = (quoted.hyzerMess || quoted)
if (/image/.test(mime)) {
var image = await client.downloadMediaMessage(qmsg)
var encimage = await client.sendImageAsSticker(msg.from, image, msg, { packname: args[0] || Info.sticker.packname, author: args[1] || Info.sticker.author })
await fs.unlinkSync(encimage)
} else if (/video/.test(mime)) {
if (mime.seconds > 11) return msg.reply('🚩 Maksimal 10 detik!')
var video = await client.downloadMediaMessage(qmsg)
var encvideo = await client.sendVideoAsSticker(msg.from, video, msg, { packname: args[0] || Info.sticker.packname, author: args[1] || Info.sticker.author })
await fs.unlinkSync(encvideo)
} else {
msg.reply(`🚩 Kirim gambar/video dengan caption ${usedPrefix + command}\nDurasi Video/Gif 1-9 Detik`)
}
}
handler.help = ['sticker','s','sgif','stickergif'].map(v => v + ' <reply image>')
handler.tags = ['convert']
handler.command = /^(sticker|stiker|s|stickergif|stikergif|sgif)$/i

module.exports = handler
