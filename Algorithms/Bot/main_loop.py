import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.chat_action import ChatActionMiddleware
import config
from handlers import router

logging.basicConfig(level=logging.INFO)


async def main_loop():
    bot = Bot(token=config.BOT_TOKEN, parse_mode=ParseMode.HTML)
    dp = Dispatcher(bot, storage=MemoryStorage())

    dp.include_router(router)
    dp.message.middleware(ChatActionMiddleware())
    # dp.message.middleware.setup(ThrottlingMiddleware())

    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


async def run_bot():
    while True:
        try:
            await main_loop()
        except Exception as e:
            logging.error(f"Бот упал с ошибкой: {e}")
            await asyncio.sleep(3)


# if __name__ == "__main__":
#
#     asyncio.run(run_bot())
