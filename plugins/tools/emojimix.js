var handler = async(msg, { 
client, text, usedPrefix, command 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} emoji1+emoji2\n\n*Contoh :* ${usedPrefix + command} 😁+😘`)
var [emo1, emo2] = text.split`+`
try {
Func.fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`).then(async v => { 
client.sendImageAsSticker(msg.from, v.results[0].url, msg, { packname: Info.stickerpack, author: `ig : ${Info.instagram}` })
})
} catch {
msg.reply('🚩 Emoji Invalid.')
}
}
handler.help = ['emojimix']
handler.tags = ['tools']
handler.command = /^(emojimix)$/i

module.exports = handler
