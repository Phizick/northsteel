from aiogram import Bot, Router, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Message
from aiogram import F
from Algorithms.Bot.contains_cyrillic import contains_cyrillic
from aiogram.enums.parse_mode import ParseMode
from aiogram.filters import Command
from Algorithms.Core.send_message_to_neural_deep_tech import send_message_to_neural_deep_tech
from Algorithms.Bot.states import Gen
from asyncio.exceptions import TimeoutError
from Algorithms.Core.filter_array import key_for_comp
import html
from Algorithms.Bot import kb
from Algorithms.Bot import text
from Algorithms.Bot import config
import asyncio
from Algorithms.Core.search_func import search

import sys
sys.path.append('C:/Users/KDFX Modes/Documents/GitHub/northsteel')


active_requests = {}
bot = Bot(token=config.BOT_TOKEN)
storage = MemoryStorage()

router = Router()

# хендлеры бота. начинают работу и обрабатывают поисковые запросы

@router.message(Command("start"))
async def start_handler(msg: Message):
    user_name = msg.from_user.first_name
    greet_with_name = text.mock_text.format(name=user_name)
    await bot.send_message(chat_id=msg.chat.id, text=greet_with_name)


@router.message(Command("search"))
async def enter_analytic_search(message: types.Message, state: FSMContext):
    await message.answer(text.search_text)
    await state.set_state(Gen.waiting_for_analytic_search_query)


@router.callback_query(F.data == "search")
async def analytic_search_data(callback_query: types.CallbackQuery, state: FSMContext):
    await callback_query.message.answer("<blockquote>" + html.escape(text.search_text) + "</blockquote>",
                                        parse_mode=ParseMode.HTML)
    await callback_query.answer()
    await state.set_state(Gen.waiting_for_analytic_search_query)


@router.message()
async def process_search_query(message: types.Message, state: FSMContext):
    user_id = message.from_user.id

    active_requests[user_id] = True
    search_query = message.text.lower()
    search_query_str = str(search_query)

    if not contains_cyrillic(search_query_str):
        await message.reply("Пожалуйста, отправь сообщение на русском языке.")
        del active_requests[user_id]
        return

    search_data = await search(search_query, key_for_comp, 7000)
    try:
        search_result = await asyncio.wait_for(send_message_to_neural_deep_tech(search_data), timeout=30)
        await message.reply(
            "Результаты поиска: " + "<blockquote>" + html.escape(search_result) + "</blockquote>",
            parse_mode=ParseMode.HTML,
            reply_markup=kb.menu
        )
    except TimeoutError:
        await message.reply("Извини, поиск занял слишком много времени. Пожалуйста, попробуй другой запрос.")
    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")
        await message.reply(text.search_text)
    finally:
        await state.clear()
        del active_requests[user_id]






















