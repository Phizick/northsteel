import aiohttp
from bs4 import BeautifulSoup
from nltk.tokenize import sent_tokenize
import asyncio

# функция более глубокого анализа доверенных источников. позволяет погружаться на несколько уровней


async def scrape_crawler(keywords):
    start_url = "https://www.rbc.ru/industries/regions"
    base_url = "https://www.rbc.ru"
    class_name = "info-block-title"
    keywords = keywords.split() if isinstance(keywords, str) else keywords
    final_results = []

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(start_url) as response:
                response.raise_for_status()
                html_content = await response.text()
        except aiohttp.ClientError as e:
            print(f"Ошибка при загрузке страницы {start_url}: {e}")
            return []

        soup = BeautifulSoup(html_content, 'html.parser')
        links = soup.find_all('a', class_=class_name)

        for keyword in keywords:
            print(f"Search results for: {keyword}")
            keyword_results = []
            urls = [base_url + link.get('href') if not link.get('href').startswith("http") else link.get('href')
                    for link in links if keyword.lower() in link.text.strip().lower()]

            for url in urls:
                try:
                    async with session.get(url) as response:
                        response.raise_for_status()
                        page_content = await response.text()
                except aiohttp.ClientError as e:
                    keyword_results.append(f"Ошибка при загрузке страницы {url}: {e}")
                    continue

                page_soup = BeautifulSoup(page_content, 'html.parser')
                paragraphs = page_soup.find_all('p')
                content_for_page = " ".join(paragraph.text.strip() for paragraph in paragraphs if paragraph.text.strip())

                sentences = sent_tokenize(content_for_page, language='russian')
                limited_content = " ".join(sentences[:6])
                keyword_results.append(limited_content)

            final_results.append({keyword: keyword_results})
            print({keyword: keyword_results})

    return final_results

test = ['Сибур', 'Русал', 'Казани']
asyncio.run(scrape_crawler(test))