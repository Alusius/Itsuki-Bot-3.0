var fetch = require('node-fetch')
var handler = async (msg, { 
client, command 
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Quotes/' + command + '.json')
var b = await a.json()
var c = await Func.pickRandom(b)
var d = await Func.satuButton(`.${command}`, 'Next..')
client.reply(msg.from, c, msg, { buttons: d, headerType: 5, footer: wm })
}
handler.tags = ['random']
handler.help = ['bacot','bucin','galau','gombal','motivasi','ngawur','pantun','quote-ilmuan','quotes','quotesanime','sadquotes']
handler.command = /^(bacot|bucin|galau|gombal|motivasi|ngawur|pantun|quote-ilmuan|quotes|quotesanime|sadquotes)$/i

module.exports = handler

// Sangat Malas 🧢
