let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/japan'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.jepang', m)
}
handler.help = ['jepang']
handler.tags = ['asupan']
handler.command = /^(jepang)$/i

module.exports = handler

