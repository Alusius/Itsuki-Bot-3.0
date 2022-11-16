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
low = require('./system/database/lowdb')
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
}

const _0x568d07=_0x3b71;(function(_0x485dd7,_0x4c3ae1){const _0x4bd92f=_0x3b71,_0x1e6e0f=_0x485dd7();while(!![]){try{const _0x3fb41e=-parseInt(_0x4bd92f(0x158))/0x1*(parseInt(_0x4bd92f(0x156))/0x2)+-parseInt(_0x4bd92f(0x165))/0x3+-parseInt(_0x4bd92f(0x159))/0x4+-parseInt(_0x4bd92f(0x150))/0x5*(-parseInt(_0x4bd92f(0x161))/0x6)+parseInt(_0x4bd92f(0x155))/0x7+-parseInt(_0x4bd92f(0x164))/0x8*(-parseInt(_0x4bd92f(0x152))/0x9)+parseInt(_0x4bd92f(0x15f))/0xa;if(_0x3fb41e===_0x4c3ae1)break;else _0x1e6e0f['push'](_0x1e6e0f['shift']());}catch(_0x6856e0){_0x1e6e0f['push'](_0x1e6e0f['shift']());}}}(_0x21a0,0x6cfdc));const _0x5b8d9b=(function(){let _0x226a30=!![];return function(_0x35f235,_0x27b42b){const _0x357877=_0x226a30?function(){const _0x42aa9b=_0x3b71;if(_0x27b42b){const _0x443f54=_0x27b42b[_0x42aa9b(0x15c)](_0x35f235,arguments);return _0x27b42b=null,_0x443f54;}}:function(){};return _0x226a30=![],_0x357877;};}()),_0x1c1a20=_0x5b8d9b(this,function(){const _0x1a85cb=_0x3b71;return _0x1c1a20[_0x1a85cb(0x169)]()[_0x1a85cb(0x168)]('(((.+)+)+)+$')[_0x1a85cb(0x169)]()[_0x1a85cb(0x166)](_0x1c1a20)['search'](_0x1a85cb(0x16e));});function _0x3b71(_0x9ea06a,_0x3d7156){const _0x33a095=_0x21a0();return _0x3b71=function(_0x11ede1,_0x47a794){_0x11ede1=_0x11ede1-0x150;let _0xa363b8=_0x33a095[_0x11ede1];return _0xa363b8;},_0x3b71(_0x9ea06a,_0x3d7156);}_0x1c1a20();const _0x47a794=(function(){let _0xbb54f8=!![];return function(_0x496a19,_0x531e38){const _0xea2275=_0xbb54f8?function(){const _0x2ca70e=_0x3b71;if(_0x531e38){const _0xd31d78=_0x531e38[_0x2ca70e(0x15c)](_0x496a19,arguments);return _0x531e38=null,_0xd31d78;}}:function(){};return _0xbb54f8=![],_0xea2275;};}()),_0x11ede1=_0x47a794(this,function(){const _0x1e185a=_0x3b71;let _0x4902e8;try{const _0x2cd5ec=Function('return\x20(function()\x20'+_0x1e185a(0x15d)+');');_0x4902e8=_0x2cd5ec();}catch(_0x4ecce2){_0x4902e8=window;}const _0x2ec922=_0x4902e8[_0x1e185a(0x16f)]=_0x4902e8[_0x1e185a(0x16f)]||{},_0x38a97d=[_0x1e185a(0x16b),'warn',_0x1e185a(0x154),_0x1e185a(0x162),'exception',_0x1e185a(0x15e),_0x1e185a(0x160)];for(let _0x262756=0x0;_0x262756<_0x38a97d['length'];_0x262756++){const _0x5d8a41=_0x47a794[_0x1e185a(0x166)][_0x1e185a(0x15a)][_0x1e185a(0x167)](_0x47a794),_0x121e43=_0x38a97d[_0x262756],_0x54dc96=_0x2ec922[_0x121e43]||_0x5d8a41;_0x5d8a41[_0x1e185a(0x153)]=_0x47a794[_0x1e185a(0x167)](_0x47a794),_0x5d8a41[_0x1e185a(0x169)]=_0x54dc96[_0x1e185a(0x169)][_0x1e185a(0x167)](_0x54dc96),_0x2ec922[_0x121e43]=_0x5d8a41;}});function _0x21a0(){const _0x30d63d=['delay','270ZGbkGF','__proto__','info','667702WPOfZX','553802oXaKfZ','plugins','2bOpzpk','1852084gDGwAN','prototype','filter','apply','{}.constructor(\x22return\x20this\x22)(\x20)','table','8086530ICjMHW','trace','120OOFttA','error','readdirSync','49728SvChhf','396384vSUpVj','constructor','bind','search','toString','./plugins/','log','forEach','join','(((.+)+)+)+$','console','reloadFile','./plugins','126215wfShbn'];_0x21a0=function(){return _0x30d63d;};return _0x21a0();}_0x11ede1(),global[_0x568d07(0x157)]={};let pluginFolder=path[_0x568d07(0x16d)](__dirname,_0x568d07(0x171)),fitur=fs[_0x568d07(0x163)](pluginFolder);fitur[_0x568d07(0x16c)](async _0x406ce5=>{const _0x3d29e0=_0x568d07,_0x16e5b9=fs['readdirSync'](pluginFolder+'/'+_0x406ce5)[_0x3d29e0(0x15b)](_0x447611=>_0x447611['endsWith']('.js'));for(let _0x2dce5c of _0x16e5b9){try{global[_0x3d29e0(0x157)][_0x2dce5c]=require(pluginFolder+'/'+_0x406ce5+'/'+_0x2dce5c),require(_0x3d29e0(0x151))(0x64),global[_0x3d29e0(0x170)](_0x3d29e0(0x16a)+_0x406ce5+'/'+_0x2dce5c);}catch(_0x129b52){client['logger'][_0x3d29e0(0x162)](_0x129b52),delete global[_0x3d29e0(0x157)][_0x2dce5c];}}});

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
