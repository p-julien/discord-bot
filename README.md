
# Reddit Discord Bot

Reddit Discord Bot is a Python library for retrieving and sending the best Reddit posts of the week on Discord.

## Useful links

Install Python : 
- https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-programming-environment-on-an-ubuntu-20-04-server-fr

Use the Reddit API : 
- https://praw.readthedocs.io/en/latest/getting_started/quick_start.html
- https://github.com/reddit-archive/reddit/wiki

Create a Discord Bot : 
- https://realpython.com/how-to-make-a-discord-bot-python/
- https://www.youtube.com/watch?v=rAMtjPTcyc8

Create a cron task in Google Cloud Server : 
- https://www.youtube.com/watch?v=5OL7fu2R4M8
- https://crontab.guru/ (0 22 * * SUN)
- https://console.cloud.google.com/home/dashboard?project=redditdiscordbot

## Configuration file format

```python
username = "REDDIT_USERNAME"
password = "REDDIT_PASSWORD"
client_id = "REDDIT_CLIENT_APP_ID"
client_secret = "REDDIT_CLIENT_APP_SECRET"
user_agent = "REDDIT_USER_AGENT"
discord_token = "DISCORD_TOKEN"
```