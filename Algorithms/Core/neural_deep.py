# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config


async def send_message_to_neural_deep_tech(message):
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
                "content": "проведем анализ"
            },
            {
                "role": "assistant",
                "content": "Хорошо, начнем."
            },
            {
                "role": "user",
                "content": message
            },
            {
                "role": "user",
                "content": "проведи анализ текста про компанию, и попробуй заполнить поля в этой схеме:"
                           "Головной офис, Год основания, Колличество сотрудников, Тип управления, Отделы компании, Выручка, EBITDA за последний год в долларах или евро"
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
