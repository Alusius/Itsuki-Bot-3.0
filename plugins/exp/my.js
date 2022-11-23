var handler = async(msg, { 
client 
}) => {
var user = db.data.users[msg.sender]
var teks = `*乂  L I M I T  &  M O N E Y*

  *◦ Limit :* ${user.limit}
  *◦ Money :* Rp ${Func.toRupiah(user.money)}
  *◦ Poin :* ${user.point}
  *◦ Premium :* [ *${Info.premium.includes(msg.sender.split('@')[0]) ? '√' : '×'}* ]
`
var buton = await Func.satuButton('.menu','Menu')
client.reply(msg.from, teks, msg, { buttons: buton, headerType: 5, footer: wm })
}
handler.help = ['my','limit']
handler.tags = ['xp']
handler.command = /^(my|limit)$/i

module.exports = handler
