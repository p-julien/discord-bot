import config
import discord
import reddit
import logger

log = logger.Logger()
client = discord.Client()
discord_channels_sub_reddits = [
    ['art', 'Art'],
    ['cats', 'cats'],
    ['mbti', 'mbti'],
    ['food', 'Food'],
    ['manga', 'manga'],
    ['trackmania', 'TrackMania'],
    ['battlestations', 'battlestations'],
    ['rocket-league', 'RocketLeague'],
    ['genshin-impact', 'Genshin_Impact'],
    ['programmer-humor', 'ProgrammerHumor'],
    ['mechanical-keyboards', 'MechanicalKeyboards']
]

def is_sub_reddit_correspondence(discord_channel_name):
    for element in discord_channels_sub_reddits:
        if (element[0] == discord_channel_name): return True
    return False

def get_sub_reddit_name_by_channel_discord(discord_channel_name):
    for element in discord_channels_sub_reddits:
        if (element[0] == discord_channel_name): 
            return element[1]

@client.event
async def on_ready():
    try:
        log.i(f'{client.user} est connecté à Discord !\n')

        reddit_helper = reddit.RedditHelper()
        discord_channels = client.get_all_channels()

        for discord_channel in discord_channels:

            if (is_sub_reddit_correspondence(discord_channel.name)):
                sub_reddit = get_sub_reddit_name_by_channel_discord(discord_channel.name)
                log.i(f"Posts du sub_reddit {sub_reddit} dans le channel {discord_channel.name}")

                submissions = reddit_helper.get_posts_by_sub_reddit(sub_reddit)
                for submission in submissions:
                    message = f"**{submission.title}**\n{submission.url}" if not submission.over_18 else f"🔞 **{submission.title}** 🔞\n||{submission.url}||"
                    log.i(message)

                    await discord_channel.send(message)

                log.i()

        log.i("Fin de l'envoi des posts")

        await client.logout()
        await client.close()
    except:
        log.e("Une erreur est survenue lors de la publication des posts sur le discord.")

client.run(config.discord_token)