import asyncio
import json
from Algorithms.Core.llm_search import send_message_to_neural_deep_tech
from Algorithms.Core.search_func import search
from Algorithms.Core.split_into_paragraphs import create_paragraphs_object
from Algorithms.Scrape.scrape import scrape_crawler

data_template = {
    "title": "Лидеры рынка информационной безопасности",
    "market": "Информационные технологии",
    "marketNiche": "Информационная безопасность",
    "autoupdate": 4,
    "splitByDates": True,
    "datesOfReview": {
        "by": "year",
        "from": "2016-06-12T08:33:29.961Z",
        "to": "2024-06-12T08:33:29.961Z"
    },
    "blocks": [
        {
            "id": "1",
            "isDefault": True,
            "type": "text",
            "title": "Определение продуктовой ниши",
            "split": False,
            "by": "",
            "splitByDates": False,
            "indicators": ["Драйверы роста", "Органичения роста", "Тренды в развитии"]
        },
        {
            "id": "2",
            "isDefault": True,
            "type": "table",
            "title": "Объемы рынка",
            "split": True,
            "by": "Ниша",
            "splitByDates": False,
            "indicators": ["Доли рыночных ниш", "Количество потребителей"]
        },
        {
            "id": "3",
            "isDefault": True,
            "type": "table",
            "title": "Динамика по регионам",
            "split": True,
            "by": "Регион РФ",
            "splitByDates": False,
            "indicators": ["Доля региона", "Количество потребителей"]
        },
        {
            "id": "4",
            "isDefault": True,
            "type": "table",
            "title": "Лидеры рынка",
            "split": True,
            "by": "Компания",
            "splitByDates": True,
            "indicators": ["Доля на рынке", "Доходы", "Расходы", "EBITDA", "Чистая прибыль"]
        },
        # {
        #     "id": "5",
        #     "isDefault": True,
        #     "type": "table",
        #     "title": "Лидеры по потреблению",
        #     "split": True,
        #     "by": "Потребитель",
        #     "splitByDates": True,
        #     "indicators": ["Доля"]
        # },
        # {
        #     "id": "6",
        #     "isDefault": True,
        #     "type": "table",
        #     "title": "Прирост потребителей",
        #     "split": True,
        #     "by": "Ниша",
        #     "splitByEnumerable": "Количество потребителей"
        # },
        # {
        #     "id": "7",
        #     "isDefault": True,
        #     "type": "table",
        #     "title": "Лидеры по потреблению",
        #     "split": True,
        #     "by": "Продукт",
        #     "splitByDates": True,
        #     "indicators": ["Технология", "Компания-владелец", "Ссылка на ресурс"]
        # },
        # {
        #     "id": "f8076297-bc78-4d00-8761-218997eeb384",
        #     "isDefault": False,
        #     "type": "table",
        #     "title": "Количество киберпреступлений по реременной Пфалц",
        #     "split": True,
        #     "by": "Регион РФ",
        #     "splitByDates": True,
        #     "indicators": ["Количество киберпреступлений", "Количество раскрытых киберпреступлений"]
        # }
    ]
}


async def algorithm_hub(data):
    data_set = data
    main_query = data_set['title']
    regions_query = data_set['marketNiche']

    for block in data_set['blocks']:
        data_result = None
        if block['type'] == 'text':

            search_result = await search(main_query)
            data_text = await create_paragraphs_object(search_result['text'])
            data_result = {
                "text": data_text,
                "links": search_result['links']
            }
        elif block['type'] == 'table':
            if block.get('by') == "Регион РФ":
                data_result = await scrape_crawler(regions_query)
            else:
                print("Processing table block:", block)
                indicators = block.get('indicators', [])
                if indicators:
                    indicators_str = ", ".join(indicators)
                    data_result = await send_message_to_neural_deep_tech(main_query, indicators_str)

        block['data'] = data_result

    result = json.dumps(data, ensure_ascii=False, indent=2)
    print(result)
    return result


asyncio.run(algorithm_hub(data_template))
