# MC AFK Bot

Bot Minecraft (Mineflayer) care se reconecteaza automat si sare periodic ca sa nu fie dat afara pentru inactivitate.

## Pasul 1: pune proiectul pe GitHub (de pe telefon)
1. Creeaza cont pe github.com, apasa **New repository**, nume `mc-afk-bot`.
2. Apasa **uploading an existing file** si incarca: `bot.js`, `package.json`, `.gitignore`, `.env.example`, `ecosystem.config.js`, `README.md`.
3. Apasa **Commit changes**.

## Pasul 2: VPS gratuit Oracle Cloud
1. Cont pe cloud.oracle.com (cere card pentru verificare).
2. Compute > Instances > Create instance.
3. Imagine: Ubuntu 22.04 sau 24.04. Shape: Ampere (VM.Standard.A1.Flex), pune 2 OCPU si 12 GB RAM (verifica ce iti da gratis contul tau).
4. Adauga cheia SSH, apoi Create. Noteaza IP-ul public.
5. In VCN > Security List > Ingress Rules adauga TCP port **25565** (source 0.0.0.0/0).

## Pasul 3: conecteaza-te si pregateste serverul
```bash
ssh ubuntu@IP_PUBLIC
sudo apt update && sudo apt install -y openjdk-21-jre-headless git screen curl
sudo iptables -I INPUT -p tcp --dport 25565 -j ACCEPT
sudo apt install -y iptables-persistent   # raspunde Yes ca sa salveze regulile
```

## Pasul 4: Paper 1.21.11
```bash
mkdir ~/server && cd ~/server
# Ia link-ul de download pentru 1.21.11 de pe https://papermc.io/downloads/paper
wget -O paper.jar "LINK_DE_PE_PAPERMC"
echo "eula=true" > eula.txt
screen -S mc
java -Xms2G -Xmx8G -jar paper.jar --nogui
```
Iesi din `screen` cu `Ctrl+A` apoi `D`. Reintri cu `screen -r mc`.
Daca vrei ca botul sa intre fara cont Microsoft, in `server.properties` pune `online-mode=false`.

## Pasul 4b: server pornit automat (optional, systemd)
Creeaza `/etc/systemd/system/minecraft.service`:
```ini
[Unit]
Description=Minecraft Paper
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/server
ExecStart=/usr/bin/java -Xms2G -Xmx8G -jar paper.jar --nogui
Restart=always

[Install]
WantedBy=multi-user.target
```
Apoi: `sudo systemctl enable --now minecraft` (nu mai folosi `screen` pentru server in acest caz).

## Pasul 5: botul
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

git clone https://github.com/USER/mc-afk-bot.git
cd mc-afk-bot
npm install
nano ecosystem.config.js     # schimba MC_HOST (localhost daca e pe acelasi VPS)
pm2 start ecosystem.config.js
pm2 save
pm2 startup                  # ruleaza comanda pe care ti-o afiseaza
```

Comenzi utile: `pm2 logs mc-bot`, `pm2 restart mc-bot`, `pm2 stop mc-bot`.

## Probleme frecvente
- **Nu intra pe 1.21.11:** `npm update mineflayer` sau seteaza `MC_VERSION`.
- **Failed to verify username:** serverul e online-mode, pune `online-mode=false` sau `MC_AUTH=microsoft`.
- **Timeout din afara:** verifica portul 25565 in Security List si in iptables.
