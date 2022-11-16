var handler = async (msg, { client, text }) => {
  var id = msg.from
  client.math = client.math ? client.math : {}
  if (id in client.math) {
    clearTimeout(client.math[id][3])
    delete client.math[id]
    msg.reply('🚩 Terdeteksi kamu menggunakan kalkulator saat dalam sesi bermain math.')
  }
  var val = text
    .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π|pi/gi, 'Math.PI')
    .replace(/e/gi, 'Math.E')
    .replace(/\/+/g, '/')
    .replace(/\++/g, '+')
    .replace(/-+/g, '-')
  var format = val
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\//g, '÷')
    .replace(/\*×/g, '×')
  try {
    console.log(val)
    var result = (new Function('return ' + val))()
    if (!result) throw result
    msg.reply(`*${format} = ${result}*`)
  } catch (e) {
    if (e == undefined) return msg.reply('Isinya?')
    return msg.reply('🚩 Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport')
  }
}
handler.help = ['kalkulator <soal>']
handler.tags = ['tools']
handler.command = /^(calc(ulat(e|or))?|kalk(ulator)?)$/i

module.exports = handler
