const fetch = require('node-fetch')
var handler = async(msg, { 
client 
}) => {
var a = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Religi/asmaulhusna.json')
var b = await a.json()
var c = await Func.pickRandom(b)
msg.reply(`*乂 A S M A U L - H U S N A*

  *◦ Latin :* ${c.latin}
  *◦ Arabic :* ${c.arabic}
  *◦ Indonesian :* ${c.translation_id}
  *◦ English :* ${c.translation_en}
`)
}
handler.help = ['asmaulhusna']
handler.tags = ['religi']
handler.command = /^(asmaulhusna)$/i

module.exports = handler
