const fetch = require('node-fetch')
var handler = async(msg, { 
client 
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Random/ppcouple.json')
var b = await a.json()
var c = await Func.pickRandom(b)
client.sendImage(msg.from, c.cowo, 'Cowo.', msg, { isUrl: true })
client.sendImage(msg.from, c.cewe, 'Cewe.', msg, { isUrl: true })
}
handler.help = ['couple','ppcouple'].map(v => v + ' <reply>')
handler.tags = ['random']
handler.command = /^(couple|ppcouple|ppcp)$/i

module.exports = handler
