from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException



from bs4 import BeautifulSoup
import time

def fix_values(data):
    for item in data:
        for key, value in item.items():
            if isinstance(value, dict):
                for sub_key, sub_value in value.items():
                    if sub_key == 'На 31.12.2023' or sub_key == 'На 31.12.2022' or sub_key == 'На 31.12.2021':
                        if '(' in sub_value or ')' in sub_value:
                            open_bracket_index = sub_value.index('(')
                            close_bracket_index = sub_value.index(')')
                            money_value = '-' + sub_value[open_bracket_index+1:close_bracket_index]
                            value[sub_key] = money_value
    return data


def fns_for_one_scrape(query):
    query = str(query)
    print(query)
    # s = Service('../chromedriver/chromedriver.exe')
    s = Service(executable_path='/usr/local/bin/chromedriver')
    options = Options()
    options.headless = True
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    # options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--disable-gpu")
    # options.add_argument("--window-size=1920x1080")
    # options.add_argument("--remote-debugging-port=9222")
    # options.add_argument("--disable-extensions")
    # options.add_argument("--disable-software-rasterizer")
    # options.add_argument("--disable-setuid-sandbox")
    # options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--no-first-run")
    # options.add_argument("--no-default-browser-check")
    # options.add_argument("--disable-background-networking")
    # options.add_argument("--disable-sync")

    driver = webdriver.Chrome(service=s, options=options)
    print("WebDriver успешно инициализирован.")

    driver.get("https://bo.nalog.ru/")
    print("Страница ФНС загружена.")
    time.sleep(3)

    search_box = driver.find_element(By.ID, "search")
    search_box.clear()
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)

    print("Запрос отправлен.")

    try:
        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.TAG_NAME, "ins")))
    except TimeoutException:
        print("Элемент с тегом <ins> не найден.")
        return [], None

    ins_elements = driver.find_elements(By.TAG_NAME, "ins")
    for element in ins_elements:
        if element.text == query:
            ancestor_link = element.find_element(By.XPATH, "./ancestor::a")
            link_url = ancestor_link.get_attribute('href')

            # full_url = "https://bo.nalog.ru" + link_url
            driver.get(link_url)
            print("Переход по URL выполнен.")
            break

    time.sleep(3)

    div_selector = "div.grid-reports-item"
    report_div = WebDriverWait(driver, 3).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, div_selector))
    )

    driver.execute_script("arguments[0].classList.add('is-open');", report_div)

    print("Класс 'is-open' добавлен к элементу.")

    time.sleep(2)
    try:
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        titles = soup.find_all('div', class_='sticker__title')
        contents = soup.find_all('div', class_='sticker__content')
        column_titles = [div.text.strip() for div in soup.find_all('div', class_='tabulator-col-title')]

        results = []
        for title, content in zip(titles, contents):
            results.append({title.text.strip(): content.text.strip()})

        spans = soup.find_all('div', class_='tabulator-cell tabulator-frozen tabulator-frozen-left')
        first_pass = True
        year_keys = []

        for span in spans:
            key = span.text.strip()

            next_cells = span.find_next_siblings('div', class_='tabulator-cell', recursive=False)

            cell_count = len(next_cells)

            if cell_count >= 4:
                if first_pass:
                    year_keys = [column_titles[2], column_titles[3], column_titles[4]]
                    first_pass = False

                results.append({
                    key: {
                        year_keys[0]: next_cells[1].text.strip(),
                        year_keys[1]: next_cells[2].text.strip(),
                        year_keys[2]: next_cells[3].text.strip()
                    }
                })
            elif cell_count == 3:
                if first_pass:
                    year_keys = [column_titles[2], column_titles[3]]
                    first_pass = False

                results.append({
                    key: {
                        year_keys[0]: next_cells[1].text.strip(),
                        year_keys[1]: next_cells[2].text.strip()
                    }
                })
            else:
                print(f"Недостаточно данных для {key}")
        print("Результаты: ")

        keys_to_keep = ['Баланс', 'Выручка', 'Валовая прибыль (убыток)', 'Прибыль (убыток) от продаж',
                        'Чистая прибыль (убыток)', 'Заемные средства', 'Совокупный финансовый результат периода']
        filtered_data = [item for item in results if any(key in keys_to_keep for key in item.keys())]
        print(filtered_data)
        print('--------------------')
        fixed_data = fix_values(filtered_data)
        print(fixed_data)
        return fixed_data, link_url

        # for item in results:
        #     print(item)
    except Exception as e:
        print(f"Произошла ошибка: {e}")
    finally:
        driver.quit()
        print("Браузер закрыт.")


# fns_for_one_scrape("7736050003")
