import aiohttp
import asyncio
from bs4 import BeautifulSoup


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
        urls = []

        for link in links:
            text = link.text.strip().lower()
            href = link.get('href')
            if href and any(keyword.lower() in text for keyword in keywords):
                if not href.startswith("http"):
                    href = base_url + href
                urls.append(href)

        for url in urls:
            try:
                async with session.get(url) as response:
                    response.raise_for_status()
                    page_content = await response.text()
            except aiohttp.ClientError as e:
                final_results.append(f"Ошибка при загрузке страницы {url}: {e}")
                continue

            page_soup = BeautifulSoup(page_content, 'html.parser')
            paragraphs = page_soup.find_all('p')
            content_for_page = []

            for paragraph in paragraphs:
                par_text = paragraph.text.strip()
                if par_text:
                    content_for_page.append(par_text)

            final_results.append("n".join(content_for_page) + "n-------n")
            print(final_results)

    return final_results


if __name__ == "__main__":
    asyncio.run(scrape_crawler("Информационная безопасность"))
