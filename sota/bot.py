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
import json
import asyncio

from config import BOT_TOKEN, WEB_HOST, WEB_PORT, DOMAIN

# Настройка логирования
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)


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
                    "📱 Открыть SotaMaker", web_app={"url": f"https://{DOMAIN}/webapp/"}
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

📱 *SotaMaker Mini App:*
- Открыть мини-приложение
- Получить данные пользователя
- Взаимодействовать с ботом
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
                        "📱 Открыть SotaMaker",
                        web_app={"url": f"https://{DOMAIN}/webapp/"},
                    )
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(
                text="🌐 *SotaMaker Mini App:*\n\nНажмите кнопку ниже чтобы открыть мини-приложение:",
                reply_markup=reply_markup,
                parse_mode="Markdown",
            )
        elif data == "back":
            # Вместо вызова start_command, просто отправляем новое сообщение
            keyboard = [
                [
                    InlineKeyboardButton(
                        "📱 Открыть SotaMaker",
                        web_app={"url": f"https://{DOMAIN}/webapp/"},
                    )
                ],
                [
                    InlineKeyboardButton("ℹ️ Помощь", callback_data="help"),
                    InlineKeyboardButton("⚙️ Настройки", callback_data="settings"),
                ],
                [InlineKeyboardButton("👤 Профиль", callback_data="profile")],
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(
                text=f"Привет {user.first_name}! 👋", reply_markup=reply_markup
            )
        else:
            await query.edit_message_text(
                text=f"Вы выбрали: {data}", parse_mode="Markdown"
            )

    async def handle_web_app_data(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Обработка данных из мини-приложения"""
        try:
            data = json.loads(update.message.web_app_data.data)
            user_id = data.get("user_id")
            action = data.get("action")

            response_text = f"""
✅ *Данные получены из SotaMaker!*

👤 User ID: `{user_id}`
📝 Action: `{action}`
⏰ Time: `{data.get('timestamp')}`
📦 Text: `{data.get('text', 'Нет текста')}`
            """

            await update.message.reply_text(response_text, parse_mode="Markdown")
        except Exception as e:
            logger.error(f"Error handling web app data: {e}")
            await update.message.reply_text("❌ Ошибка обработки данных")

    async def echo_message(
        self, update: Update, context: ContextTypes.DEFAULT_TYPE
    ) -> None:
        """Эхо-ответ на текстовые сообщения"""
        user_text = update.message.text
        await update.message.reply_text(
            f"🔁 Вы сказали: {user_text}\n\nИспользуйте /menu для навигации"
        )

    def run(self):
        """Запуск бота - синхронная версия"""
        logger.info("Бот запускается...")
        self.application.run_polling()


def main():
    """Основная функция"""
    bot = TelegramBot()
    bot.run()


if __name__ == "__main__":
    main()
