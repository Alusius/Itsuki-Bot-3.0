const fs = require('fs')

var handler = async (msg, { 
client, args, usedPrefix, command 
}) => {
var q = msg.quoted ? msg.quoted : msg
var mime = (q.msg || q).mimetype || ''
var mimeq = (q.msg || q)
if (/image/.test(mime)) {
var image = await client.downloadMediaMessage(mimeq)
var encimage = await client.sendImageAsSticker(msg.from, image, msg, { packname: args[0] || Info.stickerpack, author: args[1] || Info.botName })
await fs.unlinkSync(encimage)
} else if (/video/.test(mime)) {
if (mimeq.seconds > 11) return msg.reply('🚩 Maksimal 10 detik!')
var video = await client.downloadMediaMessage(mimeq)
var encvideo = await client.sendVideoAsSticker(msg.from, video, msg, { packname: args[0] || Info.stickerpack, author: args[1] || Info.botName })
await fs.unlinkSync(encvideo)
} else {
msg.reply(`🚩 Kirim/reply gambar/video/gif dengan caption ${usedPrefix + command}\nDurasi Video/Gif 1-9 Detik`)
}
}
handler.help = ['sticker','s','sgif','stickergif'].map(v => v + ' <reply image>')
handler.tags = ['convert']
handler.command = /^(sticker|stiker|s|stickergif|stikergif|sgif)$/i

module.exports = handler
