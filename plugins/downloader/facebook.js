var handler = async(msg, { 
text, usedPrefix, command
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <url>`)
client.sendReact(msg.from, '🕒', msg.key)
try {
Scraper.fb(text).then(async v => {
await client.sendVideo(msg.from, v.sd, v.title, msg, { isUrl:true })
})
} catch(e) {
msg.reply(`🚩 Can\'t download media.`)
throw e
}
}
handler.help = ['fb','facebook']
handler.tags = ['dl']
handler.command = /^(fb|fbdl|facebook)$/i

handler.limit = true

module.exports = handler
