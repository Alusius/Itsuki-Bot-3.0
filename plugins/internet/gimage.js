var { promisify } = require('util')
var _gis = require('g-i-s')
var gis = promisify(_gis)
var handler  = async (msg, { 
client, args, text, usedPrefix, command 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <query>\n\n*Contoh :* ${usedPrefix + command} anime`)
var results = await gis(text) || []
var { url, width, height } = Func.pickRandom(results) || {}
if (!url) return msg.reply('🚩 Not Found')
var but = await Func.satuButton(`.gimage ${text}`, 'NEXT')
client.sendImage(msg.from, url, `*乂 G O O G L E  -  I M A G E*

    ◦ Query : ${text}
    ◦ Width : ${width}
    ◦ Height : ${height}
`.trim(), msg, { isUrl:true, buttons: but, headerType: 5, footer: wm })
}
handler.help = ['image <query>', 'gimage <query>', 'googleimage <query>']
handler.tags = ['web']
handler.command = /^(gimage|googleimage|image)$/i

module.exports = handler
