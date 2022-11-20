const fs = require('fs')
const path = require('path')
const handler = async (msg, { 
usedPrefix, command, text 
}) => {
if (!text) return msg.reply(`🚩 Gunakan format ${usedPrefix + command} <directory|name>\n\n*Contoh :* ${usedPrefix + command} info/owner.js`)
var path = `./plugins/${text}`
var isThere = fs.existsSync(path)
if (isThere) {
msg.reply(fs.readFileSync(path, 'utf-8'))
} else {
msg.reply(`🚩 Plugin ${text} tidak ditemukan.`)
}
}
handler.help = ['getplugin']
handler.tags = ['owner']
handler.command = /^(getplugin|get ?plugin|gp)$/i

handler.owner = true

module.exports = handler

// mempermudah doang, credits by hyzerdev
