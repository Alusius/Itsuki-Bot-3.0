var handler = async(msg, { 
client 
}) => {
var sendOwner = await sendKontak(msg.from, Info.owner, msg)
var teks = `*🚩 Hi kak @${msg.sender.split('@')[0]} ini adalah kontak creator kami, kami tidak akan menanggapi hal yang tidak penting.*`
client.sendMessage(msg.from, { text: teks, mentions: client.parseMention(teks)}, { quoted:sendOwner })
}
handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(owner|creator)$/i

module.exports = handler

// by me
async function sendKontak(jid, kon, quoted = '', opts = {}) {
    let list = []
    for (let i of kon) {
    list.push({
    displayName: await client.getName(i + '@s.whatsapp.net'),
    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(i + '@s.whatsapp.net')}\nFN:${await client.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${Info.gmail}\nitem2.X-ABLabel:Email\nitem3.URL:${Info.instagram}\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
    })
    }
    return client.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
}
