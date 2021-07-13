class BurgerExpress:

    discord_channels_sub_reddits = [
        ['art', 'Art'],
        ['ffxiv', 'ffxiv'],
        ['aww', 'aww'],
        ['mbti', 'mbti'],
        ['food', 'FoodPorn'],
        ['manga', 'manga'],
        ['surprise', 'popular'],
        ['pokemon', 'pokemon'],
        ['beat-saber', 'beatsaber'],
        ['trackmania', 'TrackMania'],
        ['windows-11', 'Windows11'],
        ['architecture', 'ArchitecturePorn'],
        ['battlestations', 'battlestations'],
        ['rocket-league', 'RocketLeague'],
        ['genshin-impact', 'Genshin_Impact'],
        ['oddly-satisfying', 'oddlysatisfying'],
        ['genshin-memepact', 'Genshin_Memepact'],
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
            
            if (element[0] == discord_channel_name and isinstance(element[1], list)):
                multi_sub_reddit = ""
                for sub_reddit in element[1]:
                    multi_sub_reddit += sub_reddit + "+"
                return multi_sub_reddit[:-1]
            
            if (element[0] == discord_channel_name):
                return element[1]
