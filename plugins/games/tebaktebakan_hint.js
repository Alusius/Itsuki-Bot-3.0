var handler = async (msg, { 
client 
}) => {
client.asahotak = client.asahotak ? client.asahotak : {}
var id = msg.from
if (!(id in client.asahotak)) return false
var json = client.asahotak[id][1]
var ans = json.jawaban.trim()
var clue = ans.replace(/[AIUEOaiueo]/g, '_')
client.reply(msg.from, '```' + clue + '```\nBalas soalnya, bukan pesan ini', client.asahotak[id][0])
}
handler.command = /^tekod$/i
handler.limit = true
module.exports = handler
