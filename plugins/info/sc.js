const handler = async (msg, { client }) => {
msg.reply(Info.bot.source)
}
handler.tags = ['info']
handler.help = ['sc','sourcecode','script']
handler.command = /^(sc|script|sourcecode)$/i

module.exports = handler
