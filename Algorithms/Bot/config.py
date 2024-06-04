from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '../Core/.env')
load_dotenv(dotenv_path)

YNDX_SEARCH_URL = 'https://yandex.ru/search/xml?'
MAX_REPLY_LENGTH = 4096
DAISY_URL = 'https://api.neuraldeep.tech/chatgpt'
BOT_TOKEN = os.getenv('BOT_TOKEN')