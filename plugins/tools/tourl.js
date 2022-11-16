var uploadFile = require('../../system/uploadFile')
var uploadImage = require('../../system/uploadImg')

var handler = async(msg, { 
client 
}) => {
var q = msg.quoted ? msg.quoted : msg
var mime = (q.msg || q).mimetype || ''
if (!mime) return msg.reply('🚩 Reply Image')
var media = await q.download()
var isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
var link = await (isTele ? uploadImage : uploadFile)(media)
msg.reply(`*${link}*

${media.length} Byte(s)
${isTele ? '(Tidak Ada Tanggal Kedaluwarsa)' : '(Tidak diketahui)'}`)
}
handler.help = ['tourl','upload']
handler.tags = ['tools']
handler.command = /^(tourl|tolink|upload)$/i

module.exports = handler
