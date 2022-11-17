var fetch = require('node-fetch')
var handler = async (msg, { 
client, command
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Random/stiker.json')
var b = await a.json()
var c = await Func.pickRandom(b)
client.sendImageAsSticker(msg.from, c, msg, { packname: Info.sticker.packname, author: Info.sticker.author })
}
handler.tags = ['random']
handler.help = ['randomsticker','memesticker']
handler.command = /^(randomsticker|randomstiker|memesticker|memestiker)$/i

module.exports = handler
