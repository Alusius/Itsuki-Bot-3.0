var cp = require('child_process')
var { promisify } = require('util')
var exec = promisify(cp.exec).bind(cp)
var handler = async (msg, { 
client, isOwner, command, text 
}) => {
if (global.client.user.jid != client.user.jid) return
msg.reply('Executing...')
let o
try {
o = await exec(command.trimStart()  + ' ' + text.trimEnd())
} catch (e) {
o = e
} finally {
let { stdout, stderr } = o
if (stdout.trim()) msg.reply(stdout)
if (stderr.trim()) msg.reply(stderr)
}
}
handler.customPrefix = /^[$] /
handler.command = new RegExp
handler.owner = true
module.exports = handler
