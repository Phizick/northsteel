import aiohttp
import xml.etree.ElementTree as ET
from urllib.parse import unquote
from Algorithms.Core import config
from bs4 import BeautifulSoup
import asyncio


def format_description(description: str) -> str:
    parts = description.split('. ')
    formatted_description = '.nn'.join(parts)
    return formatted_description


async def find_company_description(session, url: str) -> dict:
    try:
        async with session.get(url) as response:
            if response.status == 200:
                text = await response.text()
                soup = BeautifulSoup(text, 'html.parser')
                description_element = soup.find('p', {'class': 'company-seo-text'})
                data = description_element.text.strip() if description_element else 'Описание не найдено.'
                formatted_data = format_description(data)
                return {
                    'url': url,
                    'p1': formatted_data
                }
            else:
                print(f"HTTP Error: {response.status}")
                return {
                    'url': url,
                    'p1': 'Ошибка при загрузке страницы'
                }
    except Exception as e:
        print(f"Ошибка при запросе к {url}: {e}")
        return {
            'url': url,
            'p1': 'Ошибка при загрузке страницы'
        }

async def search_company_descriptions(company):
    result_object = {"text": "", "links": []}

    url = config.YNDX_SEARCH_URL

    params = {
        'folderid': config.YNDX_API_FOLDER_ID,
        'apikey': config.YNDX_TOKEN,
    }

    async with aiohttp.ClientSession() as session:
        query = f"companies.rbc.ru {company}"
        print(f"Search query: {query}")
        params['query'] = query

        async with session.get(url, params=params) as response:
            print(f"API response status: {response.status}")
            if response.status != 200:
                return result_object

            text = await response.text()
            root = ET.fromstring(text)

            url_elements = root.findall(".//results/grouping/group/doc/url")
            rusprofile_url = None

            for url_element in url_elements:
                if "https://companies.rbc.ru/" in url_element.text:
                    rusprofile_url = unquote(url_element.text)
                    break

            if rusprofile_url:
                result = await find_company_description(session, rusprofile_url)
                if result:
                    result_object["p1"] = result.get("p1", "")
                    result_object["links"].append(result.get("url", ""))
            else:
                result_object["p1"] = 'Описание не найдено.'

    return result_object

# Пример вызова функции
# asyncio.run(search_company_descriptions('Северсталь'))
