import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
    CallbackQueryHandler,
)
from aiohttp import web
import asyncio
import json

from config import BOT_TOKEN, WEB_HOST, WEB_PORT, WEBHOOK_URL

# Настройка логирования
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Глобальные переменные для HTTP сервера
http_app = web.Application()
routes = web.RouteTableDef()


class TelegramBot:
    def __init__(self):
        self.application = Application.builder().token(BOT_TOKEN).build()
        self.setup_handlers()

    def setup_handlers(self):
        """Настройка обработчиков команд"""
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(CommandHandler("menu", self.menu_command))
        self.application.add_handler(CallbackQueryHandler(self.button_handler))
        self.application.add_handler(
            MessageHandler(filters.StatusUpdate.WEB_APP_DATA, self.handle_web_app_data)
        )
        self.application.add_handler(
            MessageHandler(filters.TEXT & ~filters.COMMAND, self.echo_message)
        )

    async def start_command(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Обработчик команды /start"""
        user = update.effective_user
        keyboard = [
            [
                InlineKeyboardButton(
                    "📱 Открыть Mini App",
                    web_app={"url": f"http://{WEB_HOST}:{WEB_PORT}/webapp/"},
                )
            ],
            [
                InlineKeyboardButton("ℹ️ Помощь", callback_data="help"),
                InlineKeyboardButton("⚙️ Настройки", callback_data="settings"),
            ],
            [InlineKeyboardButton("👤 Профиль", callback_data="profile")],
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_html(
            rf"Привет {user.mention_html()}! 👋", reply_markup=reply_markup
        )

    async def help_command(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Обработчик команды /help"""
        help_text = """
🤖 *Доступные команды:*

/start - Запустить бота
/menu - Показать меню
/help - Получить помощь

📱 *Mini App функции:*
- Открыть мини-приложение
- Получить данные пользователя
- Взаимодействовать с ботом

⚡ *Бот умеет:*
- Отвечать на сообщения
- Работать с мини-приложением
- Показывать различные меню
        """
        await update.message.reply_text(help_text, parse_mode="Markdown")

    async def menu_command(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Обработчик команды /menu"""
        keyboard = [
            [
                InlineKeyboardButton("🎮 Игры", callback_data="games"),
                InlineKeyboardButton("📊 Статистика", callback_data="stats"),
            ],
            [
                InlineKeyboardButton("🛠️ Инструменты", callback_data="tools"),
                InlineKeyboardButton("🌐 Mini App", callback_data="webapp"),
            ],
            [InlineKeyboardButton("🔙 Назад", callback_data="back")],
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(
            "🏠 *Главное меню:*", reply_markup=reply_markup, parse_mode="Markdown"
        )

    async def button_handler(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Обработчик нажатий на кнопки"""
        query = update.callback_query
        await query.answer()

        data = query.data
        user = query.from_user

        if data == "help":
            await query.edit_message_text(
                text="📚 *Помощь по боту:*\n\nИспользуйте команды или кнопки для навигации.",
                parse_mode="Markdown",
            )
        elif data == "settings":
            await query.edit_message_text(
                text="⚙️ *Настройки:*\n\nЗдесь будут настройки бота...",
                parse_mode="Markdown",
            )
        elif data == "profile":
            await query.edit_message_text(
                text=f"👤 *Ваш профиль:*\n\nID: `{user.id}`\nИмя: {user.first_name}\nUsername: @{user.username or 'не указан'}",
                parse_mode="Markdown",
            )
        elif data == "webapp":
            keyboard = [
                [
                    InlineKeyboardButton(
                        "📱 Открыть Mini App",
                        web_app={"url": f"http://{WEB_HOST}:{WEB_PORT}/webapp/"},
                    )
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(
                text="🌐 *Mini App:*\n\nНажмите кнопку ниже чтобы открыть мини-приложение:",
                reply_markup=reply_markup,
                parse_mode="Markdown",
            )
        elif data == "back":
            await self.start_command(update, context)
        else:
            await query.edit_message_text(
                text=f"Вы выбрали: {data}", parse_mode="Markdown"
            )

    async def handle_web_app_data(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Обработка данных из мини-приложения"""
        data = json.loads(update.message.web_app_data.data)
        user_id = data.get("user_id")
        action = data.get("action")

        response_text = f"""
✅ *Данные получены из Mini App!*

👤 User ID: `{user_id}`
📝 Action: `{action}`
⏰ Time: `{data.get('timestamp')}`
📦 Text: `{data.get('text', 'Нет текста')}`
        """

        await update.message.reply_text(response_text, parse_mode="Markdown")

    async def echo_message(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Эхо-ответ на текстовые сообщения"""
        user_text = update.message.text
        await update.message.reply_text(
            f"🔁 Вы сказали: {user_text}\n\nИспользуйте /menu для навигации"
        )

    async def run_http_server(self):
        """Запуск HTTP сервера для статики"""
        # Добавляем статические файлы
        http_app.router.add_static("/webapp/", path="./webapp/", show_index=True)
        http_app.router.add_get("/", self.handle_root)

        runner = web.AppRunner(http_app)
        await runner.setup()
        site = web.TCPSite(runner, WEB_HOST, WEB_PORT)
        await site.start()
        logger.info(f"HTTP сервер запущен на http://{WEB_HOST}:{WEB_PORT}")

    async def handle_root(self, request):
        """Обработчик корневого пути"""
        return web.Response(
            text="🤖 Telegram Bot is running!\n\n📱 Mini App доступен по пути: /webapp/"
        )

    async def run(self):
        """Запуск бота и HTTP сервера"""
        # Запускаем HTTP сервер в фоне
        asyncio.create_task(self.run_http_server())

        # Запускаем бота
        logger.info("Бот запускается...")
        await self.application.run_polling()


async def main():
    """Основная функция"""
    bot = TelegramBot()
    await bot.run()


if __name__ == "__main__":
    asyncio.run(main())
