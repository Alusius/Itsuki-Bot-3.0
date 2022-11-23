var handler = (msg, { 
usedPrefix, command, text 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <date>\n\n*Contoh :* ${usedPrefix + command} 06 02 2001`)
var date = new Date(text)
if (date == 'Invalid Date') return msg.reply(date)
var d = new Date()
var [tahun, bulan, tanggal] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
var birth = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
var zodiac = getZodiac(birth[1], birth[2])
var ageD = new Date(d - date)
var age = ageD.getFullYear() - new Date(1970, 0, 1).getFullYear()
var birthday = [tahun + (+ new Date(1970, bulan - 1, tanggal) > + new Date(1970, birth[1] - 1, birth[2])), ...birth.slice(1)]
var cekusia = bulan === birth[1] && tanggal === birth[2] ? `Selamat ulang tahun yang ke-${age} 🥳` : age

var teks = `
Lahir : ${birth.join('-')}
Ultah Mendatang : ${birthday.join('-')}
Usia : ${cekusia}
Zodiak : ${zodiac}
`.trim()
    client.sendMessage(msg.from, { text: teks }, { quoted: msg })
}
handler.help = ['zodiac']
handler.tags = ['random']

handler.command = /^zodia[kc]$/i

module.exports = handler

const zodiak = [
    ["Capricorn", new Date(1970, 0, 1)],
    ["Aquarius", new Date(1970, 0, 20)],
    ["Pisces", new Date(1970, 1, 19)],
    ["Aries", new Date(1970, 2, 21)],
    ["Taurus", new Date(1970, 3, 21)],
    ["Gemini", new Date(1970, 4, 21)],
    ["Cancer", new Date(1970, 5, 22)],
    ["Leo", new Date(1970, 6, 23)],
    ["Virgo", new Date(1970, 7, 23)],
    ["Libra", new Date(1970, 8, 23)],
    ["Scorpio", new Date(1970, 9, 23)],
    ["Sagittarius", new Date(1970, 10, 22)],
    ["Capricorn", new Date(1970, 11, 22)]
].reverse()

function getZodiac(month, day) {
    let d = new Date(1970, month - 1, day)
    return zodiak.find(([_,_d]) => d >= _d)[0]
}
