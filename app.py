import pymongo
from pydantic import BaseModel
import signal
import sys
from typing import List, Dict, Any
from pymongo import MongoClient
from Algorithms.Core.algorithm_hub import algorithm_hub_search
from Algorithms.Core.algorithm_nub_competitor import algorithm_hub_competitor
from Algorithms.Bot.main_loop import run_bot
# from Algorithms.database_init import initialize_database
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException, status, Request, Depends
from fastapi import FastAPI, HTTPException, Request, Depends, Path, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
import asyncio
import json
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# client = MongoClient('mongodb://mongo:27017/')
client = AsyncIOMotorClient('mongodb://mongo:27017')

db = client['myappsdb']
user_collection = db['users']
market_collection = db['market']
reports_collection = db['reports']
templates_collection = db['templates']


async def initialize_db():
    collection_names = await db.list_collection_names()
    if 'users' not in collection_names:
        await db.create_collection('users')
    if 'market' not in collection_names:
        await db.create_collection('market')
    if 'reports' not in collection_names:
        await db.create_collection('reports')
    if 'templates' not in collection_names:
        await db.create_collection('templates')


async def initialize_database():
    await initialize_db()
    existing_users = await user_collection.count_documents({})
    existing_market_thematics = await market_collection.count_documents({})

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
                    {"id": "1", "value": "Металлургия",
                     "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},
                    {"id": "4", "value": "Добыча полезных ископаемых",
                     "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']}
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
                    {"id": "1", "value": "Металлургия",
                     "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},
                    {"id": "2", "value": "Добыча полезных ископаемых",
                     "niches": ["Драйверы роста", 'Лидеры на рынке', 'Тренды в развитии']},

                ]
            },
        ]
        await user_collection.insert_many(users)
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
                "value": "Добыча полезных ископаемых",
                "niches": [
                    "Нефть",
                    "Уголь",
                ],
            },
        ]
        await market_collection.insert_many(thematics)
        print("Market thematics initialized.")
    else:
        print("Market already initialized.")


async def add_template_to_db(template: Dict[str, Any], owner_id: str) -> Dict[str, Any]:

    last_document = await templates_collection.find_one({}, sort=[("template_id", -1)])
    next_id = "1" if not last_document else str(int(last_document.get('template_id', "0")) + 1)

    template['template_id'] = next_id
    template['owner_id'] = owner_id
    await templates_collection.insert_one(template)

    return {"message": "Template added successfully", "template_id": next_id}


@app.post("/login")
async def auth(request: Request):
    data = await request.json()
    if not data:
        return JSONResponse(content={"error": "No data provided"}, status_code=status.HTTP_400_BAD_REQUEST)
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return JSONResponse(content={"error": "Username and password required"},
                            status_code=status.HTTP_400_BAD_expr)
    user = await user_collection.find_one({"username": username, "password": password})
    if user:
        return JSONResponse(content={"message": "Login successful", "user_id": str(user['user_id'])},
                            status_code=status.HTTP_200_OK)
    else:
        return JSONResponse(content={"error": "Invalid Credentials"}, status_code=status.HTTP_401_UNAUTHORIZED)


@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await user_collection.find_one({"user_id": user_id})
    if user is None:
        return JSONResponse(content={"error": "User not found"}, status_code=status.HTTP_404_NOT_FOUND)
    user.pop('_id', None)
    return JSONResponse(content=jsonable_encoder(user))


@app.patch("/users/{user_id}")
async def update_user(user_id: int, request: Request):
    data = await request.json()
    update_result = await user_collection.update_one({"user_id": user_id}, {'$set': data})

    if update_result.matched_count == 0:
        return JSONResponse(content={"error": "User not found"}, status_code=status.HTTP_404_NOT_FOUND)
    if update_result.modified_count == 0:
        return JSONResponse(content={"error": "No updates performed"}, status_code=status.HTTP_400_BAD_REQUEST)

    return JSONResponse(content={"message": "User updated."})


@app.get("/markets")
async def get_thematics():
    thematics = await market_collection.find({}, {'_id': 0}).to_list(None)
    return JSONResponse(content=jsonable_encoder(thematics))


@app.get("/marketreport")
async def fetch_market_report():
    try:
        indicator_data = db.indicator_data
        documents = await indicator_data.find({}, {"_id": 0}).to_list(None)
        return JSONResponse(content=jsonable_encoder(documents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")


@app.post("/reports")
async def post_reports(request: Request, owner_id: str):
    report_data = await request.json()
    report_data['owner_id'] = owner_id

    if 'type' not in report_data:
        raise HTTPException(status_code=400, detail="Field 'type' is required")

    if report_data['type'] == 'market':
        result = await algorithm_hub_search(report_data)
    elif report_data['type'] == 'competitor':
        result = await algorithm_hub_competitor(report_data)
    else:
        raise HTTPException(status_code=400, detail="Field 'type' must be either 'market' or 'competitor'")

    if isinstance(result, str):
        try:
            result = json.loads(result)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid JSON format returned from algorithm_hub")

    last_document = await reports_collection.find_one({}, sort=[("id", -1)])
    next_id = 1 if not last_document else last_document['id'] + 1

    result['id'] = next_id

    await reports_collection.insert_one(result)
    result.pop('_id', None)

    return result


@app.put("/reports/{report_id}")
async def update_report(request: Request, report_id: int):
    update_data = await request.json()

    if 'type' not in update_data:
        raise HTTPException(status_code=400, detail="Field 'type' is required")

    existing_report = await reports_collection.find_one({'id': report_id})
    if not existing_report:
        raise HTTPException(status_code=404, detail="Report not found")

    if update_data['type'] == 'market':
        result = await algorithm_hub_search(update_data)
    elif update_data['type'] == 'competitor':
        result = await algorithm_hub_competitor(update_data)
    else:
        raise HTTPException(status_code=400, detail="Field 'type' must be either 'market' or 'competitor'")

    if isinstance(result, str):
        try:
            result = json.loads(result)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid JSON format returned from algorithm_hub")

    result['id'] = report_id

    replace_result = await reports_collection.replace_one({'id': report_id}, result)
    if replace_result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update the report")

    updated_report = await reports_collection.find_one({'id': report_id})
    updated_report.pop('_id', None)

    return updated_report


@app.get("/reports/{report_id}", response_model=Dict[str, Any])
async def get_report(report_id: int = Path(..., description="The ID of the report to retrieve")):

    query = {"id": report_id}
    report = await reports_collection.find_one(query)

    if not report:
        raise HTTPException(status_code=404, detail="No report found")

    report.pop('_id', None)
    return report


@app.get("/reports/")
async def get_reports_by_owner(owner_id):
    cursor = reports_collection.find({"owner_id": owner_id}, {"_id": 0})
    documents = await cursor.to_list(length=None)

    if not documents:
        raise HTTPException(status_code=404, detail="No reports found for this owner")

    return documents


@app.patch("/reports/{report_id}")
async def update_report(report_id: int, request: Request):
    owner_id = request.query_params.get("owner_id")
    if not owner_id:
        return JSONResponse({"error": "Missing owner ID"}, status_code=400)

    update_data = await request.json()
    query = {"id": report_id, "owner_id": owner_id}

    updated_template = await reports_collection.update_one(query, {"$set": update_data})
    if updated_template.matched_count == 0:
        return JSONResponse({"message": "No template found or access denied"}, status_code=404)

    return JSONResponse({"message": "Template updated successfully"})


@app.get("/reports")
async def get_reports(owner_not):
    if not owner_not:
        raise HTTPException(status_code=400, detail="Missing owner_not parameter")

    query = {"owner_id": {"$ne": owner_not}}
    reports = await reports_collection.find(query, {"_id": 0}).to_list(None)

    if not reports:
        raise HTTPException(status_code=404, detail="No reports available")

    return reports


@app.get("/report", response_model=List[dict])
async def get_reports_owner(owner: str):
    if not owner:
        raise HTTPException(status_code=400, detail="Missing 'owner' parameter")

    query = {"owner_id": owner}
    reports = await reports_collection.find(query, {"_id": 0}).to_list(None)

    if not reports:
        raise HTTPException(status_code=404, detail="No reports available for this owner")

    return reports


@app.patch("/report/{report_id}/update")
async def update_specific_report(request: Request, report_id, owner_id):
    if not owner_id:
        raise HTTPException(status_code=400, detail="Invalid owner ID or not provided")

    update_data = await request.json()

    query = {"id": report_id, "owner_id": owner_id}
    result = await reports_collection.update_one(query, {"$set": update_data})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="No report found or access denied")

    if result.modified_count == 0:
        return {"message": "Report data is the same as provided data"}

    return {"message": "Report updated successfully"}



@app.delete("/reports/{report_id}")
async def delete_report(report_id, owner_id):
    if not owner_id:
        raise HTTPException(status_code=400, detail="Missing owner ID")

    result = await reports_collection.delete_one({"id": report_id, "owner_id": owner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No report found or access denied")

    return {"message": "Report deleted successfully"}


@app.post("/templates/")
async def post_templates(
        template: Dict[str, Any],
        owner_id: str = Query(..., description="Owner ID")
):

    last_document = await templates_collection.find_one({}, sort=[("template_id", -1)])
    next_id = "1" if not last_document else str(int(last_document.get('template_id', "0")) + 1)

    template['template_id'] = next_id
    template['owner_id'] = owner_id

    await templates_collection.insert_one(template)

    return {"message": "Template added successfully", "template_id": next_id}


@app.patch("/templates/{template_id}")
async def update_template(template_id: str, request: Request):
    owner_id = request.query_params.get("owner_id")
    if not owner_id:
        return JSONResponse({"error": "Missing owner ID"}, status_code=400)

    update_data = await request.json()
    query = {"template_id": template_id, "owner_id": owner_id}

    updated_template = await templates_collection.update_one(query, {"$set": update_data})
    if updated_template.matched_count == 0:
        return JSONResponse({"message": "No template found or access denied"}, status_code=404)

    return JSONResponse({"message": "Template updated successfully"})


@app.delete("/templates/{template_id}")
async def delete_template(template_id: str, request: Request):
    owner_id = request.query_params.get("owner_id")
    if not owner_id:
        return JSONResponse({"error": "Missing owner ID"}, status_code=400)

    query = {"template_id": template_id, "owner_id": owner_id}
    result = await templates_collection.delete_one(query)
    if result.deleted_count == 0:
        return JSONResponse({"message": "No template found or access denied"}, status_code=404)

    return JSONResponse({"message": "Template deleted successfully"})


@app.get("/templates")
async def get_templates():
    templates_cursor = templates_collection.find({}, {'_id': 0})
    templates = await templates_cursor.to_list(None)

    for template in templates:
        template.pop('_id', None)

    return templates


@app.get("/reset")
async def reset_database():
    try:
        await reports_collection.delete_many({})
        await templates_collection.delete_many({})
        return {"success": True, "message": "Database has been reset successfully"}
    except PyMongoError as e:
        # Log the exception details here if necessary
        return JSONResponse({"success": False, "message": f"Database error: {str(e)}"}, status_code=500)
    except Exception as ex:
        # This would catch other unexpected errors
        return JSONResponse({"success": False, "message": f"An unexpected error occurred: {str(ex)}"}, status_code=500)


@app.get("/init_db")
async def init_db_route():
    message = await initialize_database()
    return {"message": message}


async def main():
    # bot_loop = asyncio.create_task(run_bot())
    uvicorn_server = uvicorn.Server(uvicorn.Config("app:app", host="0.0.0.0", port=5000, log_level="debug"))
    api_loop = asyncio.create_task(uvicorn_server.serve())
    await asyncio.gather( api_loop)


if __name__ == '__main__':
    asyncio.run(main())
