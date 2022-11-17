var fetch = require('node-fetch')
var handler = async (msg, { 
client, command
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Random/doraemon.json')
var b = await a.json()
var c = await Func.pickRandom(b)
var d = await Func.satuButton('.doraemon', 'NEXT..')
client.sendImage(msg.from, c, 'Random Picture Doraemon', msg, { isUrl: true, buttons: d, headerType: 5, footer: wm })
}
handler.tags = ['random']
handler.help = ['doraemon']
handler.command = /^(doraemon)$/i

module.exports = handler
