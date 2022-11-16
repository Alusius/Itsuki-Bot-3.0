var handler = async (msg, { 
client, text, usedPrefix, command 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} *<link-youtube>*\n\n*Contoh :* ${usedPrefix + command} https://youtu.be/Db3QI5OUO5o`)
client.sendReact(msg.from, '🕒', msg.key)
require('caliph-api').downloader.yt.mp4(text).then(async v => {
client.sendVideo(msg.from, v.result.result, `*乂 Y O U T U B E - V I D E O*\n\n   *◦ Title :* ${v.result.title}\n   *◦ Quality :* ${v.result.quality}\n   *◦ Size :* ${v.result.size}\n   *◦ Duration :* ${v.result.duration}\n   *◦ Channel :* ${v.result.channel}`, msg, { isUrl:true })
})
}
handler.help = ['ytv','ytmp4']
handler.tags = ['dl']
handler.command = /^(youtubevideo|ytvideo|ytv|ytmp4)$/i

handler.limit = true

module.exports = handler
