let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/thailand'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.thailand', m)
}
handler.help = ['thailand']
handler.tags = ['asupan']
handler.command = /^(thailand)$/i

module.exports = handler
