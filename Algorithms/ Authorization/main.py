from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

import time

s = Service('../chromedriver/chromedriver.exe')

options = Options()
options.add_argument("--headless")
driver = webdriver.Chrome(service=s)
print("WebDriver успешно инициализирован.")
driver.get("https://www.kommersant.ru/lk/login?from=header")
print("Страница входа загружена.")
time.sleep(2)

try:
    login_elem = driver.find_element(By.NAME, 'email')
    password_elem = driver.find_element(By.NAME, 'password')
    print("Элементы для ввода найдены.")
    login_elem.send_keys('deniskraevcc@gmail.com')
    password_elem.send_keys('123456789Aa!')
    print("Данные пользователя введены.")
    continue_button = driver.find_element(By.CSS_SELECTOR, '.ui-field.ui-button.ui-button--standart.ui-button--wide.au__button')
    continue_button.click()
    print("Авторизация.")
    time.sleep(8)
    print("Авторизация успешна.")

except Exception as e:
    print(f"Произошла ошибка: {e}")


driver.quit()
print("Браузер закрыт.")
