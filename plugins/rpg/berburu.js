var fs = require('fs')
var handler = async (msg, { 
client 
}) => {
var buton = await Func.duaButton('.weekly', 'Weekly', '.hourly', 'Hourly')
var buffer = fs.readFileSync('./global/media/Rpg/Berburu/' + Func.pickRandom(['1','2','3']) + '.jpg')
var buf = await Func.resize(buffer, 300, 300)
var luka = Func.pickRandom(['memakan buah beracun','jatuh ke sungai','dililit ular','terkena dahan pohon besar','memijak kaca','ditelan bumi','kurang ganteng','jatuh jurang','tenggelam di sungai','ditimpa pohon','makan makanan beracun','disengat lebah','dipatok ular','diburu orang pedalaman']) // gw g ad ide ajg
var ketiga = Func.pickRandom(['Berhasil menembaki hewan buruan...','Hewan buruan berhasil masuk perangkapmu..','Duarr, Duarr, mencoba terus menembaki hewan buruan.....','Kpummnn, kpummnn, menembaki hewan buruan..']) // tambahin sendiri 
var kedua = Func.pickRandom(['Menemukan segerombolan hewan buruan, mencoba menembak.','Mendapatkan mangsa untuk diburu...','Menemukan hewan buruan..']) // tambahin sendiri 
var pertama = Func.pickRandom(['Tidak menemukan hewan, mencoba memasuki lembah..','Memasuki hutan rimba..','Memasuki kawasan padang rumput','Terkena luka saat dalam perjanan']) // tambahin sendiri 
var awal = Func.pickRandom(['Memulai pemburuan','Menyiapkan alat untuk berburu..','Melakukan pemburuan...'])
var banteng = Math.floor(Math.random() * 5)
var harimau = Math.floor(Math.random() * 5)
var gajah = Math.floor(Math.random() * 5)
var kambing = Math.floor(Math.random() * 5)
var panda = Math.floor(Math.random() * 5)
var buaya = Math.floor(Math.random() * 5)
var sapi = Math.floor(Math.random() * 5)
var kerbau = Math.floor(Math.random() * 5)
var monyet = Math.floor(Math.random() * 5)
var ayam = Math.floor(Math.random() * 5)
var domba = Math.floor(Math.random() * 5)
var kuda = Math.floor(Math.random() * 5)
var hp = Math.floor(Math.random() * 30)
var timer = (new Date - user.lasthunt)
var timers = (500000 - timer)
if (user.health != 0) {
if (new Date - user.lasthunt > 500000) {
setTimeout(() => {
client.sendImage(msg.from, buf, `*乂 R P G  -  B E R B U R U*

Kamu melakukan pemburuan, dan terluka karena ${luka} dan mengakibatkan health/hp mu berkurang sebesar ${hp}, hasil buruan kamu : 

🐄 = [ *${sapi}* ]       🐊 = [ *${buaya}* ]
🐃 = [ *${banteng}* ]       🐂 = [ *${kerbau}* ]
🐅 = [ *${harimau}* ]       🐒 = [ *${monyet}* ]
🐘 = [ *${gajah}* ]       🐓 = [ *${ayam}* ]
🐐 = [ *${kambing}* ]       🐑 = [ *${domba}* ]
🐼 = [ *${panda}* ]       🐎 = [ *${kuda}* ]

➠ Health️ ❤️ = [ *-${hp}* ️]
`, msg, { asLocation: true, buttons: buton, headerType: 5, footer: wm })
}, 20000)
setTimeout(() => {
msg.reply(ketiga)
}, 15000)
setTimeout(() => {
msg.reply(kedua)
}, 7500)
setTimeout(() => {
msg.reply(pertama)
}, 2500)
setTimeout(() => {
msg.reply(awal)
}, 0)
user.sapi += sapi * 1
user.banteng += banteng * 1
user.harimau += harimau * 1
user.gajah += gajah * 1
user.kambing += kambing * 1
user.panda += panda * 1
user.buaya += buaya * 1
user.kerbau += kerbau * 1
user.monyet += monyet * 1
user.ayam += ayam * 1
user.domba += domba * 1
user.horse += kuda * 1
user.health -= hp * 1
user.lasthunt = + new Date * 1
} else {
msg.reply(`🚩 Silahkan tunggu beberapa saat untuk melakukan pemburuan lagi.\n\nTimeout : [ *${Func.clockString(timers)}* ]`)
}
} else {
msg.reply(`🚩 Hp kamu tidak mencukupi untuk melakukan pemburuan, silahkan heal terlebih dahulu dengan mengetik #heal*`)
}
}
handler.help = ['berburu','hunt']
handler.tags = ['rpg']
handler.command = /^(berburu|hunt)$/i
// buatan saya, maap g kreatif 
module.exports = handler
