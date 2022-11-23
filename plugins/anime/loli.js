var fetch = require('node-fetch')

var handler = async(msg, { 
client
}) => {
var buton = await Func.satuButton(`.loli`, 'NEXT')
var imge = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Anime/loli.json')
var img = await imge.json()
var res = Func.pickRandom(img)
client.sendImage(msg.from, res, '🚩 Generate random image ' + command, msg, { isUrl: true, buttons: buton, headerType: 5, footer: wm })
}
handler.help = ['loli']
handler.tags = ['anime']
handler.command = /^(loli)$/i

module.exports = handler
