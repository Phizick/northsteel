from aiogram import Bot, Router, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Message
from aiogram import F
# from contains_cyrillic import contains_cyrillic
from aiogram.enums.parse_mode import ParseMode
from aiogram.filters import Command
from Algorithms.Core.search_func import search
from Algorithms.Core.neural_deep_search_func import neural_deep_search
from Algorithms.Bot.states import Gen
from pymongo import MongoClient
# from telegram import ParseMode

# from input_filter import check_phrase
from asyncio.exceptions import TimeoutError

import datetime
import html
from Algorithms.Bot import kb
from Algorithms.Bot import text
from Algorithms.Bot import config
import asyncio



import sys
sys.path.append('C:/Users/KDFX Modes/Documents/GitHub/northsteel')


client = MongoClient('localhost', 27017)
db = client['Kevin']
collection = db['Requests']
error_collection = db['Errors']
users = db['Users']
survey_collection = db['Survey']
active_requests = {}
bot = Bot(token=config.BOT_TOKEN)
storage = MemoryStorage()

router = Router()


@router.message(Command("start"))
async def start_handler(msg: Message):
    user_id = msg.from_user.id
    user_name = msg.from_user.first_name
    greet_with_name = text.mock_text.format(name=user_name)

    user = users.find_one({"user_id": user_id})

    if not user:
        users.insert_one({
            "user_id": user_id,
            "first_name": user_name,
            "SSTokens": 6,
            "ASTokens": 3
        })
    else:
        users.update_one(
            {"user_id": user_id},
            {"$set": {"first_name": user_name}}
        )

    await bot.send_photo(chat_id=msg.chat.id,
                         caption=greet_with_name,
                         reply_markup=kb.menu)


@router.message(Command("about_kevin"))
async def enter_about_kevin(message: types.Message):
    await message.answer_photo(caption=text.mock_text,

                               reply_markup=kb.menu)


@router.callback_query(F.data == "about_kevin")
async def about_kevin_data(callback_query: types.CallbackQuery):
    await callback_query.message.answer_photo(caption=text.mock_text,

                                              reply_markup=kb.menu)
    await callback_query.answer()


@router.message(Command("bug_report"))
async def enter_error_report(message: types.Message, state: FSMContext):
    await message.answer(text.mock_text)
    await state.set_state(Gen.error_query)


@router.callback_query(F.data == "bug_report")
async def error_report_data(callback_query: types.CallbackQuery, state: FSMContext):
    await callback_query.message.answer(text.mock_text)
    await callback_query.answer()
    await state.set_state(Gen.error_query)


@router.message(Command("help"))
async def enter_kevin_help(message: types.Message):
    await message.answer_photo(caption=text.mock_text,

                               reply_markup=kb.menu)


@router.callback_query(F.data == "help")
async def kevin_help_data(callback_query: types.CallbackQuery):
    await callback_query.message.answer_photo(caption=text.mock_text,

                                              reply_markup=kb.menu)
    await callback_query.answer()


@router.message(Command("simple_search"))
async def enter_simple_search(message: types.Message, state: FSMContext):
    await message.answer(text.mock_text)
    await state.set_state(Gen.waiting_for_simple_search_query)


@router.callback_query(F.data == "simple_search")
async def simple_search_data(callback_query: types.CallbackQuery, state: FSMContext):
    await callback_query.message.answer("<blockquote>" + html.escape(text.mock_text) + "</blockquote>",
                                        parse_mode=ParseMode.HTML)
    await callback_query.answer()
    await state.set_state(Gen.waiting_for_simple_search_query)


@router.message(Command("analytic_search"))
async def enter_analytic_search(message: types.Message, state: FSMContext):
    await message.answer(text.mock_text)
    await state.set_state(Gen.waiting_for_analytic_search_query)


@router.callback_query(F.data == "analytic_search")
async def analytic_search_data(callback_query: types.CallbackQuery, state: FSMContext):
    await callback_query.message.answer("<blockquote>" + html.escape(text.mock_text) + "</blockquote>",
                                        parse_mode=ParseMode.HTML)
    await callback_query.answer()
    await state.set_state(Gen.waiting_for_analytic_search_query)


@router.message()
async def process_search_query(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user_doc = users.find_one({'user_id': user_id}) or {}

    if user_id in active_requests:
        await message.answer(text.mock_text)
        return

    active_requests[user_id] = True

    current_state = await state.get_state()
    search_query = message.text.lower()

    if current_state == Gen.error_query.state:
        error_report = search_query
        current_time = datetime.datetime.now().isoformat()
        error_collection.insert_one({
            "user_id": user_id,
            "error_report": error_report,
            "date": current_time
        })
        await message.answer("Твой отчет об ошибке был успешно отправлен. Спасибо!")
        await state.clear()
        del active_requests[user_id]
        return

    # if not check_phrase(
    #         search_query):
    #     await message.reply(
    #         text.mock_text)
    #     del active_requests[user_id]
    #     await state.clear()
    #     return

    user_collection_name = f"user_{user_id}"
    user_collection = db[user_collection_name]

    user_info_base = {
        'user_id': user_id,
        'user_name': message.from_user.full_name,
        'message_id': message.message_id,
        'question': search_query,
        'date': message.date.isoformat(),
    }

    search_query_str = str(search_query)

    # if not contains_cyrillic(search_query_str):
    #     await message.reply("Пожалуйста, отправь сообщение на русском языке.")
    #     del active_requests[user_id]
    #     return

    search_functions = {
        Gen.waiting_for_simple_search_query.state: search,
        Gen.waiting_for_analytic_search_query.state: neural_deep_search
    }

    message_responses = {
        Gen.waiting_for_simple_search_query.state: "Результаты поиска: ",
        Gen.waiting_for_analytic_search_query.state: "Результаты поиска: ",
        Gen.error_query.state: "Спасибо за обратную связь"
    }

    token_field = "SSTokens" if current_state == Gen.waiting_for_simple_search_query.state else "ASTokens"
    if user_doc.get(token_field, 0) <= 0:
        await message.reply("К сожалению, твои токены были истрачены.")
        await state.clear()
        del active_requests[user_id]
        return

    search_function = search if current_state == Gen.waiting_for_simple_search_query.state else neural_deep_search
    try:
        search_result = await asyncio.wait_for(search_function(search_query), timeout=30)
        users.update_one({'user_id': user_id}, {'$inc': {token_field: -1}})
        user_info = {**user_info_base, 'answer': search_result}
        user_collection.insert_one(user_info)
        await message.reply(
            "Результаты поиска: " + "<blockquote>" + html.escape(search_result) + "</blockquote>",
            parse_mode=ParseMode.HTML,
            reply_markup=kb.menu
        )
    except TimeoutError:
        await message.reply("Извини, поиск занял слишком много времени. Пожалуйста, попробуй другой запрос.")
    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")
        await message.reply(text.mock_text)
    finally:
        await state.clear()
        del active_requests[user_id]






















