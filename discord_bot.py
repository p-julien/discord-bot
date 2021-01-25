import config
import logger
import discord
import discord_helper
from discord.ext import tasks, commands
from datetime import datetime

log = logger.Logger()
client = commands.Bot(command_prefix='$')
discord_helper = discord_helper.DiscordHelper(client)

@client.event
async def on_ready():
    log.i(f'{client.user} is connected to Discord!')
    if config.is_debug: await discord_helper.send_reddit_submissions_to_discord()
    else: reddit_submissions_task.start()

@client.command()
async def ping(ctx):
    latency = round(client.latency * 1000)
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    ping = f'Ping : {latency}ms.'
    log.i(f'{author} ask for latency. {ping}')
    await ctx.send(ping)

@client.command(aliases=['log'])
async def get_log(ctx):
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    log.i(f'{author} ask for log file.')
    await ctx.send(file=discord.File(log.filename))

@tasks.loop(minutes=1)
async def reddit_submissions_task():
    now = datetime.now()
    if not (now.hour == 20 and now.minute == 0): return
    await discord_helper.send_reddit_submissions_to_discord()

client.run(config.discord_token)