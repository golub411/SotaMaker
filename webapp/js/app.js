// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализируем приложение
tg.expand();
tg.disableVerticalSwipes();
tg.setHeaderColor('#FBC717');

// Функция создания бота
async function createBot(payload) {
    const response = await fetch("/api/create_bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail?.message || result.message || 'Unknown error');
    }

    return result;
}

// Функция для показа/скрытия загрузки на кнопке
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.style.pointerEvents = 'none';
    } else {
        button.classList.remove('loading');
        button.style.pointerEvents = 'auto';
    }
}

// Функция создания бота с обработкой загрузки
async function handleCreateBot() {
    const tokenInput = document.querySelector('.form input[type="text"]');
    const createButton = document.querySelector('.button.create');
    const token = tokenInput.value.trim();
    
    // Получаем выбранный тип бота
    const selectedBotType = document.body.getAttribute('data-bot-type');

    // Проверяем токен
    if (!token) {
        tg.showAlert('❌ Пожалуйста, введите токен бота от @BotFather');
        return;
    }

    // Показываем загрузку
    setButtonLoading(createButton, true);

    try {
        // Минимальное время загрузки - 0.3 секунды
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 300));
        
        // Создаем payload
        const payload = {
            token: token,
            template: selectedBotType,
            initData: tg.initData
        };

        // Отправляем запрос
        const createPromise = createBot(payload);
        
        // Ждем минимум 0.3 секунды
        const [result] = await Promise.all([createPromise, minLoadTime]);

        // Показываем успех
        tg.showAlert(`✅ Бот успешно создан!\nUsername: @${result.bot_username}`);
        
        // Очищаем поле ввода
        tokenInput.value = '';

    } catch (error) {
        console.error('Ошибка создания бота:', error);
        tg.showAlert(`❌ Ошибка: ${error.message}`);
    } finally {
        // Убираем загрузку
        setButtonLoading(createButton, false);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчик на кнопку "Создать"
    const createButton = document.querySelector('.button.create');
    if (createButton) {
        createButton.addEventListener('click', handleCreateBot);
    }
});