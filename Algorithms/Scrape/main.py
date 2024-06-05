import aiohttp
import asyncio
from bs4 import BeautifulSoup


async def main_crawler(keywords):
    start_url = "https://www.rbc.ru/industries/tag/ai?from=industries_main"
    class_name = "info-block-title"

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(start_url) as response:
                response.raise_for_status()
                html_content = await response.text()
        except aiohttp.ClientError as e:
            print(f"Ошибка при загрузке страницы {start_url}: {e}")
            return

        soup = BeautifulSoup(html_content, 'html.parser')
        links = soup.find_all('a', class_=class_name)
        urls = []

        for link in links:
            text = link.text.strip().lower()
            href = link.get('href')
            if href and any(keyword in text for keyword in keywords):
                urls.append(href)

        for url in urls:
            print(f"Содержимое из {url}:")
            try:
                async with session.get(url) as response:
                    response.raise_for_status()
                    page_content = await response.text()
            except aiohttp.ClientError as e:
                print(f"Ошибка при загрузке страницы {url}: {e}")
                continue

            page_soup = BeautifulSoup(page_content, 'html.parser')
            paragraphs = page_soup.find_all('p')
            for paragraph in paragraphs:
                par_text = paragraph.text.strip()
                if par_text:
                    print(par_text)
            print("-------")


if __name__ == "__main__":
    asyncio.run(main_crawler(["нейросети", "искусственный интеллект"]))
