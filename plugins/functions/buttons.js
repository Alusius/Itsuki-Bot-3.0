const { proto, generateWAMessage, areJidsSameUser } = require('@adiwajshing/baileys')

module.exports = {
    async all(msg, chatUpdate) {
        if (msg.isBaileys) return
        if (!msg.message) return
        if (!(msg.message.buttonsResponseMessage || msg.message.templateButtonReplyMessage || msg.message.listResponseMessage)) return
        let id = msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.templateButtonReplyMessage?.selectedId || msg.message.listResponseMessage.singleSelectReply?.selectedRowId
        let text = msg.message.buttonsResponseMessage?.selectedDisplayText || msg.message.templateButtonReplyMessage?.selectedDisplayText || msg.message.listResponseMessage?.title
        let isIdMessage = false, usedPrefix
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin) continue
            if (plugin.disabled) continue
            if (!opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) continue
            if (typeof plugin !== 'function') continue
            if (!plugin.command) continue
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(id), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(id), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(id), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = id.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                command = (command || '').toLowerCase()
                let isId = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false
                if (!isId) continue
                console.log({ name, command: plugin.command, text: id })
                isIdMessage = true
            }

        }
        let messages = await generateWAMessage(msg.from, { text: isIdMessage ? id : text, mentions: await msg.mentionedJid }, {
            userJid: this.user.id,
            quoted: msg.quoted && msg.quoted.fakeObj
        })
        messages.key.fromMe = areJidsSameUser(msg.sender, this.user.id)
        messages.key.id = msg.key.id
        messages.pushName = await msg.name
        if (msg.isGroup) messages.participant = msg.sender
        let musg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }
        this.ev.emit('messages.upsert', musg)
    }
}
