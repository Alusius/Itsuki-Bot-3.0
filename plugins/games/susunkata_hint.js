var handler = async (msg, { 
client 
}) => {
client.susunkata = client.susunkata ? client.susunkata : {}
var id = msg.from
if (!(id in client.susunkata)) return false
var json = client.susunkata[id][1]
var ans = json.jawaban.trim()
var clue = ans.replace(/[AIUEOaiueo]/g, '_')
client.reply(msg.from, '```' + clue + '```\nBalas soalnya, bukan pesan ini', client.susunkata[id][0])
}
handler.command = /^sunkes$/i
handler.limit = true
module.exports = handler
