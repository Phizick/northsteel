import aiohttp
import xml.etree.ElementTree as ET
from urllib.parse import unquote
from Algorithms.Core import config
from bs4 import BeautifulSoup


async def find_inn(session, url: str) -> str:
    try:
        async with session.get(url) as response:
            if response.status == 200:
                text = await response.text()
                soup = BeautifulSoup(text, 'html.parser')
                inn_element = soup.find('span', {'id': 'clip_inn'})
                return inn_element.text.strip() if inn_element else None
            else:
                print(f"HTTP Error: {response.status}")
                return None
    except Exception as e:
        print(f"Ошибка при запросе к {url}: {e}")
        return None


async def search_inns(groups_res):
    results = {}

    url = config.YNDX_SEARCH_URL
    params = {
        'folderid': config.YNDX_API_FOLDER_ID,
        'apikey': config.YNDX_TOKEN,
    }

    async with aiohttp.ClientSession() as session:
        for company in groups_res:
            query = f"инн {company}"
            print(f"Search query: {query}")
            params['query'] = query

            async with session.get(url, params=params) as response:
                print(f"API response status: {response.status}")
                if response.status != 200:
                    results[company] = None
                    continue

                text = await response.text()
                root = ET.fromstring(text)

                url_elements = root.findall(".//results/grouping/group/doc/url")
                rusprofile_url = None

                for url_element in url_elements:
                    if "https://www.rusprofile.ru/" in url_element.text:
                        rusprofile_url = unquote(url_element.text)
                        break

                if rusprofile_url:
                    inn = await find_inn(session, rusprofile_url)
                    if inn:
                        results[company] = inn
                    else:
                        results[company] = None
                else:
                    results[company] = None

    print(results)
    return results


