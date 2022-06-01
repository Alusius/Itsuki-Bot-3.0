let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/china'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.china', m)
}
handler.help = ['china']
handler.tags = ['asupan']
handler.command = /^(china)$/i

module.exports = handler
