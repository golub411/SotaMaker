// Проверка конфигурации
console.log('🔧 CATEGORY_CONFIG загружен:', Object.keys(CATEGORY_CONFIG));
Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
  console.log(`📁 Категория ${category}:`, config.templates ? Object.keys(config.templates) : 'нет шаблонов');
});

const CATEGORY_CONFIG = {
  stars: {
    name: "Звёзды и NFT",
    icon: "static/UI/staricon.png",
    templates: {
      "stars-default": {
        title: "Игровой звездный-бот",
        description: "Азартный бот со звёдами и вращениями. Встроена <strong>реклама</strong>, минимальный вывод – весь <strong>профит идет владельцу.</strong>"
      }
    }
  },
  movies: {
    name: "Кино и Фильмы", 
    icon: "static/emoji/cinema.png",
    templates: {
      "movies-cinema": {
        title: "Кино-бот", 
        description: "Бот для кино и фильмов с рекомендациями и рецензиями. <strong>Автоматическая публикация</strong> новостей и <strong>интерактивный поиск</strong> фильмов."
      },
      "movies-reviews": {
        title: "Кино-критик",
        description: "Бот для обсуждения фильмов с системой рецензий и оценок. <strong>Сообщество критиков</strong> и <strong>рейтинговая система</strong>."
      },
      "movies-recommendations": {
        title: "Кино-рекомендатор",
        description: "Умный бот с рекомендациями на основе предпочтений. <strong>AI-подбор</strong> фильмов и <strong>персонализированные подборки</strong>."
      }
    }
  },
  shops: {
    name: "Магазины",
    icon: "static/UI/staricon.png",
    templates: {
      "shops-default": {
        title: "Магазин-бот",
        description: "Торговый бот для онлайн-магазинов. Поддержка <strong>множественных платежных систем</strong> и <strong>автоматизация заказов</strong>."
      }
    }
  },
  games: {
    name: "Игровые",
    icon: "static/UI/staricon.png", 
    templates: {
      "games-default": {
        title: "Игровой бот",
        description: "Игровой бот с системой достижений и рейтингов. <strong>Мультиплеерные игры</strong> и <strong>виртуальная экономика</strong>."
      }
    }
  }
};

// Интеграции (общие для всех категорий)
const INTEGRATIONS = [
  { name: "Flyer", icon: "static/logos/flyer.JPG" },
  { name: "Subgram", icon: "static/logos/Subgram.JPG" }
];

// Генерация HTML для category-intgr
function generateCategoryIntegrationHTML(category) {
  console.log(`🛠️ Генерация category-intgr для: ${category}`);
  const config = CATEGORY_CONFIG[category];
  if (!config) {
    console.error(`❌ Конфиг не найден для категории: ${category}`);
    return '';
  }

  return `
    <div class="category-intgr" data-category="${category}">
      <div class="category">
        <div class="category-icon">
          <img src="${config.icon}" alt="${config.name}" />
        </div>
        <div class="category-content">
          <span style="opacity: 0.5">Категория:</span>
          <span style="opacity: 0.7">${config.name}</span>
        </div>
      </div>

      <div class="integration-container">
        <div class="integration">
          <img class="sotsint" src="static/UI/sotsintegration.png" alt="" />
          <span>Интеграции</span>
          <div class="arrow-container">
            <img class="arrow white" src="static/UI/arrowint.svg" alt="" />
            <img class="arrow black" src="static/UI/arrowintblack.svg" alt="" />
          </div>
        </div>

        <div class="integrations-context-menu">
          ${INTEGRATIONS.map(integration => `
            <div class="context-menu-item">
              <div class="context-menu-icon">
                <img src="${integration.icon}" alt="${integration.name}" />
              </div>
              <span>${integration.name}</span>
            </div>
          `).join('')}
        </div>

        <div class="context-menu-arrow"></div>
      </div>
    </div>
  `;
}

function generateTemplatesHTML() {
  console.log('🛠️ Начало генерации шаблонов');
  
  let html = '';
  
  Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
    console.log(`📋 Генерация категории: ${category}`);
    
    if (!config.templates || Object.keys(config.templates).length === 0) {
      console.warn(`⚠️ Нет шаблонов для категории: ${category}`);
      return;
    }
    
    html += `
      <div class="templates-container" data-category="${category}">
        ${Object.entries(config.templates).map(([templateId, template], index) => {
          console.log(`📄 Генерация шаблона: ${templateId}`);
          return `
          <div class="bottom-main ${index === 0 ? 'active' : ''}" data-template="${templateId}">
            ${generateCategoryIntegrationHTML(category)}
            
            <h1><span>${template.title}</span></h1>
            <p>${template.description}</p>
            <div class="form">
              <input placeholder="Введите токен из бота @BotFather" type="text" />
              <div class="buttons">
                <div class="button create"><span>Создать</span></div>
                <a href="#" class="button demo"><span>Демо-доступ</span></a>
              </div>
            </div>
          </div>
        `}).join('')}
      </div>
    `;
  });
  
  console.log('✅ Генерация шаблонов завершена, длина HTML:', html.length);
  return html;
}

// Функция создания бота
async function createBot(payload) {
  console.log('🚀 Отправка запроса на создание бота:', payload);
  
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
  console.log('👆 Обработка создания бота');
  
  const activeTemplate = document.querySelector(".bottom-main.active");
  if (!activeTemplate) {
    console.error('❌ Активный шаблон не найден');
    showAlert("❌ Ошибка: активный шаблон не найден");
    return;
  }

  const tokenInput = activeTemplate.querySelector('.form input[type="text"]');
  const createButton = activeTemplate.querySelector(".button.create");
  const token = tokenInput.value.trim();

  const selectedBotType = document.body.getAttribute("data-bot-type");
  const selectedTemplate = activeTemplate.getAttribute("data-template");

  console.log('📝 Данные для создания:', { selectedBotType, selectedTemplate, tokenLength: token.length });

  if (!token) {
    showAlert("❌ Пожалуйста, введите токен бота от @BotFather");
    return;
  }

  setButtonLoading(createButton, true);

  try {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 300));

    const payload = {
      token: token,
      category: selectedBotType,
      template: selectedTemplate,
      initData: window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp.initData : null,
    };

    const createPromise = createBot(payload);
    const [result] = await Promise.all([createPromise, minLoadTime]);

    console.log('✅ Бот создан успешно:', result);

    showAlert(`✅ Бот успешно создан!\nUsername: @${result.bot_username}`);
    tokenInput.value = "";
  } catch (error) {
    console.error("Ошибка создания бота:", error);
    showAlert(`❌ Ошибка: ${error.message}`);
  } finally {
    setButtonLoading(createButton, false);
  }
}

// Функционал для контекстного меню интеграций
function initIntegrationsMenu() {
  console.log('🎯 Инициализация меню интеграций');
  
  const contextOverlay = document.getElementById("contextOverlay");
  if (!contextOverlay) {
    console.error('❌ contextOverlay не найден');
    return;
  }
  
  // Находим все контейнеры интеграций
  const integrationContainers = document.querySelectorAll(".integration-container");
  console.log('🎯 Найдено контейнеров интеграций:', integrationContainers.length);

  if (integrationContainers.length === 0) {
    console.warn('⚠️ Контейнеры интеграций не найдены');
    return;
  }

  function toggleIntegrationsMenu(container) {
    const integrationsContextMenu = container.querySelector(".integrations-context-menu");
    const arrowWhite = container.querySelector(".arrow.white");
    const arrowBlack = container.querySelector(".arrow.black");
    
    if (!integrationsContextMenu) {
      console.error('❌ integrationsContextMenu не найден');
      return;
    }
    
    const isActive = integrationsContextMenu.classList.contains("active");

    // Закрываем все остальные открытые меню
    document.querySelectorAll(".integrations-context-menu.active").forEach(menu => {
      if (menu !== integrationsContextMenu) {
        menu.classList.remove("active");
        const parentContainer = menu.closest('.integration-container');
        if (parentContainer) {
          parentContainer.querySelectorAll('.arrow.white.open, .arrow.black.open').forEach(arrow => {
            arrow.classList.remove("open");
          });
        }
      }
    });

    if (isActive) {
      closeIntegrationsMenu(container);
    } else {
      openIntegrationsMenu(container);
    }
  }

  function openIntegrationsMenu(container) {
    const integrationsContextMenu = container.querySelector(".integrations-context-menu");
    const arrowWhite = container.querySelector(".arrow.white");
    const arrowBlack = container.querySelector(".arrow.black");

    integrationsContextMenu.classList.add("active");
    contextOverlay.classList.add("active");
    if (arrowWhite) arrowWhite.classList.add("open");
    if (arrowBlack) arrowBlack.classList.add("open");
    
    console.log('📌 Меню интеграций открыто');
  }

  function closeIntegrationsMenu(container) {
    const integrationsContextMenu = container.querySelector(".integrations-context-menu");
    const arrowWhite = container.querySelector(".arrow.white");
    const arrowBlack = container.querySelector(".arrow.black");

    integrationsContextMenu.classList.remove("active");
    contextOverlay.classList.remove("active");
    if (arrowWhite) arrowWhite.classList.remove("open");
    if (arrowBlack) arrowBlack.classList.remove("open");
  }

  function closeAllMenus() {
    document.querySelectorAll(".integrations-context-menu.active").forEach(menu => {
      menu.classList.remove("active");
      const container = menu.closest('.integration-container');
      if (container) {
        container.querySelectorAll('.arrow.white.open, .arrow.black.open').forEach(arrow => {
          arrow.classList.remove("open");
        });
      }
    });
    contextOverlay.classList.remove("active");
  }

  // Добавляем обработчики для каждого контейнера
  integrationContainers.forEach(container => {
    const integrationButton = container.querySelector(".integration");
    const integrationsContextMenu = container.querySelector(".integrations-context-menu");

    if (!integrationButton || !integrationsContextMenu) {
      console.warn('⚠️ Элементы меню не найдены в контейнере');
      return;
    }

    integrationButton.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log('👆 Клик по кнопке интеграций');
      toggleIntegrationsMenu(container);
    });

    // Обработка выбора пункта меню
    const menuItems = integrationsContextMenu.querySelectorAll(".context-menu-item");
    menuItems.forEach((item) => {
      item.addEventListener("click", function () {
        const integrationName = item.querySelector("span").textContent;
        console.log("Выбрана интеграция:", integrationName);

        showPopup("Интеграция", `Выбрана интеграция: ${integrationName}`);
        closeIntegrationsMenu(container);
      });
    });
  });

  // Закрытие меню при клике вне его
  contextOverlay.addEventListener("click", closeAllMenus);
  document.addEventListener("click", closeAllMenus);

  // Предотвращаем закрытие при клике внутри меню
  document.querySelectorAll(".integrations-context-menu").forEach(menu => {
    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

  // Закрытие по ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllMenus();
    }
  });
  
  console.log('✅ Меню интеграций инициализировано');
}

// Функционал для переключения шаблонов
function initTemplateSwitcher() {
  console.log('🔄 Инициализация переключателя шаблонов');
  
  const templateTabs = document.querySelectorAll(".template-tab");
  console.log('🔄 Найдено вкладок шаблонов:', templateTabs.length);

  templateTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const templateContainer = this.closest(".templates-container");
      const templateId = this.getAttribute("data-template");
      
      console.log('👆 Клик по вкладке шаблона:', templateId);

      // Убираем активный класс у всех вкладок
      templateContainer.querySelectorAll(".template-tab").forEach((t) => {
        t.classList.remove("active");
      });

      // Добавляем активный класс текущей вкладке
      this.classList.add("active");

      // Скрываем все шаблоны и показываем только выбранный   
      templateContainer.querySelectorAll(".bottom-main").forEach((template) => {
        template.classList.remove("active");
      });

      const activeTemplate = templateContainer.querySelector(
        `.bottom-main[data-template="${templateId}"]`
      );
      if (activeTemplate) {
        activeTemplate.classList.add("active");
        console.log('✅ Активирован шаблон:', templateId);
      } else {
        console.error('❌ Шаблон не найден:', templateId);
      }
    });
  });
}

// Инициализация переключателя темы
function initThemeSwitch() {
  console.log('🌗 Инициализация переключателя темы');
  
  const themeSwitch = document.getElementById('themeSwitch');
  if (themeSwitch) {
    themeSwitch.addEventListener('click', function() {
      console.log('👆 Клик по переключателю темы');
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      
      const isDark = document.body.classList.contains('dark-theme');
      console.log(`🌗 Тема изменена на: ${isDark ? 'тёмная' : 'светлая'}`);
    });
    console.log('✅ Переключатель темы инициализирован');
  } else {
    console.warn('⚠️ Переключатель темы не найден');
  }
}

// Вспомогательная функция для показа уведомлений
function showAlert(message) {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
}

// Вспомогательная функция для показа popup
function showPopup(title, message) {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showPopup({
      title: title,
      message: message,
      buttons: [{ type: "ok" }],
    });
  } else {
    alert(`${title}: ${message}`);
  }
}

// Вспомогательная функция для показа ошибок
function showError(message) {
  const bottomBlock = document.querySelector('.bottom-block');
  if (bottomBlock) {
    bottomBlock.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #ff4444;">
        <h3>❌ Ошибка</h3>
        <p>${message}</p>
        <button onclick="window.forceRender()" style="
          background: #FBC717; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-size: 16px; 
          cursor: pointer;
          margin-top: 16px;
        ">Попробовать снова</button>
      </div>
    `;
  }
}

// Функция рендера шаблонов
function renderTemplates() {
  console.log('🎨 Рендер шаблонов...');
  
  const bottomBlock = document.querySelector('.bottom-block');
  if (!bottomBlock) {
    console.error('❌ bottomBlock не найден');
    return;
  }

  const templatesHTML = generateTemplatesHTML();
  console.log('📦 Сгенерировано символов:', templatesHTML.length);
  
  if (!templatesHTML || templatesHTML.trim().length === 0) {
    console.error('❌ templatesHTML пустой');
    return;
  }

  bottomBlock.innerHTML = templatesHTML;
  console.log('✅ Шаблоны вставлены в DOM');
  
  // Проверяем результат
  const templatesContainers = document.querySelectorAll('.templates-container');
  console.log('📁 Контейнеров создано:', templatesContainers.length);
  
  // Сразу показываем активную категорию
  showActiveCategory();
}

// Показ активной категории
function showActiveCategory() {
  const selectedBotType = document.body.getAttribute("data-bot-type") || "stars";
  const templatesContainers = document.querySelectorAll(".templates-container");
  
  console.log('👀 Показ категории:', selectedBotType);
  
  templatesContainers.forEach((container) => {
    const containerCategory = container.getAttribute("data-category");
    const shouldShow = containerCategory === selectedBotType;
    container.style.display = shouldShow ? "block" : "none";
    console.log(`📦 ${containerCategory}: ${shouldShow ? 'ПОКАЗАН' : 'скрыт'}`);
  });
}

// Инициализация всех обработчиков
function initializeHandlers() {
  console.log('⚙️ Инициализация обработчиков...');
  
  // Обработчики выбора типа бота
  const botTypes = document.querySelectorAll(".bot-type");
  console.log('⭐ Найдено типов ботов:', botTypes.length);
  
  botTypes.forEach((type) => {
    type.addEventListener("click", function () {
      const botTypeValue = this.getAttribute("data-bot-type");
      console.log('👆 Клик по типу бота:', botTypeValue);
      
      if (this.classList.contains("disabled")) {
        console.log('⏸️ Тип бота отключен:', botTypeValue);
        return;
      }
      
      // Обновляем активное состояние
      botTypes.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      document.body.setAttribute("data-bot-type", botTypeValue);
      
      // Показываем соответствующую категорию
      showActiveCategory();
      
      console.log('✅ Выбран тип бота:', botTypeValue);
    });
  });

  // Обработчики создания бота
  document.addEventListener('click', function(e) {
    if (e.target.closest('.button.create')) {
      console.log('👆 Клик по кнопке создания бота');
      handleCreateBot();
    }
  });

  // Обработчики демо-доступа
  document.addEventListener('click', function(e) {
    if (e.target.closest('.button.demo')) {
      e.preventDefault();
      console.log('👆 Клик по демо-доступу');
      showAlert("🚀 Демо-доступ будет доступен в следующем обновлении!");
    }
  });

  // Инициализация меню интеграций
  try {
    initIntegrationsMenu();
    console.log('✅ Меню интеграций инициализировано');
  } catch (e) {
    console.error('❌ Ошибка инициализации меню интеграций:', e);
  }
  
  // Инициализация переключателя шаблонов
  try {
    initTemplateSwitcher();
    console.log('✅ Переключатель шаблонов инициализирован');
  } catch (e) {
    console.error('❌ Ошибка инициализации переключателя шаблонов:', e);
  }
  
  // Инициализация переключателя темы
  try {
    initThemeSwitch();
    console.log('✅ Переключатель темы инициализирован');
  } catch (e) {
    console.error('❌ Ошибка инициализации переключателя темы:', e);
  }
}

// Основная функция инициализации приложения
function initApp() {
  console.log('🚀 initApp вызвана', new Date().toISOString());
  
  try {
    // Всегда рендерим шаблоны заново
    renderTemplates();
    
    // Инициализируем обработчики только один раз
    if (!window.handlersInitialized) {
      initializeHandlers();
      window.handlersInitialized = true;
      console.log('✅ Обработчики инициализированы');
    }
    
    console.log('✅ Рендер завершен успешно');
    
  } catch (error) {
    console.error('❌ Ошибка в initApp:', error);
    showError('Ошибка загрузки шаблонов');
  }
}

// Сделаем функции глобальными
window.initApp = initApp;
window.forceRender = initApp; // alias для обратной совместимости
window.renderTemplates = renderTemplates;

// Автоматический вызов при загрузке скрипта
console.log('📦 app.js загружен');
console.log('🔧 CATEGORY_CONFIG:', Object.keys(CATEGORY_CONFIG));

// Немедленная попытка инициализации
setTimeout(() => {
  console.log('⚡ Автоматический запуск initApp из app.js');
  if (window.initApp) {
    window.initApp();
  }
}, 50);

// Экспорт для тестирования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CATEGORY_CONFIG,
    INTEGRATIONS,
    generateCategoryIntegrationHTML,
    generateTemplatesHTML,
    initApp,
    renderTemplates
  };
}