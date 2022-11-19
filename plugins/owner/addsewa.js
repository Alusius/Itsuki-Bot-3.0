const { addSewaGroup, getSewaPosition } = require('../../system/sewa')
const fs = require('fs')
const sewa = JSON.parse(fs.readFileSync('./system/database/sewa.json'))

var handler = async(msg, { 
client, args, usedPrefix, command 
}) => {
if (command == 'addsewa') {
if (!args[0]) return msg.reply(`🚩 Masukkan durasi waktu sewa\n\n*Contoh :* ${usedPrefix+command} 1d\n\n*DESK*\n• m, minute = menit\n• h, hour = jam\n• d, day = hari\n• w, week = bulan\n• y, year = tahun`)
addSewaGroup(msg.from, args[0], sewa)
msg.reply(`🚩 Berhasil menambah expired sewa bot kedalam chat ini dengan durasi ${args[0]}`)
}
if (command == 'delsewa') {
sewa.splice(getSewaPosition(msg.from, sewa), 1)
fs.writeFileSync('./system/database/sewa.json', JSON.stringify(sewa))
msg.reply(`🚩 Berhasil menghapus hitungan expired pada grup ini.`)
}
}
handler.help = ['addsewa']
handler.tags = ['owner']
handler.command = /^(addsewa)$/i

handler.owner = true
handler.group = true

module.exports = handler
