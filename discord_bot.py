import config
import discord
import reddit
import logger
import requests
import shutil
import os

log = logger.Logger()
client = discord.Client()
discord_channels_sub_reddits = [
    ['art', 'Art'],
    ['aww', 'aww'],
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


def get_mime_type_from_url(url):
    try:
        return requests.Session().head(url, allow_redirects=True).headers['content-type']
    except Exception:
        return "application/octet-stream"


def get_file_size_from_url(url):
    try:
        return requests.Session().head(url, allow_redirects=True).headers['content-length']
    except Exception:
        return 9999999


def is_sub_reddit_correspondence(discord_channel_name):
    for element in discord_channels_sub_reddits:
        if (element[0] == discord_channel_name):
            return True
    return False


def get_sub_reddit_name_by_channel_discord(discord_channel_name):
    for element in discord_channels_sub_reddits:
        if (element[0] == discord_channel_name):
            return element[1]


async def send_submission_on_discord_channel(discord_channel, submission):
    content = f"**{submission.title}**\n" if not submission.over_18 else f"🔞 **{submission.title}** 🔞\n"
    submission_url_mime_type = get_mime_type_from_url(
        submission.url).split("/")

    if (submission_url_mime_type[0] == "image" and int(get_file_size_from_url(submission.url)) < 8000000):
        await send_as_attachment_on_discord_channel(discord_channel, submission, submission_url_mime_type, content)
    else:
        await send_as_message_on_discord_channel(discord_channel, submission, content)


async def send_as_attachment_on_discord_channel(discord_channel, submission, mime_type, content):
    log.i(f"En tant que pièce jointe : {content}")

    filename = f"{submission}.{mime_type[1]}" if not submission.over_18 else f"SPOILER_{submission}.{mime_type[1]}"
    filepath = os.path.join("temp", filename)

    fo = open(filepath, 'wb')
    fo.write(requests.get(submission.url, allow_redirects=True).content)
    submission_file = discord.File(filepath, filename)
    await discord_channel.send(content=content, file=submission_file)
    fo.close()


async def send_as_message_on_discord_channel(discord_channel, submission, content):
    content = f"{content}{submission.url}"
    log.i(f"En tant que message : {content}")
    await discord_channel.send(content)


@client.event
async def on_ready():
    try:
        if (not os.path.isdir('temp')):
            os.mkdir("temp")

        log.i(f'{client.user} est connecté à Discord !\n')

        reddit_helper = reddit.RedditHelper()
        discord_channels = client.get_all_channels()

        for discord_channel in discord_channels:

            if (is_sub_reddit_correspondence(discord_channel.name)):
                sub_reddit = get_sub_reddit_name_by_channel_discord(
                    discord_channel.name)
                log.i(
                    f"Posts du sub_reddit {sub_reddit} dans le channel {discord_channel.name}")

                submissions = reddit_helper.get_posts_by_sub_reddit(sub_reddit)
                for submission in submissions:
                    await send_submission_on_discord_channel(discord_channel, submission)

        log.i("Fin de l'envoi des posts")
        await client.logout()
    except Exception:
        log.e("Une erreur est survenue lors de la publication des posts sur le discord.")

client.run(config.discord_token)
