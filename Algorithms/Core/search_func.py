import aiohttp
from urllib.parse import unquote
import xml.etree.ElementTree as ET
from Algorithms.Core.easy_parser import my_parser
from Algorithms.Core import config


async def search(query: str) -> str:
    print(f"Search query: {query}")

    url = config.YNDX_SEARCH_URL
    params = {'folderid': config.YNDX_API_FOLDER_ID, 'apikey': config.YNDX_TOKEN, 'query': query}

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as r:
            print(f"API response status: {r.status}")
            text = await r.text()

            if r.status != 200:
                return f'Error, could not get search results. Status: {r.status}, Content: {text}'

            try:
                root = ET.fromstring(text)
            except ET.ParseError as e:
                return f'Error, could not parse search results. Content: {text}, Error: {str(e)}'

            reply = ''
            results = root.findall(".//results/grouping/group/doc")
            print(f"Found results.")
            for result in results:
                if len(reply) >= 800:
                    reply += '... [Message truncated due to length.]'
                    break

                title_element = result.find("title")
                url_element = result.find("url")
                if title_element is not None and url_element is not None:
                    search_url = url_element.text
                    search_url_unquoted = unquote(search_url)
                    print(f"Parsing URL: {search_url_unquoted}")
                    parsed_sentences = await my_parser(search_url_unquoted, query.split())
                    print(f"Parsed sentences: {parsed_sentences}")

                    if len(reply) + len(''.join(parsed_sentences)) > config.MAX_REPLY_LENGTH:
                        reply += '... [Message truncated due to length.]'
                        break
                    reply += ''.join(parsed_sentences)

            if not reply:
                print("No results found after parsing.")
                reply = 'no results'

            print(f"Final reply: {reply}")
            return parsed_sentences

