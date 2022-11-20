var handler = async(msg, { 
args, usedPrefix, command
}) => {
if (!args[0]) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <url>\n\n*Contoh :* ${usedPrefix + command} https://youtube.com/watch?v=KsWDQkoMpuU`)
client.sendReact(msg.from, '🕒', msg.key)

var b  = await require('@bochilteam/scraper').youtubedlv2(args[0])
var x = await require('caliph-api').downloader.yt.play(args[0])
var y = x.result
var c = await b.audio['128kbps'].download()
client.sendAudio(msg.from, c, msg, { 
isUrl: true,
contextInfo:{externalAdReply:{
title: y.title,
body: y.desc,
mediaType: 1,
thumbnail: await Func.getBuffer(y.thumb),
mediaUrl: args[0],
sourceUrl: args[0]
}
}})
}
handler.help = ['ytmp3','ytaudio']
handler.tags = ['dl']
handler.command = /^(yta|ytmp3|youtubemp3|youtubeaudio)$/i

handler.limit = true

module.exports = handler
