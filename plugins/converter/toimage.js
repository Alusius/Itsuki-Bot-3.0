var { webp2png } = require('../../system/webp')
var handler = async (msg, { 
client, usedPrefix, command 
}) => {
if (!msg.quoted) return msg.reply(`🚩 Balas stiker dengan caption *${usedPrefix + command}*`)
var mime = msg.quoted.mimetype || ''
if (!/webp/.test(mime)) return msg.reply(`🚩 Balas stiker dengan caption *${usedPrefix + command}*`)
var media = await msg.quoted.download()
var out = Buffer.alloc(0)
if (/webp/.test(mime)) {
out = await webp2png(media)
}
await client.sendImage(msg.from, out, '*Success convert to image.*', msg, { isUrl: true })
}
handler.help = ['toimg','toimage'].map(v => v + ' <reply>')
handler.tags = ['convert']
handler.command = /^(toimage|toimg)$/i

module.exports = handler
