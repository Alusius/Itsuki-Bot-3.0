let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/malaysia'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.malaysia', m)
}
handler.help = ['malaysia']
handler.tags = ['asupan']
handler.command = /^(malaysia)$/i

module.exports = handler
