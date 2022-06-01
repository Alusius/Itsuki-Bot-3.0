let handler = async (m, { conn }) => {
let api-hyzer = 'https://api.zacros.my.id/asupan/hijaber'
    conn.sendButtonImg(m.chat, api-hyzer, 'Nih', wm2, 'NEXT', '.hijaber', m)
}
handler.help = ['hijaber']
handler.tags = ['asupan']
handler.command = /^(hijaber)$/i

module.exports = handler
