var handler = async(msg, { 
client 
}) => {
if (user.money > 499999999) { 
await msg.reply('🚩 Berhasil menjadi anggota premium bot secara permanen, ketik *#premium* untuk mengetahui apa itu anggota premium dan keuntungannya.')
user.money -= 500000000 * 1
Info.premium.push(msg.sender.split('@')[0])
} else {
msg.reply('Untuk mendaftar menjadi *pengguna premium* menggunakan inventory, kamu harus memiliki money sebesar\nRp 500.000.000.')
}
}
handler.help = ['daftarprem','daftarpremium']
handler.tags = ['xp']
handler.command = /^(daftarprem|daftarpremium)$/i

module.exports = handler
