import aiohttp
from bs4 import BeautifulSoup
import re
from extract_sentences import extract_sentences


async def neural_parser(url, keywords):
    MAX_LENGTH = 4000
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

                body_content = soup.body.find_all(['p', 'span', 'h1', 'h2', 'h3', 'h4'])

                collected_text = ""
                for tag in body_content:
                    if len(collected_text) >= MAX_LENGTH:
                        break
                    text = tag.get_text().strip()
                    sentences = re.split('(?<=[.!?]) +', text)
                    for sentence in sentences:
                        if any(keyword.lower() in sentence.lower() for keyword in keywords):
                            if len(collected_text) + len(sentence) + 1 > MAX_LENGTH:
                                break
                            sentences_matched.append(sentence.strip())
                            collected_text += sentence.strip() + " "

                if not sentences_matched:
                    print(f"No matching sentences found for url: {url}")
                    return sentences_matched

                final_text = ' '.join(sentences_matched)[:MAX_LENGTH].rstrip()

                sentences_matched = await extract_sentences(final_text, 10, key)
                print('parser')
                # print(sentences_matched)
    return sentences_matched
