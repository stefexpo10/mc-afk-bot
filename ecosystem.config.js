// pm2 start ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mc-bot',
    script: 'bot.js',
    autorestart: true,
    env: {
      MC_HOST: 'IP_SAU_DOMENIU',
      MC_PORT: '25565',
      MC_USERNAME: 'BotAFK',
      MC_AUTH: 'offline',
      MC_VERSION: '1.21.11'
    }
  }]
}
