import pymongo
from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from Algorithms.Core.algorithm_hub import algorithm_hub
from Algorithms.Bot.main_loop import run_bot
# from Algorithms.database_init import initialize_database
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
import asyncio
import json

app = Flask(__name__)
CORS(app)

# client = MongoClient('mongodb://mongo:27017/')
client = MongoClient("mongodb://localhost:27017")
db = client['myappsdb']
user_collection = db['users']
market_collection = db['market']
reports_collection = db['reports']
templates_collection = db['templates']


def initialize_db():
    collection_names = db.list_collection_names()
    if 'users' not in collection_names:
        db.create_collection('users')
    if 'market' not in collection_names:
        db.create_collection('market')
    if 'reports' not in collection_names:
        db.create_collection('reports')
    if 'templates' not in collection_names:
        db.create_collection('templates')


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


@app.route('/login', methods=['POST'])
def auth():
    data = request.get_json()
    if not data:
        return make_response(jsonify({"error": "No data provided"}), 400)
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return make_response(jsonify({"error": "Username and password required"}), 400)

    user = user_collection.find_one({"username": username, "password": password})
    if user:
        return jsonify({"message": "Login successful", "user_id": str(user['user_id'])}), 200
    else:
        return jsonify({"error": "Invalid Credentials"}), 401


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = user_collection.find_one({"user_id": user_id})
    if user is None:
        return jsonify({"error": "User not found"}), 404
    user.pop('_id', None)
    return jsonify(user)


@app.route('/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    data = request.json
    update_result = user_collection.update_one({"user_id": user_id}, {'$set': data})

    if update_result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    if update_result.modified_count == 0:
        return jsonify({"error": "No updates performed."}), 400

    return jsonify({"message": "User updated."})


@app.route('/markets', methods=['GET'])
def get_thematics():
    thematics = list(market_collection.find({}, {'_id': 0}))
    return jsonify(thematics)


@app.route('/marketreport', methods=['GET'])
def fetch_market_report():
    try:
        indicator_data = db['indicator_data']
        documents = list(indicator_data.find({}, {'_id': 0}))
        return jsonify(documents)
    except Exception as e:
        return make_response(jsonify({"error": f"An error occurred: {str(e)}"}), 400)


@app.route('/reports', methods=['POST'])
def post_reports():
    if request.is_json:
        data = request.get_json()
        result = asyncio.run(algorithm_hub(data))
        if isinstance(result, str):
            try:
                result = json.loads(result)
            except json.JSONDecodeError:
                return jsonify({"error": "Invalid JSON format returned from algorithm_hub"}), 500

        last_document = reports_collection.find_one(sort=[("id", pymongo.DESCENDING)])

        next_id = "1" if last_document is None else str(int(last_document['id']) + 1)
        result['id'] = next_id

        reports_collection.insert_one(result)
        result.pop('_id', None)

        return result
    else:

        return jsonify({"error": "Invalid data format, JSON expected"}), 400


@app.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"error": "Missing owner ID"}), 400

    query = {"id": report_id, "owner_id": owner_id}
    report = reports_collection.find_one(query)
    if not report:
        return jsonify({"message": "No report found or access denied"}), 404

    if '_id' in report:
        report.pop('_id', None)

    return jsonify(report)


@app.route('/reports/<report_id>', methods=['PATCH'])
def update_report(report_id):
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"error": "Missing owner ID"}), 400

    update_data = request.json
    query = {"id": report_id, "owner_id": owner_id}

    updated_report = reports_collection.update_one(query, {"$set": update_data})
    if updated_report.matched_count == 0:
        return jsonify({"message": "No report found or access denied"}), 404

    return jsonify({"message": "Report updated successfully"})


@app.route('/reports', methods=['GET'])
def get_reports():
    owner_not = request.args.get('owner_not')
    if not owner_not:
        return jsonify({"error": "Missing owner_not parameter"}), 400
    query = {"owner_id": {"$ne": owner_not}}
    reports = reports_collection.find(query)

    reports_list = []
    for report in reports:
        if '_id' in report:
            report.pop('_id', None)
        reports_list.append(report)

    if not reports_list:
        return jsonify({"message": "No reports available"}), 404

    return jsonify(reports_list)


@app.route('/report/<report_id>/update', methods=['PATCH'])
def update_specific_report(report_id):
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"error": "Missing owner ID"}), 400

    update_data = request.get_json()
    if not update_data:
        return jsonify({"error": "No data provided"}), 400

    query = {"id": report_id, "owner_id": owner_id}

    try:
        updated_report = reports_collection.update_one(query, {"$set": update_data})
    except Exception as e:
        return jsonify({"error": "Failed to update the report", "details": str(e)}), 500

    if updated_report.matched_count == 0:
        return jsonify({"message": "No report found or access denied"}), 404

    if updated_report.modified_count == 0:
        return jsonify({"message": "Report data is the same as provided data"}), 200

    return jsonify({"message": "Report updated successfully"}), 200


@app.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"error": "Missing owner ID"}), 400

    query = {"id": report_id, "owner_id": owner_id}
    result = reports_collection.delete_one(query)
    if result.deleted_count == 0:
        return jsonify({"message": "No report found or access denied"}), 404

    return jsonify({"message": "Report deleted successfully"})


@app.route('/templates/<template_id>', methods=['POST'])
def get_template(template_id):
    data = request.json
    if data is None or 'owner_id' not in data:
        return jsonify({"error": "Missing owner ID in request body"}), 400
    owner_id = data['owner_id']

    query = {"id": template_id, "owner_id": owner_id}
    report = templates_collection.find_one(query, {'_id': 0})
    if not report:
        return jsonify({"message": "No report found or access denied"}), 404

    return jsonify(report)


@app.route('/templates/<template_id>', methods=['PATCH'])
def update_template(template_id):
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"error": "Missing owner ID"}), 400

    update_data = request.json
    query = {"id": template_id, "owner_id": owner_id}

    updated_report = templates_collection.update_one(query, {"$set": update_data})
    if updated_report.matched_count == 0:
        return jsonify({"message": "No report found or access denied"}), 404

    return jsonify({"message": "Report updated successfully"})


@app.route('/templates/<template_id>', methods=['DELETE'])
def delete_template(template_id):
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"error": "Missing owner ID"}), 400

    query = {"id": template_id, "owner_id": owner_id}
    result = templates_collection.delete_one(query)
    if result.deleted_count == 0:
        return jsonify({"message": "No report found or access denied"}), 404

    return jsonify({"message": "Report deleted successfully"})


@app.route('/templates', methods=['GET'])
def get_templates():
    templates = list(templates_collection.find({}, {'_id': 0}))
    return jsonify(templates)


@app.route('/init_db', methods=['GET'])
def init_db_route():
    initialize_database()
    return "Database initialization route called."


@app.route('/reset', methods=['GET'])
def reset_database():
    try:
        user_collection.delete_many({})
        market_collection.delete_many({})
        reports_collection.delete_many({})
        templates_collection.delete_many({})

        return jsonify({'success': True, 'message': 'Database has been reset successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


def run_flask_app():
    app.run(debug=True, host='0.0.0.0')


def run_async_code():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run_bot())
    loop.close()


if __name__ == '__main__':
    initialize_db()
    executor = ThreadPoolExecutor()
    flask_future = executor.submit(run_flask_app)
    asyncio_future = executor.submit(run_async_code)


