import aiohttp
from urllib.parse import unquote
import xml.etree.ElementTree as ET
from Algorithms.Core.neural_parser import neural_parser
from Algorithms.Core import config
from Algorithms.Core.neural_deep import send_message_to_neural_deep_tech


async def neural_deep_search(query: str) -> str:
    print(f"Search query: {query}")

    url = config.YNDX_SEARCH_URL
    params = {'folderid': config.YNDX_API_FOLDER_ID, 'apikey': config.YNDX_TOKEN, 'query': query}

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            print(f"API response status: {response.status}")
            text = await response.text()

            if response.status != 200:
                return f'Error, could not get search results. Status: {response.status}, content: {text}'

            try:
                root = ET.fromstring(text)
            except ET.ParseError:
                return f'Error, could not parse search results. Content: {text}'

            reply = ''
            for result in root.findall(".//results/grouping/group/doc"):
                if len(reply) + len('... [Message truncated due to length.]') >= config.MAX_REPLY_LENGTH:
                    break

                title_element = result.find("title")
                if title_element is not None:
                    search_url = result.find("url").text
                    search_url_unquoted = unquote(search_url)
                    parsed_sentences = await neural_parser(search_url_unquoted, query.split())

                    if len(reply) + len(''.join(parsed_sentences)) > config.MAX_REPLY_LENGTH - len('... [Message truncated due to length.]'):
                        reply += '... [Message truncated due to length.]'
                        break

                    reply += ''.join(parsed_sentences)

            if not reply:
                print(f"Reply before neuraldeep: 'No results found.'")
                return "К сожалению, мне не удалось найти ничего интересного"

            print('search')

            neural_deep_reply = await send_message_to_neural_deep_tech(reply[:config.MAX_REPLY_LENGTH])

            return neural_deep_reply
