from dotenv import load_dotenv
import os

load_dotenv()

YNDX_SEARCH_URL = 'https://yandex.ru/search/xml?'
MAX_REPLY_LENGTH = 4096
DAISY_URL = 'https://api.neuraldeep.tech/chatgpt'
DAISY_TOKEN = os.getenv('DAISY_TOKEN')
YNDX_TOKEN = os.getenv('YNDX_TOKEN')
YNDX_API_FOLDER_ID = os.getenv('YNDX_API_FOLDER_ID')