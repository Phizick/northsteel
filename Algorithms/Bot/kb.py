from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup
menu = [
    [InlineKeyboardButton(text="Общая информация о компании", callback_data="simple_search"),
    InlineKeyboardButton(text="Детальная информация о компании", callback_data="analytic_search")]
]
menu = InlineKeyboardMarkup(inline_keyboard=menu)


exit_kb = ReplyKeyboardMarkup(keyboard=[[KeyboardButton(text="◀️ Выйти в меню")]], resize_keyboard=True)
iexit_kb = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="◀️ Выйти в меню", callback_data="menu")]])

