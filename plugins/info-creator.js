let handler = async(m, { conn }) => {
conn.sendContact(m.chat, whatsapp, nameowner, m)
}
handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(owner|creator)$/i

module.exports = handler
