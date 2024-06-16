# -*- coding: utf-8 -*-

import aiohttp
import json
from Algorithms.Core import config

# функция обработки запросов llm. содержит специфические промпты


async def llm_markets_customers(dates, company):
    print('1')
    url = config.DAISY_URL
    token = config.DAISY_TOKEN
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    data = {
        "messages": [
    #         {
    #             "role": "user",
    #             "content": (f"Создайте отчет на основе данных для следующих компаний: по {credentials}."
    # f"Отчет должен содержать следующие показатели: {dates}. Пожалуйста, верните результат в виде JSON массива "
    # f"объектов, где каждый объект будет представлять одну запись, не содержащую вложенных объектов. "
    # f"Каждый объект должен иметь следующие поля: 'Компания'{company}, одно значение из {credentials}, и по одному полю для каждого из указанных годов с префиксом Итого. "
    # f"Убедитесь, что данные структурированы правильно, и каждый год для каждой компании представлен в отдельном объекте.")
    # }
            {
                "role": "user",
                "content": (
                    f"Создай отчёт по компаниям и годам {dates}. "
                    f"Отчёт должен содержать поля 'доля потребителей' и 'количество потребителей' для каждой компании из {company} "                    
                    f"Пример правильного формата:"
                    f"["
                    f"  {{"
                    f"    'Компания': 'Компания А', "
                    f"    'Показатель: Доля потребителей', "
                    f"    'Итого 2021': 25%, "
                    f"    'Итого 2022': 27% "
                    f"  }},"
                    f"  {{"
                    f"    'Компания': 'Компания А', "
                    f"    'Показатель: Колличество потребителей', "
                    f"    'Итого 2021': 1000, "
                    f"    'Итого 2022': 1200 "
                    f"  }},"
                    f"  {{"
                    f"    'Компания': 'Компания Б', "
                    f"    'Показатель: Доля потребителей', "
                    f"    'Итого 2021': 17%, "
                    f"    'Итого 2022': 25% "
                    f"  }},"
                    f"  {{"
                    f"    'Компания': 'Компания Б', "
                    f"    'Показатель: Колличество потребителей', "
                    f"    'Итого 2021': 1700, "
                    f"    'Итого 2022': 1200 "
                    f"  }}"
                    f"] и так далее..."
                    f"ответ верни в JSON и проверь что бы он был правильным")
            }
    ],
        "max_tokens": 4096
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=json.dumps(data)) as response:
            if response.status == 200:
                print(response)
                response_json = await response.json()

                assistant_response = response_json["choices"][0]["message"]["content"]
                print(assistant_response)
                return assistant_response
            else:
                return f"Ой, всё сломалось =( Не удалось получить ответ от сервера. Попрубуйте чуть позже. Статус: {response.status}"
