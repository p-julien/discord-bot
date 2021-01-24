import config
import discord
from discord.ext import tasks
from datetime import datetime
import discord_helper
import logger

log = logger.Logger()
client = discord.Client()
discord_helper = discord_helper.DiscordHelper(client)

@client.event
async def on_ready():
    log.i(f'{client.user} is connected to Discord!')

    if config.is_debug: 
        await discord_helper.send_reddit_submissions_to_discord()
        await client.close()
    else: reddit_submissions_task.start()

@tasks.loop(minutes=1)
async def reddit_submissions_task():
    now = datetime.now()
    if not (now.hour == 20 and now.minute == 0): return
    await discord_helper.send_reddit_submissions_to_discord()

client.run(config.discord_token)