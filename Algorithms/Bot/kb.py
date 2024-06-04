from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup
menu = [
    [InlineKeyboardButton(text="Простой поиск", callback_data="simple_search"),
    InlineKeyboardButton(text="Поиск с анализом", callback_data="analytic_search")],
    [InlineKeyboardButton(text="Что умеет", callback_data="about_kevin"),
    InlineKeyboardButton(text="Профиль", callback_data="user_profile")],
    [InlineKeyboardButton(text="Шаблоны", callback_data="ref"),
    InlineKeyboardButton(text="Сообщить об ошибке", callback_data="bug_report")],
    [InlineKeyboardButton(text="Помощь", callback_data="help")]
]
menu = InlineKeyboardMarkup(inline_keyboard=menu)


exit_kb = ReplyKeyboardMarkup(keyboard=[[KeyboardButton(text="◀️ Выйти в меню")]], resize_keyboard=True)
iexit_kb = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="◀️ Выйти в меню", callback_data="menu")]])

