var fetch = require('node-fetch')

var handler = async(msg, { 
client
}) => {
var buton = await Func.satuButton(`.husbu`, 'NEXT')
var imge = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Anime/husbu.json')
var img = await imge.json()
var res = Func.pickRandom(img)
client.sendImage(msg.from, res, 'Random anime husbu.', msg, { isUrl: true, buttons: buton, headerType: 5, footer: wm })
}
handler.help = ['husbu']
handler.tags = ['anime']
handler.command = /^(husbu)$/i

module.exports = handler
