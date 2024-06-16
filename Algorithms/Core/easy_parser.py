import aiohttp
from bs4 import BeautifulSoup
import re
from Algorithms.Core.extract_sentences import extract_sentences


# функция парсинга. проходится по данным на странице
# (для краткости ответа выбраны только ['p', 'span', 'h1', 'h2'], если добавить "div"
# кол-во обрабатываемой информации увеличится ~ в 20 раз, что позволяет масштабировать решение


async def easy_parser(url, key, keywords):
    sentences_matched = []

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                raw_text = await response.content.read()
                soup = BeautifulSoup(raw_text, 'html.parser')

                if soup.body is None:
                    print(f"Couldn't find the body content for url: {url}")
                    return sentences_matched

                body_content = soup.body.find_all(['p', 'span', 'h1', 'h2'])

                for p in body_content:
                    text = p.get_text().strip()
                    sentences = re.split('(?<=[.!?]) +', text)
                    for sentence in sentences:
                        if any(keyword.lower() in sentence.lower() for keyword in key):
                            sentences_matched.append(sentence.strip())

                if not sentences_matched:
                    print(f"No matching sentences found for url: {url}")
                    return sentences_matched

                text_content = ' '.join(sentences_matched)
                sentences_matched = await extract_sentences(text_content, 60, keywords)
    print('parser')
    # print(sentences_matched)
    return sentences_matched

