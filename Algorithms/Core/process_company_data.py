from Algorithms.Scrape.fns_scrape import fns_scrape
import asyncio
from concurrent.futures import ThreadPoolExecutor
import re


async def reshape_company_data(company_name, that_company_data):
    result = []

    company_data = that_company_data[0]

    for item in company_data:
        if isinstance(item, dict):
            for key, value in item.items():
                if isinstance(value, dict):
                    entry = {
                        "Компания": company_name,
                        "Показатель": key
                    }

                    for date, amount in value.items():
                        cleaned_amount = re.sub(r's+', '', amount)
                        cleaned_amount = re.sub(r',.*', '', cleaned_amount)

                        year_match = re.search(r'(202[0-4]|201[9])', date)
                        if year_match:
                            new_key = f"Итого {year_match.group()}"
                        else:
                            new_key = date

                        entry[new_key] = cleaned_amount

                    result.append(entry)

    return result


async def process_company_data(companies_dict):
    results = {}
    reshaped_results = []

    with ThreadPoolExecutor() as executor:
        for company_name, inn in companies_dict.items():
            result = await asyncio.get_event_loop().run_in_executor(executor, fns_scrape, inn)
            # print(f"Received result for {company_name}: {result}")
            results[company_name] = result

    for company_name, data in results.items():
        # print(data)
        reshaped_data = await reshape_company_data(company_name, data)
        reshaped_results.extend(reshaped_data)
        print(reshaped_results)
    return reshaped_results



test_data = {
    "Сибур": "7727547261","Русал": "7709329253", "Евраз": "7701225358"
}
#
#
# asyncio.run(process_company_data(test_data))
