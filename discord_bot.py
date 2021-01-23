import config
import discord
import reddit
import logger
import burger_express
import decode_url
import requests
import shutil
import os

log = logger.Logger()
client = discord.Client()
burger_express = burger_express.BurgerExpress()
reddit_helper = reddit.RedditHelper()
decode_url = decode_url.DecodeUrl()

async def send_as_attachment_on_discord_channel(discord_channel, submission, mime_type, content):
    log.i(f"Attachment: {content}")

    filename = f"{submission}.{mime_type[1]}" if not submission.over_18 else f"SPOILER_{submission}.{mime_type[1]}"
    filepath = os.path.join("temp", filename)

    fo = open(filepath, 'wb')
    fo.write(requests.get(submission.url, allow_redirects=True).content)
    submission_file = discord.File(filepath, filename)
    await discord_channel.send(content=content, file=submission_file)
    fo.close()

async def send_as_message_on_discord_channel(discord_channel, submission, content):
    content = f"{content}{submission.url}"
    log.i(f"Message: {content}")
    await discord_channel.send(content)

async def send_reddit_submission_on_discord_channel(discord_channel, submission):
    content = f"**{submission.title}**\n" if not submission.over_18 else f"🔞 **{submission.title}** 🔞\n"
    submission_url_mime_type = decode_url.get_mime_type_from_url(submission.url).split("/")

    if (submission_url_mime_type[0] == "image" and int(decode_url.get_file_size_from_url(submission.url)) < 8000000):
        await send_as_attachment_on_discord_channel(discord_channel, submission, submission_url_mime_type, content)
    else:
        await send_as_message_on_discord_channel(discord_channel, submission, content)


async def send_reddit_submissions_to_discord():
    try:
        log.i("Start sending submissions on Discord!")
        if not os.path.isdir('temp'): os.mkdir("temp")
            
        for discord_channel in client.get_all_channels():

            if not burger_express.is_sub_reddit_correspondence(discord_channel.name): continue
            sub_reddit = burger_express.get_sub_reddit_name_by_channel_discord(discord_channel.name)

            log.i(f"Posts from {sub_reddit} in channel {discord_channel.name}:")
            for submission in reddit_helper.get_posts_by_sub_reddit(sub_reddit):
                await send_reddit_submission_on_discord_channel(discord_channel, submission)

        log.i("End of submissions sending!")
    except expression as ex:
        log.e("An error occured while sending submissions to Discord.", ex)

@client.event
async def on_ready():
    try:
        log.i(f'{client.user} is connected to Discord!\n')
        await send_reddit_submissions_to_discord()
    except expression as ex:
        log.e("An error occured while connecting to Discord.", ex)
    finally:
        await client.logout()
        shutil.rmtree("temp")

client.run(config.discord_token)
