from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import requests

# функция авторизации на ресурсах, закрытых аутентификацией.
# имулирует поведение пользователя и возвращает токен авторизации для дальнейшего использования в приложении
def login_to_wiki(username, password):
    # Настройка сервиса и опций для Chrome
    s = Service('../chromedriver/chromedriver.exe')
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    # Инициализация драйвера
    driver = webdriver.Chrome(service=s, options=options)
    print("WebDriver успешно инициализирован.")

    # Переход на страницу авторизации
    driver.get(
        "https://ru.wikipedia.org/w/index.php?returnto=%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F+%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0&title=%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:%D0%92%D1%85%D0%BE%D0%B4&centralAuthAutologinTried=1&centralAuthError=Not+centrally+logged+in")
    print("Страница входа загружена.")
    time.sleep(2)

    try:
        # Заполнение полей логина и пароля
        login_elem = driver.find_element(By.NAME, 'wpName')
        password_elem = driver.find_element(By.NAME, 'wpPassword')
        print("Элементы для ввода найдены.")
        login_elem.send_keys(username)
        password_elem.send_keys(password)
        print("Данные пользователя введены.")

        # Нажатие кнопки для входа
        continue_button = driver.find_element(By.NAME, 'wploginattempt')
        continue_button.click()
        print("Авторизация.")
        time.sleep(8)
        print("Авторизация успешна.")

        # Получение токена из куки
        cookies = driver.get_cookies()
        auth_token = None
        for cookie in cookies:
            if cookie['name'] == 'your_auth_cookie_name':  # указываем куку
                auth_token = cookie['value']
                break

        if auth_token:
            print(f"Token: {auth_token}")

            # Пример использования полученного токена далее в коде токена
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


# Пример использования функции:
login_to_wiki('username', 'password')
