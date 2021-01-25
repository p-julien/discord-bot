import os
import time
import config
import logging

class Logger:
    filename=config.log_filepath
    date_format='%Y-%m-%d %H:%M:%S'

    def __init__(self): 
        logging.FileHandler(filename=self.filename, mode="w", encoding=None, delay=False)
        logging.basicConfig(filename=self.filename, level=logging.INFO)

    def i(self, message=''):
        logging.info(f'[{time.strftime(self.date_format)}] {message}')
        print(message)

    def e(self, error, exception):
        logging.error(f'[{time.strftime(self.date_format)}] {error} : {exception}')
        print(f'{error} : {exception}')
