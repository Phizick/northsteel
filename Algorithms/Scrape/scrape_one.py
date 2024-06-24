import time

import aiohttp
from bs4 import BeautifulSoup
from nltk.tokenize import sent_tokenize
from urllib.parse import quote, unquote
import asyncio

async def scrape_crawler(keyword):
    base_url = "https://www.rbc.ru/tags/?tag="
    site_base_url = "https://www.rbc.ru"
    class_name = "search-item__title"
    search_container_class = "l-row g-overflow js-search-container"
    item_class = "search-item js-search-item"
    keywords = keyword.split() if isinstance(keyword, str) else keyword
    final_results = []

    async with aiohttp.ClientSession() as session:
        for keyword in keywords:
            encoded_keyword = quote(keyword)
            start_url = base_url + encoded_keyword

            print(f"Searching for: at {start_url}")
            try:
                async with session.get(start_url) as response:
                    response.raise_for_status()
                    html_content = await response.text()
            except aiohttp.ClientError as e:
                return f"Ошибка при загрузке страницы {start_url}: {e}"

            soup = BeautifulSoup(html_content, 'html.parser')
            search_container = soup.find('div', class_=search_container_class)
            if not search_container:
                continue

            items = search_container.find_all('div', class_=item_class)
            print(items)
            urls = []
            for item in items:
                a_tag = item.find('a')
                if a_tag and any(keyword.lower() in a_tag.text.strip().lower() for keyword in keywords):
                    url = site_base_url + a_tag['href'] if not a_tag['href'].startswith("http") else a_tag['href']
                    urls.append(url)

            for url in urls[:2]:
                try:
                    async with session.get(url) as response:
                        response.raise_for_status()
                        page_content = await response.text()
                except aiohttp.ClientError as e:
                    final_results.append(f"Ошибка при загрузке страницы {url}: {e}")
                    continue

                page_soup = BeautifulSoup(page_content, 'html.parser')
                paragraphs = page_soup.find_all('p')
                content_for_page = " ".join(paragraph.text.strip() for paragraph in paragraphs if paragraph.text.strip())

                sentences = sent_tokenize(content_for_page, language='russian')
                limited_content = " ".join(sentences[:6])
                final_results.append(limited_content)

    return final_results


test = 'Сибур'
asyncio.run(scrape_crawler(test))
