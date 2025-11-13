// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализируем приложение
tg.expand();
tg.enableClosingConfirmation();

// Получаем данные
const initData = tg.initData;
const initDataUnsafe = tg.initDataUnsafe;
const user = initDataUnsafe.user;

// Отображаем данные пользователя
function displayUserData() {
    const userDataEl = document.getElementById('user-data');
    
    if (user) {
        userDataEl.innerHTML = `
            <p><strong>🆔 ID:</strong> ${user.id}</p>
            <p><strong>👤 Имя:</strong> ${user.first_name}</p>
            <p><strong>👥 Фамилия:</strong> ${user.last_name || 'Не указана'}</p>
            <p><strong>📱 Username:</strong> @${user.username || 'Не указан'}</p>
            <p><strong>🌐 Язык:</strong> ${user.language_code || 'Не указан'}</p>
            <p><strong>✅ Premium:</strong> ${user.is_premium ? 'Да' : 'Нет'}</p>
        `;
    } else {
        userDataEl.innerHTML = '<p style="color: red; text-align: center;">⚠️ Данные пользователя недоступны</p>';
    }
}

// Отображаем debug информацию
function displayDebugInfo() {
    document.getElementById('debug-data').innerHTML = `
        <p><strong>📡 Platform:</strong> ${tg.platform}</p>
        <p><strong>🎨 Theme:</strong> ${tg.colorScheme}</p>
        <p><strong>📱 Viewport:</strong> ${tg.viewportHeight}x${tg.viewportWidth}</p>
        <p><strong>🔗 Init Data:</strong> ${initData ? 'Доступны' : 'Нет данных'}</p>
        <p><strong>🌙 Dark Mode:</strong> ${tg.colorScheme === 'dark' ? 'Да' : 'Нет'}</p>
    `;
}

// Функция отправки сообщения
function sendMessage() {
    if (!user) {
        tg.showAlert('Ошибка: данные пользователя недоступны');
        return;
    }

    const message = {
        action: 'user_message',
        user_id: user.id,
        text: 'Привет из мини-приложения! 🚀',
        timestamp: Date.now(),
        platform: tg.platform
    };
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify(message));
    
    // Показываем подтверждение
    tg.showPopup({
        title: '✅ Успешно!',
        message: 'Сообщение отправлено боту',
        buttons: [{ type: 'ok' }]
    });
}

// Функция показа alert
function showAlert() {
    tg.showAlert('🎉 Это сообщение из мини-приложения!');
}

// Функция закрытия приложения
function closeApp() {
    tg.close();
}

// Обработчики событий Telegram
tg.onEvent('viewportChanged', (event) => {
    console.log('Viewport changed:', event);
    displayDebugInfo();
});

tg.onEvent('themeChanged', () => {
    console.log('Theme changed to:', tg.colorScheme);
    displayDebugInfo();
});

// Настраиваем основную кнопку
tg.MainButton.setText("📤 Отправить данные")
    .show()
    .onClick(sendMessage);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    displayUserData();
    displayDebugInfo();
    
    // Адаптируем стили под тему Telegram
    if (tg.colorScheme === 'dark') {
        document.body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)';
    }
});