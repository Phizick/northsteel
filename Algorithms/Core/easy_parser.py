import aiohttp
from bs4 import BeautifulSoup
import re
from extract_sentences import extract_sentences


async def my_parser(url, keywords):
    sentences_matched = []
    key = ['прибыль', 'выручка', 'рублей', 'клиенты', 'доля', 'рынок', 'рынка', 'пользователи', 'сервис']

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                raw_text = await response.content.read()
                soup = BeautifulSoup(raw_text, 'html.parser')

                if soup.body is None:
                    print(f"Couldn't find the body content for url: {url}")
                    return sentences_matched

                body_content = soup.body.find_all(['p'])

                for p in body_content:
                    text = p.get_text().strip()
                    sentences = re.split('(?<=[.!?]) +', text)
                    for sentence in sentences:
                        if any(keyword.lower() in sentence.lower() for keyword in keywords):
                            sentences_matched.append(sentence.strip())

                if not sentences_matched:
                    print(f"No matching sentences found for url: {url}")
                    return sentences_matched

                text_content = ' '.join(sentences_matched)
                sentences_matched = await extract_sentences(text_content, 10, key)
    print('parser')
    # print(sentences_matched)
    return sentences_matched

