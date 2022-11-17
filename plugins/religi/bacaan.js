const fetch = require('node-fetch')
var handler = async(msg, { 
client 
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Religi/bacaansholat.json')
var b = await a.json()
var c = await Func.pickRandom(b.result)
msg.reply(`*乂 B A C A A N  -  S H O L A T*

  *◦ Name :* ${c.name}
  *◦ Arabic :* ${c.arabic}
  *◦ Latin :* ${c.latin}
  *◦ Indonesian :* ${c.terjemahan}
`)
}
handler.help = ['bacaansholat','bacaan']
handler.tags = ['religi']
handler.command = /^(bacaansholat|bacaan)$/i

module.exports = handler
