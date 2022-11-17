var fetch = require('node-fetch')

var handler = async(msg, { 
client, command 
}) => {
var buton = await Func.satuButton(`.${command}`, 'NEXT')
var imge = await fetch('https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Anime/' + command + '.json')
var img = await imge.json()
var res = Func.pickRandom(img)
client.sendImage(msg.from, res, '🚩 Generate random image ' + command, msg, { isUrl: true, buttons: buton, headerType: 5, footer: wm })
}
handler.help = ['akira','akiyama','ana','asuna','ayuzawa','boruto','chitanda','chitoge','deidara','elaina','emilia','erza','gremory','hestia','hinata','inori','isuzu','itachi','itori','kaga','kagura','kakasih','kaneki','kaori','kosaki','kotori','kuriyama','kuroha','kurumi','loli','madara','megumin','mikasa','miku','minato','naruto','natsukawa','neko','nekonime','nezuko','nishimiya','onepiece','rem','rize','sagiri','sakura','sasuke','shina','shinka','shizuka','shota','tomori','toukachan','tsunade','yatogami','yuki']
handler.tags = ['anime']
handler.command = /^(akira|akiyama|ana|asuna|ayuzawa|boruto|chitanda|chitoge|deidara|elaina|emilia|erza|gremory|hestia|hinata|inori|isuzu|itachi|itori|kaga|kagura|kakasih|kaneki|kaori|kosaki|kotori|kuriyama|kuroha|kurumi|loli|madara|megumin|mikasa|miku|minato|naruto|natsukawa|neko|nekonime|nezuko|nishimiya|onepiece|rem|rize|sagiri|sakura|sasuke|shina|shinka|shizuka|shota|tomori|toukachan|tsunade|yatogami|yuki)$/i

module.exports = handler
