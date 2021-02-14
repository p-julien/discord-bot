class BurgerExpress:

    discord_channels_sub_reddits = [
        ['art', 'Art'],
        ['ffxiv', 'ffxiv'],
        ['aww', 'aww'],
        ['mbti', 'mbti'],
        ['food', 'FoodPorn'],
        ['manga', 'manga'],
        ['beat-saber', 'beatsaber'],
        ['architecture', 'ArchitecturePorn'],
        ['battlestations', 'battlestations'],
        ['rocket-league', 'RocketLeague'],
        ['genshin-impact', 'Genshin_Impact'],
        ['oddly-satisfying', 'oddlysatisfying'],
        ['programmer-humor', 'ProgrammerHumor'],
        ['mechanical-keyboards', 'MechanicalKeyboards']
    ]
    
    def is_sub_reddit_correspondence(self, discord_channel_name):
        for element in self.discord_channels_sub_reddits:
            if (element[0] == discord_channel_name):
                return True
        return False


    def get_sub_reddit_name_by_channel_discord(self, discord_channel_name):
        for element in self.discord_channels_sub_reddits:
            if (element[0] == discord_channel_name):
                return element[1]
