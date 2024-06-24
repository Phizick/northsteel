import json

from Algorithms.Core.process_company_data import reshape_company_data
from Algorithms.Scrape.find_one_inn import search_inn
from fns_for_one_scrape import fns_for_one_scrape
from Algorithms.Scrape.search_company_descriptions import search_company_descriptions
from typing import Dict, Any


# основной хаб алгоритмов для конкурентного анализа. принимает на вход запрос со структурой и метриками
# производит вычисления и наполняет структуру данными ответа


def transform_json_to_text(json_input: Dict[str, str]) -> Dict[str, Dict[str, str]]:
    text_object = {"text": {}}

    for i, (key, value) in enumerate(json_input.items(), 1):
        text_object["text"][f"p{i}"] = f"{key}: {value}"

    return text_object

def extract_first_value(data_dicts):
    for data in data_dicts:
        for key, value in data.items():
            return value
    return None

def transform_json_to_object(json_input: Dict[str, Any]) -> Dict[str, Dict[str, str]]:
    text_object = {"text": {}}

    for i, (outer_key, inner_dict) in enumerate(json_input.items(), 1):
        lines = [f'{key}: {value}' for key, value in inner_dict.items()]
        text_object["text"][f"p{i}"] = " ".join(lines)

    return text_object


async def algorithm_hub_competitor(data):
    data_set = data
    main_query = data_set['competitorName']
    blocks = []
    block_id = 1

    try:
        # search_result = await search(main_query, key_for_comp, 12000)
        # print(search_result)
        # data_paragraphs = await create_paragraphs_object(search_result['text'])
        # blocks.append({
        #     "id": block_id,
        #     "type": "text",
        #     "title": f"Общая информация о компании {main_query}",
        #     "charts": [],
        #     "groups": [],
        #     "data": {
        #         "text": data_paragraphs,
        #         "links": search_result['links']
        #     }
        # })
        # block_id += 1

        data_result_company_info = await search_company_descriptions(main_query)
        print(data_result_company_info)
        # data_paragraphs_company = await create_paragraphs_object(data_result_company_info)

        blocks.append({
            "id": block_id,
            "type": "text",
            "title": f"Ключевая информация о компании {main_query}",
            "charts": [],
            "groups": [],
            "data": {
                "text": {'text': {'p1': data_result_company_info['p1']}},
                "links": data_result_company_info['links']
            }
        })
        block_id += 1

        company_get_inn = await search_inn([main_query])
        print(company_get_inn)

        data_fin_info = fns_for_one_scrape(company_get_inn)
        print(data_fin_info)
        data_result = await reshape_company_data(main_query, data_fin_info)

        blocks.append({
            "id": block_id,
            "type": "table",
            "title": main_query,
            "charts": [],
            "groups": [main_query],
            "indicators": ['Баланс', 'Выручка', 'Валовая прибыль (убыток)', 'Прибыль (убыток) от продаж',
                            'Чистая прибыль (убыток)', 'Заемные средства', 'Совокупный финансовый результат периода'],
            "data": data_result,
            "links": [data_fin_info[1]]

        })
        block_id += 1

        # data_finance_report = await search_finance_report(main_query, "2023")
        # blocks.append({
        #     "id": block_id,
        #     "type": "text",
        #     "title": f"Финансовая отчетность компании {main_query}",
        #     "charts": [],
        #     "groups": [],
        #     "data": {
        #         "link": data_finance_report
        #     }
        # })
        #
        # block_id += 1
        # print(1)

        # data_result_about = await llm_table_about(main_query)
        # print(data_result_about)
        # data_about = json.loads(data_result_about)
        #
        # if isinstance(data_about, list):
        #     if len(data_about) != 1:
        #         raise ValueError("Input must contain exactly one JSON object")
        #     data_about = data_about[0]
        #
        # if not isinstance(data_about, dict):
        #     raise ValueError("Input must be a JSON object.")
        #
        # data_about_ans = transform_json_to_text(data_about)
        #
        # blocks.append({
        #     "id": block_id,
        #     "type": "text",
        #     "title": main_query,
        #     "charts": [],
        #     "groups": [],
        #     "data": {
        #         "text": data_about_ans
        #     }
        # })
        #
        # block_id += 1
        #
        # data_result_contr = await llm_search(main_query)
        # print(data_result_contr)
        # data_contr = json.loads(data_result_contr)
        #
        # if isinstance(data_contr, list):
        #     if len(data_contr) != 1:
        #         raise ValueError("Input must contain exactly one JSON object")
        #     data_contr = data_contr[0]
        #
        # if not isinstance(data_contr, dict):
        #     raise ValueError("Input must be a JSON object.")
        #
        # data_contr_ans = transform_json_to_object(data_contr)
        #
        # blocks.append({
        #     "id": block_id,
        #     "type": "text",
        #     "title": main_query,
        #     "charts": [],
        #     "groups": [],
        #     "data": {
        #         "text": data_contr_ans
        #     }
        # })
        #
        # block_id += 1

    except json.JSONDecodeError:
        print("JSON decode error while processing data.")
    except Exception as e:
        print(f"An error occurred: {e}")

    data_set['blocks'] = blocks
    # print(result)

    # функция автоапдейта, запускающая алгоритмы с теми же настройками, для которых был выбран автоапдейт
    # autoupdate_interval = data.get('autoupdate')
    # if autoupdate_interval is not None:
    #     await asyncio.sleep(autoupdate_interval * 60)
    #     print("-----------autoupdate--------")
    #     await algorithm_hub_competitor(data)

    return data_set
