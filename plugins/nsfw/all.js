var fetch = require('node-fetch')
var handler = async (msg, { 
client, command 
}) => {
var bufer = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Nsfw/' + command + '.json')
var buf = await bufer.json()
var res = await Func.pickRandom(buf)
var but = await Func.satuButton(`.${command}`, 'NEXT')
client.sendImage(msg.from, res, '🚩 Random Nsfw ' + command + '.', msg, { isUrl: true, buttons: but, headerType: 5, footer: wm })
}
handler.command = handler.help = ['ahegao','ass','bdsm','blowjob','cuckold','cum','ero','femdom','foot','gangbang','glasses','hentai','jahy','masturbation','nsfwloli','nsfwmanga','nsfwneko','orgy','panties','pussy','tentacles','thighs','zettai']
handler.tags = ['nsfw']
handler.nsfw = true

module.exports = handler

// tambah sendiri adReplynya kalau mau
