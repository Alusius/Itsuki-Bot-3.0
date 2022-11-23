var handler = async (msg, { 
client, text, usedPrefix, command 
}) => {
client.menfess = client.menfess ? client.menfess : {}
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} nomor|nama pengirim|pesan\n\n*Contoh :* ${usedPrefix + command} ${msg.sender.split('@')[0]}|Bot|Hi\n\n*Note :* Nama pengirim dapat berupa nama samaran atau anonymous.`)
var [jid, name, pesan] = text.split`|`
if ((!jid || !name || !pesan)) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} nomor|nama pengirim|pesan\n\n*Contoh :* ${usedPrefix + command} ${msg.sender.split('@')[0]}|Bot|Hi\n\n*Note :* Nama pengirim dapat berupa nama samaran atau anonymous.`)
var place = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
var data = (await client.onWhatsApp(place))[0] || {};
if (!data.exists) return msg.reply('🚩 Nomer tidak terdaftar di whatsapp.')
if (jid == msg.sender) return msg.reply('🚩 Tidak bisa mengirim pesan menfess ke diri sendiri.')
var mf = Object.values(client.menfess).find(mf => mf.status === true)
if (mf) return !0
try {
var id = + new Date
var txt = `*M E N F E S S - W H A T S A P P*

Hai @${data.jid.split('@')[0]}, kamu mendapatkan pesan rahasia dari seseorang nih.

*Pengirim :* ${name}
*Pesan :* ${pesan}

Ingin membalas pesan ini? kamu tinggal ketik pesan kamu lalu kirim dengan mereply pesan ini, maka bot akan otomatis memberikan balasanmu kepada pengirim menfess ini.
`.trim() 
client.reply(data.jid, txt, null, { mentions: client.parseMention(txt), buttons: [{buttonId: '.balasmenfess', buttonText: {displayText: '♨️ Balas Pesan'}, type: 1}], headerType: 5, footer: '_Menfess - Whatsapp Bot_' }).then(() => { 
msg.reply('🚩 Berhasil mengirim pesan menfess.')
client.menfess[data.jid] = {
id,
dari: msg.sender,
nama: name,
penerima: data.jid,
pesan: pesan,
balas: false
}
return !0
})
} catch(e) {
throw e
msg.reply('*🚩 Terjadi kesalahan.*')
}
}
handler.tags = ['random']
handler.help = ['menfess', 'mf', 'menfes']
handler.command = /^(mf|menfess|menfes)$/i

handler.private = true

module.exports = handler

// Menfess By Hyzer Official 
