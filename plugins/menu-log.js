let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys')
let fs = require('fs')
let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
let botname = global.namebot
let thumb1 = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
 try {
 	thumb1 = `https://api.lolhuman.xyz/api/textprome/blackpink?apikey=Papah-Chan&text=${botname}`
const moment = require("moment-timezone");
const salam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
let wm = global.wm
let name = conn.getName(m.sender)
let anu =  `
Haii Kak ${name} Selamat ${salam} 

Saya ${botname}, Bot Ini Adalah Beta Multi-Device WhatsApp.
Jika Kamu Menemukan Semacam Bug Atau Kesalahan Mohon Dimaklumi Dulu Ya, Lapor Owner Agar Segera Di Perbaiki 🙏
`
     let message = await prepareWAMessageMedia({ image: await (await require('node-fetch')(thumb1)).buffer()}, { upload: conn.waUploadToServer }) 
      const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
      templateMessage: {
          hydratedTemplate: {
            imageMessage: message.imageMessage, 
            hydratedContentText: anu,
            hydratedFooterText: wm, 
            hydratedButtons: [{
              urlButton: {
                displayText: 'Youtube Creator',
                url: 'bit.ly/3xufB2g'
              }

            },
                {
              urlButton: {
                displayText: 'Source Code',
                url: 'Belum Ada Banh, Tunggu Aja Update Selanjutnya Di Channel Youtube Hyzer Official'
              }

             },
                {
              quickReplyButton: {
                displayText: 'Contact Owner',
                id: '.owner', 
              }

             },
                {
              quickReplyButton: {
                displayText: 'More About Bot',
                id: '.ping', 
              }
             
            }, 
               {
              quickReplyButton: {
              	displayText: 'List Command', 
                  id: '.help', 
              }
              
           }]
         }
       }
     }), { quoted: m, userJid: m.sender });
    //conn.reply(m.chat, text.trim(), m)
    return await conn.relayMessage(
         m.chat,
         template.message,
         { messageId: template.key.id }
     )
} catch (e) {
    conn.reply(m.chat, 'Emror Banh', m)
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

handler.exp = 0

module.exports = handler
