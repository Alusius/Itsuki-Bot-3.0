var handler = async (msg, { 
client 
}) => {
client.tebakkalimat = client.tebakkalimat ? client.tebakkalimat : {}
var id = msg.from
if (!(id in client.tebakkalimat)) return false
var json = client.tebakkalimat[id][1]
var ans = json.jawaban.trim()
var clue = ans.replace(/[AIUEOaiueo]/g, '_')
client.reply(msg.from, '```' + clue + '```\nBalas soalnya, bukan pesan ini', client.tebakkalimat[id][0])
}
handler.command = /^kalisos$/i
handler.limit = true
module.exports = handler
