var handler = async (msg, { 
client, usedPrefix, command, args, isOwner, isAdmins, isROwner 
}) => {
var isEnable = /true|enable|(turn)?on|1/i.test(command)
var chat = global.db.data.chats[msg.from]
var set = global.db.data.settings[botNumber]
var type = (args[0] || '').toLowerCase()
switch (type) {
case 'welcome': {
if (!msg.isGroup) return msg.reply('🚩' + Only.group)
if (!isAdmins) return msg.reply('🚩' + Only.admin)
chat.welcome = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} welcome pada group ini.*`)
}
break
case 'antilink': {
if (!msg.isGroup) return msg.reply('🚩' + Only.group)
if (!isAdmins) return msg.reply('🚩' + Only.admin)
chat.antilink = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} antilink pada group ini.*`)
}
break
case 'nsfw': {
if (msg.isGroup && !isAdmins) return msg.reply('🚩' + Only.admin)
chat.nsfw = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} akses nsfw pada chat ini.*`)
}
break
case 'antiviewonce': {
if (!msg.isGroup) return msg.reply('🚩' + Only.group)
if (!isAdmins) return msg.reply('🚩' + Only.admin)
chat.once = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} antiviewonce pada group ini.*`)
}
break
case 'antitoxic': {
if (msg.isGroup && !isAdmins) return msg.reply('🚩' + Only.admin)
chat.toxic = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} antitoxic pada group ini.*`)
}
break
case 'autodl': case 'autodownload': {
if (msg.isGroup && !isAdmins) return msg.reply('🚩' + Only.admin)
chat.autodl = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} autodownload pada chat ini.*`)
}
break
case 'antidelete': {
if (msg.isGroup && !isAdmins) return msg.reply('🚩' + Only.admin)
chat.delete = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} antidelete pada chat ini.*`)
}
break
case 'pengumuman': {
if (!msg.isGroup) return msg.reply('🚩' + Only.group)
if (!isAdmins) return msg.reply('🚩' + Only.admin)
chat.info = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} pengumuman pada group ini.*`)
}
break
case 'lokalonly': case 'onlyindo': {
if (!isOwner) return msg.reply('🚩' + Only.owner)
set.self = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} mode self pada ${Info.botName}.*`)
}
break
case 'anticall': {
if (!isOwner) return msg.reply('🚩' + Only.owner)
set.anticall = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} anticall pada ${Info.botName}.*`)
}
break
case 'backupdb': {
if (!isOwner) return msg.reply('🚩' + Only.owner)
set.backup = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} backupdb pada ${Info.botName}.*`)
}
break
case 'gconly': case 'grouponly': {
if (!isOwner) return msg.reply('🚩' + Only.owner)
set.groupOnly = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} group only pada ${Info.botName}.*`)
}
break
case 'jadibot': {
if (!isOwner) return msg.reply('🚩' + Only.owner)
set.jadibot = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} fitur jadibot pada ${Info.botName}.*`)
}
break
case 'autoread': {
if (!isOwner) return msg.reply('🚩' + Only.owner)
set.autoread = isEnable
msg.reply(`*🚩 Berhasil ${isEnable ? 'mengaktifkan' : 'menonaktifkan'} autoread pada ${Info.botName}.*`)
}
break
default:
if (!/[01]/.test(command)) {
client.reply(msg.from, `*乂 D A F T A R  -  O P S I*

   ◦ welcome
   ◦ antilink
   ◦ nsfw
   ◦ antiviewonce
   ◦ antitoxic
   ◦ autodownload
   ◦ antidelete
   ◦ pengumuman ${isOwner ? '\n   ◦ onlyindo\n   ◦ anticall\n   ◦ backupdb\n   ◦ grouponly\n   ◦ jadibot\n   ◦ autoread' : ''}
   
*Contoh:*
${usedPrefix}on antilink
${usedPrefix}off antilink
`, msg)
return false
}
}
}
handler.help = ['on', 'off'].map(v => v + ' <opsi>')
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

module.exports = handler
