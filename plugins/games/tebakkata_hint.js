var handler = async (msg, { 
client 
}) => {
client.tebakkata = client.tebakkata ? client.tebakkata : {}
var id = msg.from
if (!(id in client.tebakkata)) return false
var json = client.tebakkata[id][1]
var ans = json.jawaban.trim()
var clue = ans.replace(/[AIUEOaiueo]/g, '_')
client.reply(msg.from, '```' + clue + '```\nBalas soalnya, bukan pesan ini', client.tebakkata[id][0])
}
handler.command = /^teka$/i
handler.limit = true
module.exports = handler
