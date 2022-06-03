let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys')
let fs = require('fs')
let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
const moment = require("moment-timezone");
const salam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
let wm = global.wm
let botname = global.namebot
let nenene = global.fotonya1
let name = conn.getName(m.sender)
let anu =  `
Haii Kak ${name} Selamat ${salam} 

Saya ${botname}, Bot Ini Adalah Beta Multi-Device WhatsApp.
Jika Kamu Menemukan Semacam Bug Atau Kesalahan Mohon Dimaklumi Dulu Ya, Lapor Owner Agar Segera Di Perbaiki 🙏
`    
     let message = await prepareWAMessageMedia({ image: await (await require('node-fetch')(nenene)).buffer()}, { upload: conn.waUploadToServer }) 
      const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
      templateMessage: {
          hydratedTemplate: {
            imageMessage: message.imageMessage, 
            hydratedContentText: anu,
            hydratedFooterText: `${namebot} by ${nameowner}`, 
            hydratedButtons: [{
              urlButton: {
                displayText: 'Group Creator',
                url: gc
              }

            },
                {
              urlButton: {
                displayText: 'Website Creator',
                url: web
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
                displayText: 'Donasi',
                id: '.donasi', 
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
