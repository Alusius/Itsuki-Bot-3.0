var handler = async (msg, { 
client 
}) => {
client.tebaktebakan = client.tebaktebakan ? client.tebaktebakan : {}
var id = msg.from
if (!(id in client.tebaktebakan)) return false
var json = client.tebaktebakan[id][1]
var ans = json.jawaban.trim()
var clue = ans.replace(/[AIUEOaiueo]/g, '_')
client.reply(msg.from, '```' + clue + '```\nBalas soalnya, bukan pesan ini', client.tebaktebakan[id][0])
}
handler.command = /^tekod$/i
handler.limit = true
module.exports = handler
