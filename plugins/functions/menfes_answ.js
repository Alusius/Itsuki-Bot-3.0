var handler = async (msg, { client }) => {
client.menfess = client.menfess ? client.menfess : {}
if (!client.menfess[msg.sender]) return msg.reply('🚩 Kamu sedang tidak menerima pesan menfess.')
if (client.menfess[msg.sender].id != 0) {
msg.reply("🚩 Reply pesan menfess yang dikirim bot untuk membalas menfess.")
} else return false
}
handler.command = /^(balasmenfess)$/i

module.exports = handler
