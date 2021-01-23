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
        logging.info(f'[{time.strftime(self.date_format)}] {message}')
        print(message)

    def e(self, error, exception):
        logging.error(f'[{time.strftime(self.date_format)}] {error} : {exception}')
        print(f'{error} : {exception}')
