import re


def contains_cyrillic(text_message):
    return bool(re.match('^[а-яёА-ЯЁ0-9 .,!?-]*$', text_message))