var fetch = require('node-fetch')
var handler = async (msg, { 
client, command
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Random/darkjoke.json')
var b = await a.json()
var c = await Func.pickRandom(b)
var d = await Func.satuButton('.darkjoke', 'NEXT..')
client.sendImage(msg.from, c, 'Random Dark Joke 😅', msg, { isUrl: true, buttons: d, headerType: 5, footer: wm })
}
handler.tags = ['random']
handler.help = ['darkjoke','darkjokes']
handler.command = /^(darkjoke|darkjokes)$/i

module.exports = handler
