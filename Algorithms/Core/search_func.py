import aiohttp
from urllib.parse import unquote
import xml.etree.ElementTree as ET
from Algorithms.Core.easy_parser import easy_parser
from Algorithms.Core import config


# функция поиска, принимает на вход строку и находит в интернете ресурсы,
# удовлетворяющие критериям. затем вызывает на них парсер
# ранжируя ограничение длины сообщения в config можно изменить длину выводящегося сообщения из найденой информации
async def search(query: str, keywords, count) -> dict:
    print(f"Search query: {query}")

    url = config.YNDX_SEARCH_URL
    params = {'folderid': config.YNDX_API_FOLDER_ID, 'apikey': config.YNDX_TOKEN, 'query': query}

    links = []
    reply = ''

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, params=params) as r:
                print(f"API response status: {r.status}")
                text = await r.text()

                if r.status != 200:
                    return {'error': f'Error, could not get search results. Status: {r.status}, Content: {text}'}

                try:
                    root = ET.fromstring(text)
                except ET.ParseError as e:
                    return {'error': f'Error, could not parse search results. Content: {text}, Error: {str(e)}'}

                results = root.findall(".//results/grouping/group/doc")
                print(f"Found results.")

                for result in results:
                    title_element = result.find("title")
                    url_element = result.find("url")
                    if url_element is not None:
                        search_url = url_element.text
                        search_url_unquoted = unquote(search_url)
                        print(f"Parsing URL: {search_url_unquoted}")
                        try:
                            parsed_sentences = await easy_parser(search_url_unquoted, query.split(), keywords)
                            print(f"Parsed sentences: {parsed_sentences}")
                        except Exception as parse_error:
                            print(f"Error parsing URL {search_url_unquoted}: {str(parse_error)}")
                            continue

                        if title_element is not None:
                            links.append({
                                "title": title_element.text,
                                "url": search_url_unquoted
                            })

                        if len(reply) + len(''.join(parsed_sentences)) > count:
                            reply += '... [Message truncated due to length.]'
                            break

                        reply += ''.join(parsed_sentences)

        except aiohttp.ClientConnectorCertificateError as e:
            print(f"SSL Certificate error for URL {url}: {str(e)}")

    if not reply:
        print("No results found after parsing.")
        return {'text': 'No results', 'links': links}

    print(f"Final reply: {reply}")
    return {'text': reply, 'links': links}

