class BurgerExpress:

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

    
    def is_sub_reddit_correspondence(discord_channel_name):
        for element in discord_channels_sub_reddits:
            if (element[0] == discord_channel_name):
                return True
        return False


    def get_sub_reddit_name_by_channel_discord(discord_channel_name):
        for element in discord_channels_sub_reddits:
            if (element[0] == discord_channel_name):
                return element[1]
