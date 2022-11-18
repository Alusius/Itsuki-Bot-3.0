var fs = require('fs')
var handler = msg => msg
handler.all = async function (msg, { client }) {
var set = db.data.settings[botNumber]

if (set.backup) {
if (new Date() * 1 - set.backupDB > 1000 * 60 * 60) {
var d = new Date
var date = d.toLocaleDateString('id', {
day: 'numeric',
lmonth: 'long',
year: 'numeric'
})
await global.db.write()
var sendDb = await this.sendMessage(Info.owner[0] + '@s.whatsapp.net', { document: fs.readFileSync('./system/database/database.json'), mimetype: 'application/json', fileName: `Database User ${Info.botName}`}, { quoted: null })
this.reply(Info.owner[0] + '@s.whatsapp.net', `🚩 Database: ${date}`, sendDb)
set.backupDB = new Date() * 1
}
}

// update status
if (new Date() * 1 - set.status > 1000) {
var tets = `💫 Aktif Selama ${Func.runtime(process.uptime())} || Mode ${set.self ? 'Hanya Grup' : 'Publik'}`
await this.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(tets, 'utf-8')
}]
})
setting.status = new Date() * 1
}
}

module.exports = handler
