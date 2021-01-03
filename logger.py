import logging

class Logger:
    def __init__(self):
        logging.basicConfig(filename='discord.log', level=logging.INFO)
 
    def i(self, message=''):
        logging.info(message)

    def e(self, error):
        logging.error(error)
