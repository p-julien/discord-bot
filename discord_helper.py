import config
import logger
import discord
import reddit_helper
import burger_express
import decode_url
import requests
import random
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
        self.log.i(f"🖼️ Attachment: {submission.title}")

        filename = f"{submission}.{mime_type[1]}" if not submission.over_18 else f"SPOILER_{submission}.{mime_type[1]}"
        if discord_channel.name == "nsfw": filename = f"{submission}.{mime_type[1]}"
        filepath = os.path.join("temp", filename)

        fo = open(filepath, 'wb')
        fo.write(requests.get(submission.url, allow_redirects=True).content)
        fo.close()

        if config.is_debug: return

        submission_file = discord.File(filepath, filename)
        await discord_channel.send(content=content, file=submission_file)

    async def send_as_message_on_discord_channel(self, discord_channel, submission, content):
        content = f"{content}\n{submission.url}"
        self.log.i(f"📝 Message: {submission.title}")

        if config.is_debug: return
        await discord_channel.send(content)

    def is_attachment(self, submission, mime_type):
        return mime_type[0] == "image" and int(self.decode_url.get_file_size_from_url(submission.url)) < 8000000

    async def send_reddit_submission_on_discord_channel(self, discord_channel, submission):
        try:
            content = f"**{submission.title}**" if not submission.over_18 else f"🔞 **{submission.title}** 🔞"

            if discord_channel.name == "nsfw": content = f"**{submission.title}**"
            submission_url_mime_type = self.decode_url.get_mime_type_from_url(submission.url).split("/") 

            if "first time" in content.lower():
                insulte_index = random.randint(0,2)
                insultes = ["Fils de pute", "Ta mère la pute !", "Ta salope de mère"]
                content = f"[*{insultes[insulte_index]}*] {content}"

            if self.is_attachment(submission, submission_url_mime_type):
                await self.send_as_attachment_on_discord_channel(discord_channel, submission, submission_url_mime_type, content)
            else:
                await self.send_as_message_on_discord_channel(discord_channel, submission, content)

        except Exception as ex:
            self.log.e(f"❌ An error occured while sending submission:{submission} to Discord.", ex)

    async def send_reddit_submissions_to_discord(self):
        try:
            self.log.i("✔️ Start sending submissions on Discord!")
            if not os.path.isdir('temp'): os.mkdir("temp")
                
            for discord_channel in self.client.get_all_channels():
                if not self.burger_express.is_sub_reddit_correspondence(discord_channel.name): continue
                await self.send_reddit_submissions_to_discord_channel(discord_channel)

            shutil.rmtree("temp")
            self.log.i("✔️ End of submissions sending!")
        except Exception as ex:
            self.log.e("❌ An error occured while sending submissions to Discord.", ex)

    async def send_reddit_submissions_to_discord_channel(self, discord_channel):
        try:
            if not self.burger_express.is_sub_reddit_correspondence(discord_channel.name): return
            if not os.path.isdir('temp'): os.mkdir("temp")

            sub_reddit = self.burger_express.get_sub_reddit_name_by_channel_discord(discord_channel.name) 
            
            self.log.i(f"ℹ️ Posts from {sub_reddit} in channel {discord_channel.name}:")
            for submission in self.reddit_helper.get_posts_by_sub_reddit(sub_reddit):
                await self.send_reddit_submission_on_discord_channel(discord_channel, submission)

        except Exception as ex:
            self.log.e(f"❌ An error occured while sending submissions to Discord channel {discord_channel.name}.", ex)
