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
        title: "Игровой бot",
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
  const config = CATEGORY_CONFIG[category];
  if (!config) return '';

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
  let html = '';
  
  Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
    html += `
      <div class="templates-container" data-category="${category}">
        ${Object.entries(config.templates).map(([templateId, template], index) => `
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
        `).join('')}
      </div>
    `;
  });
  
  return html;
}

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
  const activeTemplate = document.querySelector(".bottom-main.active");
  const tokenInput = activeTemplate.querySelector('.form input[type="text"]');
  const createButton = activeTemplate.querySelector(".button.create");
  const token = tokenInput.value.trim();

  const selectedBotType = document.body.getAttribute("data-bot-type");
  const selectedTemplate = activeTemplate.getAttribute("data-template");

  if (!token) {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert("❌ Пожалуйста, введите токен бота от @BotFather");
    } else {
      alert("❌ Пожалуйста, введите токен бота от @BotFather");
    }
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

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert(
        `✅ Бот успешно создан!\nUsername: @${result.bot_username}`
      );
    } else {
      alert(`✅ Бот успешно создан!\nUsername: @${result.bot_username}`);
    }

    tokenInput.value = "";
  } catch (error) {
    console.error("Ошибка создания бота:", error);
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert(`❌ Ошибка: ${error.message}`);
    } else {
      alert(`❌ Ошибка: ${error.message}`);
    }
  } finally {
    setButtonLoading(createButton, false);
  }
}

// Функционал для контекстного меню интеграций
function initIntegrationsMenu() {
  const contextOverlay = document.getElementById("contextOverlay");
  
  // Находим все контейнеры интеграций
  const integrationContainers = document.querySelectorAll(".integration-container");

  function toggleIntegrationsMenu(container) {
    const integrationsContextMenu = container.querySelector(".integrations-context-menu");
    const arrowWhite = container.querySelector(".arrow.white");
    const arrowBlack = container.querySelector(".arrow.black");
    const isActive = integrationsContextMenu.classList.contains("active");

    // Закрываем все остальные открытые меню
    document.querySelectorAll(".integrations-context-menu.active").forEach(menu => {
      if (menu !== integrationsContextMenu) {
        menu.classList.remove("active");
        const parentContainer = menu.closest('.integration-container');
        parentContainer.querySelectorAll('.arrow.white.open, .arrow.black.open').forEach(arrow => {
          arrow.classList.remove("open");
        });
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
      container.querySelectorAll('.arrow.white.open, .arrow.black.open').forEach(arrow => {
        arrow.classList.remove("open");
      });
    });
    contextOverlay.classList.remove("active");
  }

  // Добавляем обработчики для каждого контейнера
  integrationContainers.forEach(container => {
    const integrationButton = container.querySelector(".integration");
    const integrationsContextMenu = container.querySelector(".integrations-context-menu");

    integrationButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleIntegrationsMenu(container);
    });

    // Обработка выбора пункта меню
    const menuItems = integrationsContextMenu.querySelectorAll(".context-menu-item");
    menuItems.forEach((item) => {
      item.addEventListener("click", function () {
        const integrationName = item.querySelector("span").textContent;
        console.log("Выбрана интеграция:", integrationName);

        // Показываем уведомление через Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.showPopup({
            title: "Интеграция",
            message: `Выбрана интеграция: ${integrationName}`,
            buttons: [{ type: "ok" }],
          });
        }

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
}

// Функционал для переключения шаблонов
function initTemplateSwitcher() {
  document.querySelectorAll(".template-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const templateContainer = this.closest(".templates-container");
      const templateId = this.getAttribute("data-template");

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
      }

      console.log("Выбран шаблон:", templateId);
    });
  });
}

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found`));
    }, timeout);
  });
}
// Основная функция инициализации приложения
async function initApp() {
  // Генерируем все шаблоны из конфига
  const bottomBlock = await waitForElement('.bottom-block');
  if (bottomBlock) {
    const templatesHTML = generateTemplatesHTML();
    // Заменяем innerHTML на insertAdjacentHTML
    bottomBlock.innerHTML = ''; // Сначала очищаем
    bottomBlock.insertAdjacentHTML('beforeend', templatesHTML);
  }

  // Инициализация выбора типа бота
  const botTypes = document.querySelectorAll(".bot-type");
  let selectedBotType = "stars";

  function updateActiveState(selectedType) {
    // Обновляем кнопки выбора типа
    botTypes.forEach((type) => {
      const botTypeValue = type.getAttribute("data-bot-type");
      if (botTypeValue === selectedType && !type.classList.contains("disabled")) {
        type.classList.add("active");
        selectedBotType = selectedType;
      } else {
        type.classList.remove("active");
      }
    });

    // Обновляем data-атрибут
    document.body.setAttribute("data-bot-type", selectedBotType);

    // Показываем только активную категорию
    document.querySelectorAll(".templates-container").forEach((container) => {
      container.style.display = container.getAttribute("data-category") === selectedBotType ? "block" : "none";
    });

    console.log("Выбран тип бота:", selectedBotType);
  }

  // Обработчики для кнопок выбора типа
  botTypes.forEach((type) => {
    type.addEventListener("click", function () {
      const botTypeValue = this.getAttribute("data-bot-type");
      if (this.classList.contains("disabled")) return;
      updateActiveState(botTypeValue);
    });
  });

  // Инициализация
  updateActiveState(selectedBotType);
  initIntegrationsMenu();
  initTemplateSwitcher();

  // Обработчик создания бота
  document.addEventListener('click', function(e) {
    if (e.target.closest('.button.create')) {
      handleCreateBot();
    }
  });

  // Инициализация темы
  initThemeSwitch();
}

// Инициализация переключателя темы
function initThemeSwitch() {
  const themeSwitch = document.getElementById('themeSwitch');
  if (themeSwitch) {
    themeSwitch.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
    });
  }
}

// Запуск приложения
document.addEventListener("DOMContentLoaded", function() {
  initApp();
});