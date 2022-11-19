var handler = async (msg, { 
client 
}) => {
client.caklontong = client.caklontong ? client.caklontong : {}
var id = msg.from
if (!(id in client.caklontong)) return false
var json = client.caklontong[id][1]
var ans = json.jawaban.trim()
var clue = ans.replace(/[AIUEOaiueo]/g, '_')
client.reply(msg.from, '```' + clue + '```\nBalas soalnya, bukan pesan ini', client.caklontong[id][0])
}
handler.command = /^calo$/i
handler.limit = true
module.exports = handler
