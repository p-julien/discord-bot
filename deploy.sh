#!/bin/bash

git pull
sudo npm install
sudo /etc/init.d/supervisor restart
cat /var/log/discord_bot.log
