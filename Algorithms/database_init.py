from pymongo import MongoClient

client = MongoClient('mongodb://mongo:27017/')
db = client['myappsdb']
user_collection = db['users']
market_collection = db['market']
reports_collection = db['reports']
templates_collection = db['templates']


def initialize_database():
    existing_users = user_collection.count_documents({})
    existing_market_thematics = market_collection.count_documents({})

    if existing_users == 0:
        users = [
            {
                "user_id": 1,
                "username": "Alice",
                "password": "123",
                "verification": True,
                "trusted_sources": [
                    {
                        "title": "РБК",
                        "url": "https://www.rbc.ru",
                        "isDefault": True,
                        "authEnabled": False
                    },
                    {
                        "title": "Коммерсант",
                        "url": "https://www.kommersant.ru",
                        "isDefault": False,
                        "authEnabled": True,
                        "login": "Alice",
                        "password": "123"
                    }
                ],
                "thematics": [
                    {"id": "1", "value": "Металлургия", "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},
                    {"id": "4", "value": "Добыча полезных ископаемых", "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']}
                ]
            },
            {
                "user_id": 2,
                "username": "Bob",
                "password": "125",
                "verification": False,
                "trusted_sources": [],
                "thematics": []
            },
            {
                "user_id": 3,
                "username": "Tim",
                "password": "124",
                "verification": True,
                "trusted_sources": [
                    {"title": "РБК", "url": "https://www.rbc.ru", "isDefault": True, "authEnabled": False}
                ],
                "thematics": []
            },
            {
                "user_id": 4,
                "username": "Bob",
                "password": "125",
                "verification": True,
                "trusted_sources": [
                    {
                        "title": "РБК",
                        "url": "https://www.rbc.ru",
                        "isDefault": True,
                        "authEnabled": False
                    },
                    {
                        "title": "Коммерсант",
                        "url": "https://www.kommersant.ru",
                        "isDefault": False,
                        "authKommersEnabled": True,
                        "login": "Alice",
                        "password": "123"
                    }
                ],
                "thematics": [
                    {"id": "1", "value": "Металлургия", "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},
                    {"id": "2", "value": "Финансовый сектор", "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},
                    {"id": "4", "value": "Добыча полезных ископаемых", "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},
                    {"id": "5", "value": "Самолетостроение", "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']}
                ]
            },
        ]
        user_collection.insert_many(users)
        print("Database initialized with sample users.")
    else:
        print("Database already initialized.")

    if existing_market_thematics == 0:
        thematics = [
            {
                "id": "1",
                "value": "Металлургия",
                "niches": ["Черная металлургия", "Цветная металлургия"],
            },
            {
                "id": "2",
                "value": "Финансовый сектор",
                "niches": [
                    "Кредитный рынок",
                    "Валютный рынок",
                    "Рынок ценных бумаг",
                    "Рынок страхования",
                    "Рынок драгоценных металлов",
                ],
            },
            {
                "id": "3",
                "value": "Ювелирное производство",
                "niches": [],
            },
            {
                "id": "4",
                "value": "Добыча полезных ископаемых",
                "niches": [
                    "Нефть",
                    "Природный газ",
                    "Уголь",
                    "Апатиты",
                    "Калийные соли",
                    "Фосфориты",
                    "Алмазы",
                ],
            },
            {
                "id": "5",
                "value": "Информационные технологии",
                "niches": [
                    "ERP системы",
                    "Информационная безопасность",
                    "Веб-разработка",
                    "Мобильная разработка",
                    "Разработка игр",
                ],
            },
        ]
        market_collection.insert_many(thematics)
        print("Market thematics initialized.")
    else:
        print("Market already initialized.")