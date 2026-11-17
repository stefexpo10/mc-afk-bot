// Bot Minecraft (Mineflayer) cu reconectare automata si anti-idle.
const mineflayer = require('mineflayer')

const CONFIG = {
  host: process.env.MC_HOST || 'localhost',
  port: parseInt(process.env.MC_PORT || '25565', 10),
  username: process.env.MC_USERNAME || 'BotAFK',
  auth: process.env.MC_AUTH || 'offline', // 'offline' sau 'microsoft'
  version: process.env.MC_VERSION || undefined, // ex: 1.21.11 (gol = auto)
  reconnectDelay: parseInt(process.env.MC_RECONNECT_MS || '10000', 10),
  moveInterval: parseInt(process.env.MC_MOVE_MS || '30000', 10)
}

function startBot () {
  console.log(`Conectez la ${CONFIG.host}:${CONFIG.port} ca ${CONFIG.username}...`)
  const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    auth: CONFIG.auth,
    version: CONFIG.version
  })

  let moveTimer

  bot.once('spawn', () => {
    console.log('Bot conectat')
    moveTimer = setInterval(() => {
      bot.look(Math.random() * Math.PI * 2, 0)
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 300)
    }, CONFIG.moveInterval)
  })

  bot.on('end', (reason) => {
    console.log('Deconectat:', reason, '- reconectez in', CONFIG.reconnectDelay, 'ms')
    clearInterval(moveTimer)
    setTimeout(startBot, CONFIG.reconnectDelay)
  })

  bot.on('kicked', (reason) => console.log('Kick:', reason))
  bot.on('error', (err) => console.log('Eroare:', err.message))
}

startBot()
