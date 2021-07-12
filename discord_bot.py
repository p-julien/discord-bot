import config
import logger
import discord
import requests
import discord_helper
from discord.ext import tasks, commands
from datetime import datetime

logger = logger.Logger()
client = commands.Bot(command_prefix='$')
discord_helper = discord_helper.DiscordHelper(client)

@client.event
async def on_ready():
    logger.i(f'✔️ {client.user} is connected to Discord!')
    if config.is_debug: 
        await discord_helper.send_reddit_submissions_to_discord()
        return

    reddit_submissions_task.start()
    reset_log_filename.start()

@client.event
async def on_command_error(context, exception):
    logger.e("❌ An error occured while restarting the submissions command to Discord.", exception)
    await context.send(str(exception))

@client.command()
async def ping(ctx):
    latency = round(client.latency * 1000)
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    logger.i(f'ℹ️ {author} ask for latency: {latency}ms')
    title = f'Latency : {latency}ms'
    embed = discord.Embed(title=title, color=0xe6742b)
    await ctx.send(embed=embed)

@client.command()
async def log(ctx):
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    logger.i(f'ℹ️ {author} ask for log file.')
    await ctx.send(file=discord.File(logger.filename))

@client.command()
@commands.cooldown(1, 30)
async def restart(ctx):
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    logger.i(f'ℹ️ {author} wants to restart the reddit submissions.')
    await discord_helper.send_reddit_submissions_to_discord()

@client.command()
async def advice(ctx):
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    r = requests.get('https://api.adviceslip.com/advice').json()
    advice = r['slip']['advice']
    logger.i(f'ℹ️ {author} ask for an advice. {advice}')
    embed = discord.Embed(title=advice, color=0xe6742b)
    await ctx.send(embed=embed)

@client.command()
async def doche_location(ctx):
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    r = requests.get('http://codem.tk/ou-suis-je')
    location = r.text.strip()
    logger.i(f'ℹ️ Maxime est à {location} !')
    embed = discord.Embed(title=f'Maxime est à {location} !', color=0xe6742b)
    await ctx.send(embed=embed)

@client.command()
@commands.cooldown(5, 30)
async def pull(ctx):
    author = f'{ctx.author.name}#{ctx.author.discriminator}'
    logger.i(f'ℹ️ {author} ask for a pull on channel {ctx.channel.name}')
    await discord_helper.send_reddit_submissions_to_discord_channel(ctx.channel)

@tasks.loop(minutes=1)
async def reddit_submissions_task():
    now = datetime.now()
    if not (now.hour == 20 and now.minute == 0): return
    await discord_helper.send_reddit_submissions_to_discord()

@tasks.loop(hours=10)
async def reset_log_filename():
    logger = logger.Logger()

client.run(config.discord_token)