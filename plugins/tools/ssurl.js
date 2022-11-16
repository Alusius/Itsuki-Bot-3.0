var handler = async (msg, { 
client, text, command, usedPrefix
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <url>\n\n*Contoh :* ${usedPrefix + command} https://github.com/Hyzerr`)
msg.reply(Only.wait)
var phone = await Scraper.ssweb(text, 'phone')
var desktop = await Scraper.ssweb(text, 'desktop')
var tablet = await Scraper.ssweb(text, 'tablet')
var res = `*🍟 Fetching :* ${Func.speedNow()}`
if (command === 'sshp') {
await client.sendImage(msg.from, phone.result, res, msg)
}
if (command === 'ssweb' || command === 'sstablet') {
await client.sendImage(msg.from, tablet.result, res, msg)
}
if (command === 'sspc') {
await client.sendImage(msg.from, desktop.result, res, msg)
}
}
handler.help = ['ssweb','sspc','sshp','sstablet'].map(v => v + ' <url>')
handler.tags = ['tools']
handler.command = /^(ssweb|sstablet|sspc|sshp)$/i

handler.limit = true

module.exports = handler
