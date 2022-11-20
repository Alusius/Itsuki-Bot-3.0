var fetch = require('node-fetch')
var { extractImageThumb } = require('@adiwajshing/baileys')

var handler = async (msg, { 
client, 
args 
}) => {
	let code = (args[0] || '').replace(/\D/g, '')
	if (!code) throw 'Input code' 
	await msg.reply('_🚩 In progress, please wait..._')
	let res = await fetch('https://mxmxk.herokuapp.com/nhentai?code=' + code)
	if (!res.ok) throw await res.statusText
	let json = await res.json()
	let v = await fetch('https://mxmxk.herokuapp.com/nhentai/' + code)
	let json2 = await v.json()
	let buffer = await (await fetch(json.result.images.pages[0])).buffer()
	let jpegThumbnail = await extractImageThumb(buffer)
	return await client.sendMessage(msg.from, { document: { url: json2.result }, jpegThumbnail, fileName: json.result.title.english + '.pdf', mimetype: 'application/pdf' }, { quoted: msg })
}
handler.help = ['nhentaipdf']
handler.tags = ['nsfw']
handler.command = /^(nhentaipdf)$/i
handler.limit = true
handler.nsfw = true
module.exports = handler
