function handler(msg, { text }) {
    let teks = text ? text : msg.quoted && msg.quoted.text ? msg.quoted.text : msg.text
    msg.reply(teks.replace(/[a-z]/gi, v => Math.random() > .5 ? v[['toLowerCase', 'toUpperCase'][Math.floor(Math.random() * 2)]]() : v).replace(/[abegiors]/gi, v => {
        if (Math.random() > .5) return v
        switch (v.toLowerCase()) {
            case 'a': return '4'
            case 'b': return Math.random() > .5 ? '8' : '13'
            case 'e': return '3'
            case 'g': return Math.random() > .5 ? '6' : '9'
            case 'i': return '1'
            case 'o': return '0'
            case 'r': return '12'
            case 's': return '5'
        }
    }))
}
handler.help = ['alay']
handler.tags = ['random']
handler.command = ['alay']

module.exports = handler
