# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config

# функция обработки запросов llm. содержит специфические промпты


async def llm_company_about(data):
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
                "content": (f"пожалуйста создай таблицу с информацией по работе компании {data}. "
                            f"ответ верни в виде JSON обьекта с полями: выручка, доходы, расходы, доля на рынке, "
                            f"чистая прибыль. Следи за тем, что бы не было вложенных обьектов/массивов и формат "
                            f"данных сохранялся четко")
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
