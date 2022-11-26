var handler = async(msg, { 
client, text, usedPrefix, command 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <query>\n\n*Contoh :* ${usedPrefix + command} Ariana Grande`)
 var getResult = await Scraper.wikisearch(text)  
 var { thumb, judul, wiki } = getResult[0]
 var isJudul = judul.length != 0 ? true : false
 var isWiki = wiki.length != 0 ? true : false
  if (!isJudul && !isWiki) return msg.reply(`🚩 Pencarian wikipedia untuk ${text} tidak ditemukan.`)
  client.sendImage(msg.from, 
    thumb, 
    `*${judul.length != 0 ? judul : '乂 W I K I P E D I A'}*
    
    ${wiki}`,
    msg,
   { isUrl: true }
 )
} 
handler.help = ['wikipedia','wikisearch']
handler.tags = ['web']
handler.command = /^(wikipedia|wikisearch)$/i

module.exports = handler
