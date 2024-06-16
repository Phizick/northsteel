import aiohttp
from bs4 import BeautifulSoup
from nltk.tokenize import sent_tokenize


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
            return f"Ошибка при загрузке страницы {start_url}: {e}"

        soup = BeautifulSoup(html_content, 'html.parser')
        links = soup.find_all('a', class_=class_name)
        urls = [base_url + link.get('href') if not link.get('href').startswith("http") else link.get('href') for link in links if any(keyword.lower() in link.text.strip().lower() for keyword in keywords)]

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
