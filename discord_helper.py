import discord
import config
import logger
import reddit_helper
import burger_express
import decode_url
import requests
import shutil
import os

class DiscordHelper: 

    log = logger.Logger()
    burger_express = burger_express.BurgerExpress()
    reddit_helper = reddit_helper.RedditHelper()
    decode_url = decode_url.DecodeUrl()

    def __init__(self, client):
        self.client = client

    async def send_as_attachment_on_discord_channel(self, discord_channel, submission, mime_type, content):
        self.log.i(f"Attachment: {content}")

        filename = f"{submission}.{mime_type[1]}" if not submission.over_18 else f"SPOILER_{submission}.{mime_type[1]}"
        filepath = os.path.join("temp", filename)

        fo = open(filepath, 'wb')
        fo.write(requests.get(submission.url, allow_redirects=True).content)
        submission_file = discord.File(filepath, filename)
        fo.close()

        if config.is_debug: return
        await discord_channel.send(content=content, file=submission_file)

    async def send_as_message_on_discord_channel(self, discord_channel, submission, content):
        content = f"{content}\n{submission.url}"
        self.log.i(f"Message: {content}")

        if config.is_debug: return
        await discord_channel.send(content)

    async def send_reddit_submission_on_discord_channel(self, discord_channel, submission):
        content = f"**{submission.title}**" if not submission.over_18 else f"🔞 **{submission.title}** 🔞"
        submission_url_mime_type = self.decode_url.get_mime_type_from_url(submission.url).split("/")

        if (submission_url_mime_type[0] == "image" and int(self.decode_url.get_file_size_from_url(submission.url)) < 8000000):
            await self.send_as_attachment_on_discord_channel(discord_channel, submission, submission_url_mime_type, content)
        else:
            await self.send_as_message_on_discord_channel(discord_channel, submission, content)


    async def send_reddit_submissions_to_discord(self):
        try:
            self.log.i("Start sending submissions on Discord!")
            if not os.path.isdir('temp'): os.mkdir("temp")
                
            for discord_channel in self.client.get_all_channels():

                if not self.burger_express.is_sub_reddit_correspondence(discord_channel.name): continue
                sub_reddit = self.burger_express.get_sub_reddit_name_by_channel_discord(discord_channel.name)

                self.log.i(f"Posts from {sub_reddit} in channel {discord_channel.name}:")
                for submission in self.reddit_helper.get_posts_by_sub_reddit(sub_reddit):
                    await self.send_reddit_submission_on_discord_channel(discord_channel, submission)

            shutil.rmtree("temp")
            self.log.i("End of submissions sending!")
        except expression as ex:
            self.log.e("An error occured while sending submissions to Discord.", ex)
