from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import requests


def login_to_kommersant(username, password):
    s = Service('../chromedriver/chromedriver.exe')
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(service=s, options=options)
    print("WebDriver успешно инициализирован.")
    driver.get("https://www.kommersant.ru/lk/login?from=header")
    print("Страница входа загружена.")
    time.sleep(2)

    try:
        login_elem = driver.find_element(By.NAME, 'email')
        password_elem = driver.find_element(By.NAME, 'password')
        print("Элементы для ввода найдены.")
        login_elem.send_keys(username)
        password_elem.send_keys(password)
        print("Данные пользователя введены.")
        continue_button = driver.find_element(By.CSS_SELECTOR,
                                              '.ui-field.ui-button.ui-button--standart.ui-button--wide.au__button')
        continue_button.click()
        print("Авторизация.")
        time.sleep(8)
        print("Авторизация успешна.")

        cookies = driver.get_cookies()
        auth_token = None
        for cookie in cookies:
            if cookie['name'] == 'your_auth_cookie_name':
                auth_token = cookie['value']
                break

        if auth_token:
            print(f"Token: {auth_token}")
            headers = {
                'Authorization': f'Bearer {auth_token}',
            }
            response = requests.get("https://example.com/protected_resource", headers=headers)
            print(response.json())
        else:
            print("Токен не найден.")

    except Exception as e:
        print(f"Произошла ошибка: {e}")

    finally:
        driver.quit()
        print("Браузер закрыт.")


# Пример использования функции
login_to_kommersant('email', '1password')
