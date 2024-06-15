# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config


async def llm_text_parser(data):
    url = config.DAISY_URL
    token = config.DAISY_TOKEN
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    data = {
        "messages": [
            {
                "role": "user",
                "content": "проведи анализ текста"
            },
            {
                "role": "assistant",
                "content": "Хорошо, начнем."
            },
            {
                "role": "user",
                "content": f"проведи анализ текста {data} и перепиши его с большим кол-вом цифр и данных, которые сможешь добавить по тематике текста. разбей на абзацы и ответ верни без лишних комментариев в виде обьекта text: в котором каждый абзац будет значением свойства p"

            }
        ],
        "max_tokens": 4060
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=json.dumps(data)) as response:
            if response.status == 200:
                response_json = await response.json()
                assistant_response = response_json["choices"][0]["message"]["content"]
                return assistant_response
            else:
                return f"Ой, всё сломалось =( Не удалось получить ответ от сервера. Попрубуйте чуть позже. Статус: {response.status}"
