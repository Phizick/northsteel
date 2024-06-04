import asyncio
import logging

from fastapi import FastAPI
from aiogram import Bot, Dispatcher
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.chat_action import ChatActionMiddleware
from Algorithms.Bot import config
from handlers import router

app = FastAPI()
bot = Bot(token=config.BOT_TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
dp.include_router(router)
dp.message.middleware(ChatActionMiddleware())


# dp.message.middleware.setup(ThrottlingMiddleware())

async def on_startup(dispatcher: Dispatcher):
    await bot.delete_webhook(drop_pending_updates=True)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(dp.start_polling(reset_webhook=True))
    logging.info("Bot has started")


@app.on_event("shutdown")
async def shutdown_event():
    await dp.storage.close()
    await dp.storage.wait_closed()
    await bot.session.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
