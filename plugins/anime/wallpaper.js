const fetch = require('node-fetch')
var handler = async(msg, { 
client 
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Random/wallpaper.json')
var b = await a.json()
var c = await Func.pickRandom(b)
client.sendImage(msg.from, c, 'Random wallpaper anime.', msg, { isUrl: true })
}
handler.help = ['wallpaperanime']
handler.tags = ['web']
handler.command = /^(wallpaperanime|animewallpaper)$/i

module.exports = handler
