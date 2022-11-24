var handler = async(msg, { 
client, args, usedPrefix, command 
}) => {
if (!args[0]) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <url>\n\n*Contoh :* ${usedPrefix + command} https://mediafire.com/file/wwywcmpi92fb8p7/depan_temen_pun_di_sikat.mp4/file`)
client.sendReact(msg.from, '🕒', msg.key)
var v = await Scraper.mediafire(args[0])
client.sendMessage(msg.from, { 
 document: { url: v.link },
 mimetype: v.mimetype,
 fileName: v.filename,
 caption: `*乂 M E D I A F I R E - D O W N L O A D E R*
  
  *◦ Type :* ${v.filetype}
  *◦ Size :* ${v.filesize}
  *◦ Ext :* ${v.ext}
  *◦ Upload At :* ${v.uploadAt}
`}, { quoted: msg })
}
handler.help = ['mediafire']
handler.tags = ['dl']
handler.command = /^(mediafire)$/i

handler.limit = true

module.exports = handler
