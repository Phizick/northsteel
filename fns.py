from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time


def fns_scrape(query):
    query = str(query)
    print(query)
    s = Service('Algorithms/chromedriver/chromedriver.exe')
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")

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

    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.TAG_NAME, "ins"))
    )

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

            next_cells = span.find_next_siblings('div', class_='tabulator-cell')
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

        keys_to_keep = ["Наименование", "Чистая прибыль (убыток)", "Валовая прибыь (убыток)", 'Баланс', 'Выручка']
        filtered_data = [item for item in results if any(key in keys_to_keep for key in item.keys())]
        print(filtered_data)
        print(link_url)
        return filtered_data, link_url

        # for item in results:
        #     print(item)
    except Exception as e:
        print(f"Произошла ошибка: {e}")
    finally:
        driver.quit()
        print("Браузер закрыт.")




fns_scrape("7708004767")
