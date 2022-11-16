var handler = async (msg, { 
client, text, usedPrefix, command 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <link-instagram>\n\n*Contoh :* ${usedPrefix + command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`)
client.sendReact(msg.from, '🕒', msg.key)
try {
Scraper.instagram(text).then(res => {
for (let i = 0; i < res.results_number; i++) {
let isVid = res.url_list[i].includes('.mp4') ? true : false
if (isVid) {
client.sendVideo(msg.from, res.url_list[i], `*🍟 Fetching : ${Func.speedNow()}*`, msg, { isUrl:true })
} else {
client.sendImage(msg.from, res.url_list[i], `*🍟 Fetching : ${Func.speedNow()}*`, msg, { isUrl:true })
}}
})
} catch(e) {
client.sendReact(msg.from, '❌', msg.key)
msg.reply(`*🚩 Can\'t download media.*`)
throw e
}
}
handler.help = ['ig','instagram'].map(v => v + ' <url>')
handler.tags = ['dl']
handler.command = /^(ig|instagram)$/i

handler.limit = true

module.exports = handler
