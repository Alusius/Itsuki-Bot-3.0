let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/vietnam'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.vietnam', m)
}
handler.help = ['vietnam']
handler.tags = ['asupan']
handler.command = /^(vietnam)$/i

module.exports = handler
