import config
import discord
import discord_helper
import logger

log = logger.Logger()
client = discord.Client()
discord_helper = discord_helper.DiscordHelper(client)

@client.event
async def on_ready():
    try:
        log.i(f'{client.user} is connected to Discord!')
        await discord_helper.send_reddit_submissions_to_discord()
    except expression as ex:
        log.e("An error occured while connecting to Discord.", ex)
    finally:
        await client.logout()

client.run(config.discord_token)