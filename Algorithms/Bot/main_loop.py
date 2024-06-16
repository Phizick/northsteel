import asyncio
import logging
from aiogram.client.bot import DefaultBotProperties
from aiogram import Bot, Dispatcher
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.chat_action import ChatActionMiddleware
from Algorithms.Bot import config
from Algorithms.Bot.handlers import router

# основной код тг-бота, использует те же алгоритмы что и основной клиент

logging.basicConfig(level=logging.INFO)


async def main_loop_func():
    bot = Bot(token=config.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)
    dp.message.middleware(ChatActionMiddleware())

    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


async def run_bot():
    while True:
        try:
            await main_loop_func()
        except Exception as e:
            logging.error(f"Бот упал с ошибкой: {e}")
            await asyncio.sleep(3)
