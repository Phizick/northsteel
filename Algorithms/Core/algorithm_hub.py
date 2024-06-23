import json
import asyncio
import re
from Algorithms.Core.process_company_data import process_company_data
from Algorithms.Core.search_func import search
from Algorithms.Core.split_into_paragraphs import create_paragraphs_object
from Algorithms.llm_client.llm_groups import llm_groups
from Algorithms.Core.filter_array import key_for_comp
from Algorithms.Core.inn import search_inns
from datetime import datetime
from typing import Dict, List, Any

from Algorithms.llm_client.llm_search_by_dates import llm_search_by_dates
from Algorithms.llm_client.llm_tech_info import llm_tech_info


# основной хаб алгоритмов для анализа рынка. принимает на вход запрос со структурой и метриками
# производит вычисления и наполняет структуру данными ответа

def extract_years(from_date, to_date):
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    from_year = datetime.strptime(from_date, date_format).year
    to_year = datetime.strptime(to_date, date_format).year
    return list(range(from_year, to_year + 1))


def transform_data(data_dict):
    if data_dict is None:
        return []
    return [{key: value} for key, value in data_dict.items()]


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


def prepend_total_to_years(years):
    return [f"Итого {year}" for year in years]


def extract_array_from_object(json_input: Dict[str, Any]) -> List[Dict[str, Any]]:
    for key, value in json_input.items():
        if isinstance(value, list):
            return value
    raise ValueError("JSON object does not contain an array under any key.")


async def create_periods_block(data):
    unique_years = set()

    for entry in data:
        print("Keys in entry:", entry.keys())
        for key in entry.keys():
            key_clean = key.strip()
            if key_clean.startswith("Итого "):
                year_part = key_clean[6:]
                if year_part in {"2019", "2020", "2021", "2022", "2023", "2024"}:
                    unique_years.add(year_part)

    periods = [f"Итого {year}" for year in sorted(unique_years)]
    return periods


async def algorithm_hub_search(data):
    data_set = data
    main_query = data_set['title']
    regions_query = data_set['title']
    from_date = data_set['datesOfReview']['from']
    to_date = data_set['datesOfReview']['to']
    dates_arr = extract_years(from_date, to_date)

    if data_set['market'] == "металлургия":
        groups_res = ['Сибур', 'Русал', 'Евраз']
    elif data_set['market'] == 'Полезные ископаемые':
        groups_res = ['Газпром', 'Новатэк', 'Лукоил']
    else:

        groups_response = await llm_groups(main_query)
        try:
            groups_res = json.loads(groups_response)
        except json.JSONDecodeError:
            print("Error decoding JSON, returning original response")
            return groups_response
        except Exception as e:
            print(f"Error processing groups response: {e}")
            return groups_response

    company_info = await search_inns(groups_res)

    for block in data_set['blocks']:
        block['charts'] = []
        block['groups'] = groups_res
        # updated_periods = [f"Итого {year}" for year in dates_arr]

        data_result = None
        raw_response = None
        periods_block = None

        try:
            if block['type'] == 'text':
                # print(groups_res)
                search_results = await asyncio.gather(
                    *[search(text, key_for_comp, 12000) for text in groups_res]
                )

                combined_text = ' '.join([result['text'] for result in search_results])
                text_result = await create_paragraphs_object(combined_text)

                combined_links = []
                for result in search_results:
                    for link in result['links']:
                        if isinstance(link, dict):
                            combined_links.append(link)
                        else:
                            combined_links.append({'url': link})

                seen_links = set()
                unique_links = []
                for link in combined_links:
                    link_tuple = tuple(link.items())
                    if link_tuple not in seen_links:
                        unique_links.append(link)
                        seen_links.add(link_tuple)

                data_result = {
                    'text': text_result,
                    'links': unique_links
                }

            elif block['type'] == 'table':
                if block.get('by') == "Регион РФ":
                    # data_result = await scrape_crawler(regions_query)
                    return
                else:
                    print("Processing table block:", block)
                    indicators = block.get('indicators', [])
                    if indicators:
                        indicators_str = ", ".join(indicators)
                        if block.get('title') == "Объемы рынка":
                            groups_arr = block.get('groups', [])
                            data_result = await process_company_data(company_info)
                            periods_block = await create_periods_block(data_result)

                            # data_result = json.loads(data_result_markets)

                        # elif block.get('splitByDates'):
                        #     groups_arr = block.get('groups', [])
                        #     date_array = prepend_total_to_years(dates_arr)
                        #     data_result_raw = await llm_search_by_dates(date_array, indicators_str, groups_arr)
                        #     print(data_result_raw)
                        #     raw_response = data_result_raw
                        #     data_result = json.loads(data_result_raw)
                        elif block.get('indicators') == "Технология":
                            groups_arr = block.get('groups', [])
                            data_result_tech = await llm_tech_info(indicators_str, groups_arr)
                            data_result = json.loads(data_result_tech)
                            print(data_result)

        except json.JSONDecodeError:
            print("JSON decode error while processing data, returning raw response")
            data_result = raw_response
        except Exception as e:
            print(f"An error occurred: {e}")

        block['periods'] = periods_block
        block['data'] = data_result

    result = json.dumps(data_set, ensure_ascii=False, indent=2)
    # print(result)

    # функция автоапдейта, запускающая алгоритмы с теме же настройками, для которых был выбран автоапдейт
    # autoupdate_interval = data.get('autoupdate')
    # if autoupdate_interval is not None:
    #     await asyncio.sleep(autoupdate_interval * 60)
    #     print("-----------autoupdate--------")
    #     await algorithm_hub(data)

    return result



