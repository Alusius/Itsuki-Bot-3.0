var fetch = require('node-fetch')

var handler = async(msg, { 
client
}) => {
var buton = await Func.satuButton(`.waifu`, 'NEXT')
var imge = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Anime/waifu.json')
var img = await imge.json()
var res = Func.pickRandom(img)
client.sendImage(msg.from, res, 'Random anime waifu.', msg, { isUrl: true, buttons: buton, headerType: 5, footer: wm })
}
handler.help = ['waifu']
handler.tags = ['anime']
handler.command = /^(waifu)$/i

module.exports = handler
