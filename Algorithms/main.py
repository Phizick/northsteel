import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from Algorithms.Bot import config
from Algorithms.Bot.handlers import router
from Algorithms.Core.search_func import search
from fastapi import FastAPI
import uvicorn

logging.basicConfig(level=logging.INFO)

app = FastAPI()


@app.get("/")
async def root(query: str):
    reply = await search(query)
    return {"message": reply}


async def main_loop():
    properties = DefaultBotProperties(parse_mode=ParseMode.HTML)
    bot = Bot(token=config.BOT_TOKEN, default=properties)
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


async def run_bot():
    while True:
        try:
            await main_loop()
        except Exception as e:
            logging.error(f"Бот упал с ошибкой: {e}")
            await asyncio.sleep(3)


async def start():
    bot_task = asyncio.create_task(run_bot())
    config = uvicorn.Config(app=app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await asyncio.gather(bot_task, server.serve())

if __name__ == "__main__":
    asyncio.run(start())
