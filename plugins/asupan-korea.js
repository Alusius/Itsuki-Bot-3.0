let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/korea'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.korea', m)
}
handler.help = ['korea']
handler.tags = ['asupan']
handler.command = /^(korea)$/i

module.exports = handler

