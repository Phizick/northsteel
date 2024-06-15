# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config


async def llm_dates_search(dates, credentials, company):
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
                "content": "сформируй мне отчет с данными"
            },
            {
                "role": "assistant",
                "content": "Хорошо, начнем."
            },
            {
                "role": "user",
                "content": f"расскажи на русском языке о {credentials} компаний {company} за года {dates}. ответ верни в виде массива обьектов: Компания: название компании, Показатель: каждый из {credentials}, Итого (каждый год из {dates})  и так далее, значения заполни сам без лишних комментариев"

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
