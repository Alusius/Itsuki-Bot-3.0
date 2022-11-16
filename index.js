var cluster = require('cluster')
var path = require('path')
var fs = require('fs')
var package = require('./package.json')
var CFonts = require('cfonts')
var Readline = require('readline')
var yargs = require('yargs/yargs')
var rl = Readline.createInterface(process.stdin, process.stdout)

CFonts.say('Simple WhatsApp Bot By Hyzer Official', {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
})

var isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return
  isRunning = true
  var args = [path.join(__dirname, file), ...process.argv.slice(2)]  
  cluster.setupMaster({
    exec: path.join(__dirname, file),
    args: args.slice(1),
  })
  var p = cluster.fork()
  p.on('message', data => {
    console.log('[❗] Menerima Data : ', data)
    switch (data) {
      case 'reset':
        p.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })
  p.on('exit', code => {
    isRunning = false
    console.error('[❗] Exited With Code:', code)
    if (code === 0) return
    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0])
      start(file)
    })
  })
  var opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  if (!opts['test'])
    if (!rl.listenerCount()) rl.on('line', line => {
      p.emit('message', line.trim())
    })
  // console.log(p)
}

start('hyzer.js')
