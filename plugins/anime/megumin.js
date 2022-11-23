var fetch = require('node-fetch')

var handler = async(msg, { 
client
}) => {
var buton = await Func.satuButton('.megumin', 'NEXT')
var imge = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Anime/megumin.json')
var img = await imge.json()
var res = Func.pickRandom(img)
client.sendImage(msg.from, res, 'Random anime megumin.', msg, { isUrl: true, buttons: buton, headerType: 5, footer: wm })
}
handler.help = ['megumin']
handler.tags = ['anime']
handler.command = /^(megumin)$/i

module.exports = handler
