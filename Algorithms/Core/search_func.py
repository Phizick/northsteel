import aiohttp
from urllib.parse import unquote
import xml.etree.ElementTree as ET
from easy_parser import my_parser
import config


async def search(query: str) -> str:
    print(f"Search query: {query}")

    url = config.YNDX_SEARCH_URL
    params = {'folderid': config.YNDX_API_FOLDER_ID, 'apikey': config.YNDX_TOKEN, 'query': query}

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as r:
            print(f"API response status: {r.status}")
            text = await r.text()

            if r.status != 200:
                return f'Error, could not get search results. Status: {r.status}, content: {text}'

            try:
                root = ET.fromstring(text)
            except ET.ParseError as e:
                return f'Error, could not parse search results. Content: {text}'

            reply = ''
            for result in root.findall(".//results/grouping/group/doc"):
                if len(reply) >= config.MAX_REPLY_LENGTH:
                    reply += '... [Message truncated due to length.]'
                    break

                title_element = result.find("title")
                if title_element is not None:
                    search_url = result.find("url").text
                    search_url_unquoted = unquote(search_url)
                    parsed_sentences = await my_parser(search_url_unquoted, query.split())

                    if len(reply) + len(''.join(parsed_sentences)) > config.MAX_REPLY_LENGTH:
                        reply += '... [Message truncated due to length.]'
                        break
                    reply += ''.join(parsed_sentences)

            if not reply:
                reply = 'no results'

            print(f"Reply: {reply}")
            print('search')

            return reply[:config.MAX_REPLY_LENGTH]

