import asyncio
import json
from Algorithms.Core.llm_search import send_message_to_neural_deep_tech
from Algorithms.Core.search_func import search
from Algorithms.Core.split_into_paragraphs import create_paragraphs_object
from Algorithms.Scrape.scrape import scrape_crawler
from Algorithms.Core.llm_dates_serach import llm_dates_search
from Algorithms.Core.llm_text_parser import llm_text_parser
from datetime import datetime

# data_template = {
#     "title": "Лидеры рынка информационной безопасности",
#     "market": "Информационные технологии",
#     "marketNiche": "Информационная безопасность",
#     "autoupdate": 4,
#     "type": "market",
#     "splitByDates": True,
#     "datesOfReview": {
#         "by": "year",
#         "from": "2019-06-12T08:33:29.961Z",
#         "to": "2022-06-12T08:33:29.961Z"
#     },
#     "blocks": [
#         {
#             "id": "1",
#             "isDefault": True,
#             "type": "text",
#             "title": "Определение продуктовой ниши",
#             "split": False,
#             "by": "",
#             "splitByDates": False,
#             "charts": [],
#             "groups": [],
#             "periods": [],
#             "indicators": ["Драйверы роста", "Органичения роста", "Тренды в развитии"],
#             "links": []
#         },
#         {
#             "id": "2",
#             "isDefault": True,
#             "type": "table",
#             "title": "Объемы рынка",
#             "split": True,
#             "by": "Ниша",
#             "splitByDates": False,
#             "charts": [],
#             "groups": ["Symantec", "McAfee", "Kaspersky Lab"],
#             "periods": [],
#             "indicators": ["Доли рыночных ниш", "Количество потребителей"]
#         },
#         {
#             "id": "3",
#             "isDefault": True,
#             "type": "table",
#             "title": "Динамика по регионам",
#             "split": True,
#             "by": "Регион РФ",
#             "splitByDates": False,
#             "charts": [],
#             "groups": [],
#             "periods": [],
#             "indicators": ["Доля региона", "Количество потребителей"]
#         },
#         {
#             "id": "4",
#             "isDefault": True,
#             "type": "table",
#             "title": "Лидеры рынка",
#             "split": True,
#             "by": "Компания",
#             "splitByDates": True,
#             "charts": [],
#             "groups": ["Kaspersky Lab", "Symantec", "McAfee"],
#             "periods": [],
#             "indicators": ["Доля на рынке", "Доходы", "Расходы", "EBITDA", "Чистая прибыль"]
#         },
#         {
#             "id": "5",
#             "isDefault": True,
#             "type": "table",
#             "title": "Лидеры по потреблению",
#             "split": True,
#             "by": "Потребитель",
#             "splitByDates": True,
#             "charts": [],
#             "groups": ["Kaspersky Lab", "Symantec", "Trend Micro"],
#             "periods": [],
#             "indicators": ["Доля"]
#         },
#         {
#             "id": "6",
#             "isDefault": True,
#             "type": "table",
#             "title": "Прирост потребителей",
#             "split": True,
#             "by": "Ниша",
#             "charts": [],
#             "groups": [],
#             "periods": [],
#             "splitByEnumerable": "Количество потребителей"
#         },
#         {
#             "id": "7",
#             "isDefault": True,
#             "type": "table",
#             "title": "Лидеры по потреблению",
#             "split": True,
#             "by": "Продукт",
#             "splitByDates": True,
#             "charts": [],
#             "groups": ["Cisco", "Symantec", "Palo Alto Networks", "Splunk"],
#             "periods": [],
#             "indicators": ["Технология", "Компания-владелец", "Ссылка на ресурс"]
#         },
#         {
#             "id": "8",
#             "isDefault": False,
#             "type": "table",
#             "title": "Количество киберпреступлений по реременной Пфалц",
#             "split": True,
#             "by": "Регион РФ",
#             "splitByDates": True,
#             "charts": [],
#             "groups": [],
#             "periods": [],
#             "indicators": ["Количество киберпреступлений", "Количество раскрытых киберпреступлений"]
#         }
#     ]
# }


def extract_years(from_date, to_date):
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    from_year = datetime.strptime(from_date, date_format).year
    to_year = datetime.strptime(to_date, date_format).year
    return [from_year, to_year]


def parse_response_data(response, dates_arr):
    try:
        data = json.loads(response.replace('n', ''))
    except json.JSONDecodeError:
        print("Ошибка декодирования JSON")
        return []

    results = []
    entries = data if isinstance(data, list) else [data]
    for entry in entries:
        company = entry.get("Компания", "")
        indicator = entry.get("Показатель", "")

        company_data = {
            "Компания": company,
            "Показатель": indicator,
        }

        for date in dates_arr:
            total_key = f"Итого {date}"
            total_value = entry.get(total_key, "")
            company_data[total_key] = total_value

        results.append(company_data)

    print(results)
    return results


async def algorithm_hub(data):
    data_set = data
    main_query = data_set['title']
    regions_query = data_set['title']
    from_date = data_set['datesOfReview']['from']
    to_date = data_set['datesOfReview']['to']
    dates_arr = extract_years(from_date, to_date)

    for block in data_set['blocks']:
        data_result = None
        if block['type'] == 'text':

            search_result = await search(main_query)
            data_text = await llm_text_parser(search_result['text'])
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
                    if block.get('splitByDates'):
                        groups_arr = block['groups']
                        data_result = await llm_dates_search(dates_arr, indicators_str, groups_arr)
                        # data_result = parse_response_data(data_response, dates_arr)
                    else:

                        data_result = await send_message_to_neural_deep_tech(main_query, indicators_str)

        block['data'] = data_result

    result = json.dumps(data, ensure_ascii=False, indent=2)
    # print(result)

    # autoupdate_interval = data.get('autoupdate')
    # if autoupdate_interval is not None:
    #     await asyncio.sleep(autoupdate_interval * 60)
    #     print("-----------autoupdate--------")
    #     await algorithm_hub(data)

    return result



