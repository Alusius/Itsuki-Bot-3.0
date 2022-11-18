var handler = async (msg, { 
client, usedPrefix, args, command 
}) => {
var durasi = (args[0] || '').toLowerCase()
switch(durasi) {
case '1hari': {
sendPay(msg.from, '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• 1 Hari : [ Rp 1.500,- ]')
var txtt = `*乂 S E W A  - B O T*

  *Dari :* @${msg.sender.split('@')[0]}
  *Selama :* 1 Hari

_Mohon untuk segera memproses pesanan ini._
`
client.reply(Info.owner[0] + '@s.whatsapp.net', txtt, msg, { mentions: await client.parseMention(txtt) })
}
break
case '1minggu': {
sendPay(msg.from, '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• 1 Minggu : [ Rp 10.000,- ]')
var txt = `*乂 S E W A  - B O T*

  *Dari :* @${msg.sender.split('@')[0]}
  *Selama :* 1 Minggu

_Mohon untuk segera memproses pesanan ini._
`
client.reply(Info.owner[0] + '@s.whatsapp.net', txt, msg, { mentions: await client.parseMention(txt) })
}
break
case '1bulan': {
sendPay(msg.from, '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• 1 Bulan : [ Rp 35.000,- ]')
var tx = `*乂 S E W A  - B O T*

  *Dari :* @${msg.sender.split('@')[0]}
  *Selama :* 1 Bulan 

_Mohon untuk segera memproses pesanan ini._
`
client.reply(Info.owner[0] + '@s.whatsapp.net', txt, msg, { mentions: await client.parseMention(tx) })
}
break
case 'permanen': {
sendPay(msg.from, '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• Permanen : [ Rp 50.000,- ]')
var t = `*乂 S E W A  - B O T*

  *Dari :* @${msg.sender.split('@')[0]}
  *Selama :* Permanen

_Mohon untuk segera memproses pesanan ini._
`
client.reply(Info.owner[0] + '@s.whatsapp.net', t, msg, { mentions: await client.parseMention(t) })
}
break
default:  
client.sendMessage(msg.from, {
text: `🚩 Silahkan pilih daftar harga sewabot di bawah ini.`,
buttonText: "List Harga",
"sections": [
{
"rows": [
{
"title": "1 HARI",
"description": "Rp 1.500,-",
"rowId": ".sewa 1hari"
},
{
"title": "1 MINGGU",
"description": "Rp 10.000,-",
"rowId": ".sewa 1minggu"
},
{
"title": "1 BULAN",
"description": "Rp 35.000,-",
"rowId": ".sewa 1bulan"
},
{
"title": "PERMANEN",
"description": "Rp 50.000,-",
"rowId": ".sewa permanen"
},
]
}
],
}, { 
quoted: msg, 
contextInfo: {
stanzaId: msg.key.id,
participant: msg.sender
}
}
)
}
}
handler.help = ['sewabot', 'belibot']
handler.tags = ['info']
handler.command = /^(sewabot|belibot|sewa)$/i

module.exports = handler

async function sendPay(jid, tex) {
return client.relayMessage(jid, { requestPaymentMessage: { noteMessage: {  extendedTextMessage: { text: tex }}, currencyCodeIso4217: 'IDR', currencyCode: 'Mau apa? Eval?', requestFrom: '62877688861483@s.whatsapp.net', expiryTimestamp: 300000, amount1000: 10000000, amount: 1500000 }}, {})
}

// Silahkan ambil, credits by hyzer
