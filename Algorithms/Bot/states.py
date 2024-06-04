from aiogram.fsm.state import StatesGroup, State


class Gen(StatesGroup):
    waiting_for_simple_search_query = State()
    waiting_for_analytic_search_query = State()
    error_query = State()
