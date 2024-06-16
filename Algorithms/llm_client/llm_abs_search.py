# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config

# функция обработки запросов llm. содержит специфические промпты


async def llm_abs_search(dates, credentials, company):
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
                "content": f"сформируй отчет о {credentials} компаний из списка {company} за года {dates}."
                           f" ответ верни в виде JSON массива[] обьектов, каждый обьект не должен иметь вложенных "
                           f"обьектов и содержать поля - Компания: название комп, Показатель: каждый из {credentials}. "
                           f"каждый год из {dates}"

            }
        ],
        "max_tokens": 4096
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=json.dumps(data)) as response:
            if response.status == 200:
                response_json = await response.json()
                assistant_response = response_json["choices"][0]["message"]["content"]
                return assistant_response
            else:
                return f"Ой, всё сломалось =( Не удалось получить ответ от сервера. Попрубуйте чуть позже. Статус: {response.status}"
