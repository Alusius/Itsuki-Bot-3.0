let handler = async (msg, { client, text }) => {
if (!text) return msg.reply('*Gunakan format command <url>*')
client.sendReact(msg.from, '🕒', msg.key)
Scraper.imdb(text).then(async data => {
if (data.url != 0) {
const img = await client.sendImage(msg.from, data.thumbnail, `*乂 I M D B - D O W N L O A D E R*\n\n   *◦ Title :* ${data.title}\n   *◦ Size :* ${data.medias[0].formattedSize}\n   *◦ Source :* ${data.url}`, msg, { isUrl:true })
client.sendVideo(msg.from, data.medias[0].url, `*🍟 Fetching :* ${Func.speedNow()}`, img, { isUrl:true })
} else {
msg.reply(`*🚩 Cant download media.*`)
}
})
}
handler.help = ['imdb'].map(v => v + ' <url>')
handler.tags = ['dl']
handler.command = /^(imdb|filmdl)$/i

handler.limit = true

module.exports = handler
