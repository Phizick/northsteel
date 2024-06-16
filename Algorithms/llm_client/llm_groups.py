# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config

# функция обработки запросов llm. содержит специфические промпты


async def llm_groups(message):
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
                "content": f"найди компании участников российского рынка {message} и составь из них список из 3 компаний в виде массива groups[].ответ верни только массивом на русском языке без лишних комментариев"

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
