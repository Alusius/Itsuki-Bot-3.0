var fetch = require('node-fetch')
var handler = async (msg, { 
client, command 
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Random/' + command + '.json')
var b = await a.json()
var c = await Func.pickRandom(b)
var d = await Func.satuButton(`.${command}`, 'Next..')
client.sendImage(msg.from, c, 'Generate random person ' + command + '.', msg, { isUrl: true, buttons: d, headerType: 5, footer: wm })
}
handler.tags = ['asupan']
handler.help = ['china','cecan','thailand','vietnam']
handler.command = /^(china|cecan|vietnam|thailand)$/i

module.exports = handler
