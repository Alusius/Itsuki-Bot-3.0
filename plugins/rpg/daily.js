var fs = require('fs')
var handler = async (msg, { 
client, text, command, usedPrefix
}) => {
var _timers = (86400000 - (new Date - user.lastclaim))
var timers = Func.clockString(_timers) 
if (new Date - user.lastclaim > 86400000) {
var bufer = await Func.resize(fs.readFileSync('./global/media/rpg/daily.jpg'), 300, 150)
var buton = await Func.duaButton('.monthly','Monthly','.weekly','Wekkly')
client.sendImage(msg.from, bufer, `*乂 D A I L Y  -  C L A I M*

+ Rp 1.000.000 Money 💵
+ 1 Wood 🪵
+ 2 Rock 🪨
+ 1 Potion 🥤
+ 2 Common crate 📦
+ 1 Sword ⚔️
+ 2 Pet Food 🍖
+ 5 String 🕸️
+ 1 Pet Crate 🪤
`, msg, { asLocation: true, buttons: buton, headerType: 4, footer: wm })
user.money += 2500 * 2000
user.potion += 1 * 1
user.wood += 1 * 1
user.rock += 2 * 1
user.common += 2 * 1
user.sword += 1 * 1
user.petFood += 2 * 1
user.pet += 1 * 1
user.string += 5 * 1
user.lastclaim = new Date * 1
} else {
client.reply(msg.from, `🚩 Kamu sudah melakukan claim hari ini, silahkan menunggu sampai besok untuk melakukan claim lagi.\n\nTimeout : [ *${timers}* ]`, msg)
}
}
handler.tags = ['rpg']
handler.help = ['daily','claim']
handler.command = /^(daily|claim)$/i

module.exports = handler
