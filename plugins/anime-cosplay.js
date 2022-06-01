let handler = async (m, { conn }) => {
let hyzer = 'https://api.zacros.my.id/randomimg/cosplay'
    conn.sendButtonImg(m.chat, hyzer, teksfoto, wm2, 'NEXT', '.cosplay', m)
}
handler.help = ['cosplay']
handler.tags = ['anime']
handler.command = /^(cosplay)$/i

module.exports = handler