from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

# функция для прохождения авторизации на сайтах, требующих эту процедуру
# эмулирует поведение пользователя на сайте
# для наглядности выбрана википедия

def login_to_site(username, password):
    s = Service('../chromedriver/chromedriver.exe')

    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(service=s)
    print("WebDriver успешно инициализирован.")
    driver.get("https://ru.wikipedia.org/w/index.php?returnto=%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F+%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0&title=%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:%D0%92%D1%85%D0%BE%D0%B4&centralAuthAutologinTried=1&centralAuthError=Not+centrally+logged+in")
    print("Страница входа загружена.")
    time.sleep(2)

    try:
        login_elem = driver.find_element(By.NAME, 'wpName')
        password_elem = driver.find_element(By.NAME, 'wpPassword')
        print("Элементы для ввода найдены.")
        login_elem.send_keys(username)
        password_elem.send_keys(password)
        print("Данные пользователя введены.")
        continue_button = driver.find_element(By.NAME, 'wploginattempt')
        continue_button.click()
        print("Авторизация.")
        time.sleep(8)
        print("Авторизация успешна.")

    except Exception as e:
        print(f"Произошла ошибка: {e}")

    driver.quit()
    print("Браузер закрыт.")

# Пример использования функции:
login_to_site('лцт24', '123456789!')
