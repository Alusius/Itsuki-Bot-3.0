var handler = async(msg, { 
args, usedPrefix, command
}) => {
if (!args[0]) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <url>\n\n*Contoh :* ${usedPrefix + command} https://youtube.com/watch?v=KsWDQkoMpuU`)
client.sendReact(msg.from, '🕒', msg.key)

var b  = await require('@bochilteam/scraper').youtubedlv2(args[0])
var x = await require('caliph-api').downloader.yt.play(args[0])
var y = x.result

if (args[1] == 'audio') {
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
} else if (args[1] == 'video144p') {
var d = await b.video['144p'].download()
client.sendVideo(msg.from, d, null, msg, { isUrl: true })
} else if (args[1] == 'video360p') {
var e = await b.video['360p'].download()
client.sendVideo(msg.from, e, null, msg, { isUrl: true })
} else if (args[1] == 'video480p') {
var f = await b.video['480p'].download()
client.sendVideo(msg.from, f, null, msg, { isUrl: true })
} else if (args[1] == 'video720p') {
var g = await b.video['720p'].download()
client.sendVideo(msg.from, g, null, msg, { isUrl: true })
} else if (args[1] == 'video1080p') {
var h = await b.video['1080p'].download()
client.sendVideo(msg.from, h, null, msg, { isUrl: true })
} else {
await client.sendPresenceUpdate('composing', msg.from)
client.sendMessage(msg.from, {
text: `*乂 Y O U T U B E - F E T C H I N G*

   *◦ Title :* ${y.title}
   *◦ Duration :* ${y.duration}
   *◦ Views :* ${Func.toRupiah(y.views)}
   *◦ Channel :* ${y.channel}

_Silahkan pilih type media di bawah ini_`,
buttonText: "LIST MEDIA",
sections: [
{
"title": "VIDEO",
"rows": [
{
"title": "144p",
"description": "Video dengan kualitas 144p",
"rowId": `.ytdl ${args[0]} video144p`
},
{
"title": "360p",
"description": "Video dengan kualitas 360p",
"rowId": `.ytdl ${args[0]} video360p`
},
{
"title": "480p",
"description": "Video dengan kualitas 480p",
"rowId": `.ytdl ${args[0]} video480p`
},
{
"title": "720p",
"description": "Video dengan kualitas 720p",
"rowId": `.ytdl ${args[0]} video720p`
},
{
"title": "1080p",
"description": "Video dengan kualitas 1080p",
"rowId": `.ytdl ${args[0]} video1080p`
},
]
},
{
"title": "AUDIO",
"rows": [
{
"title": "128kbps",
"description": "Audio dengan tipe mp3",
"rowId": `.ytdl ${args[0]} audio`
}
]
}
]
}, { quoted: msg })
}
}
handler.help = ['ytdl','youtube']
handler.tags = ['dl']
handler.command = /^(ytdl|yt|youtube)$/i

handler.limit = true

module.exports = handler
