import logging
import os
import time

class Logger:
    filename='discord.log'
    date_format='%Y-%m-%d %H:%M'

    def __init__(self):
        if os.path.exists(self.filename): os.remove(self.filename)
        logging.basicConfig(filename=self.filename, level=logging.INFO)
 
    def i(self, message=''):
        message = f'[{time.strftime(self.date_format)}] {message}'
        logging.info(message)
        print(message)

    def e(self, error):
        error = f'[{time.strftime(self.date_format)}] {error}'
        logging.error(error)
        print(error)
