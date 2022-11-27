const {
useSingleFileAuthState,
DisconnectReason
} = require('@adiwajshing/baileys')
const { generate } = require('qrcode-terminal')
const WebSocket = require('ws')
const path = require('path')
const fs = require('fs')
const yargs = require('yargs/yargs')
const cp = require('child_process')
const _ = require('lodash')
const syntaxerror = require('syntax-error')
const P = require('pino')
const os = require('os')
const chalk = require('chalk')
const sock = require('./system/socket')
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./system/database/LowDB')
}
const { Low, JSONFile } = low
const mongoDB = require('./system/database/mongoDB')

sock.protoType()

global.timestamp = {
start: new Date
}
global.Func = require('./system/function.js')
global.Scraper = require('./system/scraper.js')

const PORT = process.env.PORT || 3000

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`./system/database/database.json`)
)
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
database: {},
game: {},
settings: {},
others: {},
sticker: {},
anonymous: {},
...(global.db.data || {})
}

global.db.chain = _.chain(global.db.data)
}
loadDatabase()

global.authFile = './system/connect/session.json'
global.isInit = !fs.existsSync(authFile)
const { state, saveState } = useSingleFileAuthState(global.authFile)
global.Info = JSON.parse(fs.readFileSync('./global/settings.json'))

const connectionOptions = {
  printQRInTerminal: true,
  auth: state,
  logger: P({ level: 'silent' }),
  version: [2, 2204, 13]
}

global.client = sock.makeWASocket(connectionOptions)

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 30 * 1000)
}

if (opts['big-qr'] || opts['server']) client.ev.on('qr', qr => generate(qr, { small: false }))
if (opts['server']) require('./system/server')(global.client, PORT)

async function connectionUpdate(update) {
const { connection, lastDisconnect } = update
global.timestamp.connect = new Date
if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && client.ws.readyState !== WebSocket.CONNECTING) {
console.log(global.reloadHandler(true))
}
if (global.db.data == null) await loadDatabase()
if (update.receivedPendingNotifications) {
console.log('🚩 Berhasil mengaktifkan bot.')
}
if (update.qr != 0 && update.qr != undefined) {
console.log('🚩 Scan QR Dibawah, Qr Expired Dalam 20 Detik.')
console.log('\nQR : ', chalk.green(update.qr)) // have no idea
}
//console.log(JSON.stringify(update, null, 4))
}

const imports = (path) => {
path = require.resolve(path)
let modules, retry = 0
do {
if (path in require.cache) delete require.cache[path]
modules = require(path)
retry++
} while ((!modules || (Array.isArray(modules) || modules instanceof String) ? !(modules || []).length : typeof modules == 'object' && !Buffer.isBuffer(modules) ? !(Object.keys(modules || {})).length : true) && retry <= 10)
return modules
}
let isInit = true
global.reloadHandler = function (restatClient) {
let handler = imports('./system/validation')
if (restatClient) {
try { global.client.ws.close() } catch { }
global.client = {
...global.client, ...sock.makeWASocket(connectionOptions)
}
}
if (!isInit) {
client.ev.off('messages.upsert', client.handler)
client.ev.off('group-participants.update', client.participantsUpdate)
client.ev.off('connection.update', client.connectionUpdate)
client.ev.off('creds.update', client.credsUpdate)    
}

client.welcome = 'Welcome @user To Group @subject'
client.bye = '@user Leaving Group @subject :('
client.spromote = '@user sekarang admin!'
client.sdemote = '@user sekarang bukan admin!'
client.handler = handler.handler.bind(client)  
client.handler = handler.handler.bind(client)
client.connectionUpdate = connectionUpdate.bind(client)
client.credsUpdate = saveState.bind(client)
client.participantsUpdate = handler.participantsUpdate.bind(client)

client.ev.on('messages.upsert', client.handler)  
client.ev.on('connection.update', client.connectionUpdate)
client.ev.on('creds.update', client.credsUpdate)
client.ev.on('group-participants.update', client.participantsUpdate)
isInit = false
return true
}

global.reloadFile = (file, options = {}) => {
nocache(file, module => {
console.log(chalk.keyword('yellow')(`File "${file}" telah diupdate, me-restart bot.`))
process.send("reset")
})
}
function nocache(module, cb = () => {}) {
fs.watchFile(require.resolve(module), async () => {
await uncache(require.resolve(module))
cb(module)
})
}

function uncache(module = '.') {
return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(module)]
resolve()
} catch (e) {
reject(e)
}
})
} // Credits By Hyzer Official, Don't Delete this
global.plugins = {} 
let pluginFolder = path.join(__dirname, "./plugins")
let fitur = fs.readdirSync(pluginFolder)
fitur.forEach(async (res) => {
const hijer = fs.readdirSync(`${pluginFolder}/${res}`).filter((file) => file.endsWith(".js"))
for (let filename of hijer ) {
try {
global.plugins[filename] = require(`${pluginFolder}/${res}/${filename}`)
require("delay")(100)
global.reloadFile(`./plugins/${res}/${filename}`)
} catch (e) {
client.logger.error(e)
delete global.plugins[filename]
}
}
})

global.reloadHandler()

// Quick Test
async function _quickTest() {
let test = await Promise.all([
cp.spawn('ffmpeg'),
cp.spawn('ffprobe'),
cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
cp.spawn('convert'),
cp.spawn('magick'),
cp.spawn('gm'),
cp.spawn('find', ['--version'])
].map(p => {
return Promise.race([
new Promise(resolve => {
p.on('close', code => {
resolve(code !== 127)
})
}),
new Promise(resolve => {
p.on('error', _ => resolve(false))
})
])
}))
let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
//console.log(test)
let s = global.support = {
ffmpeg,
ffprobe,
ffmpegWebp,
convert,
magick,
gm,
find
}
Object.freeze(global.support)

if (!s.ffmpeg) client.logger.warn('🚩 Please install ffmpeg for sending videos (pkg install ffmpeg)')
if (s.ffmpeg && !s.ffmpegWebp) client.logger.warn('🚩 Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
if (!s.convert && !s.magick && !s.gm) client.logger.warn('🚩 Stickers may not work without imagemagick if libwebp on ffmpeg doesnt installed (pkg install imagemagick)')
}

_quickTest()

process.on('uncaughtException', console.error); //Safe Log Error
