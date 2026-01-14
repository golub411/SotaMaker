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

// Генерация DOM-элемента для category-intgr
function generateCategoryIntegrationElement(category) {
  const config = CATEGORY_CONFIG[category];
  if (!config) return null;

  const categoryIntgr = document.createElement('div');
  categoryIntgr.className = 'category-intgr';
  categoryIntgr.dataset.category = category;

  // Категория
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category';
  
  const categoryIcon = document.createElement('div');
  categoryIcon.className = 'category-icon';
  const iconImg = document.createElement('img');
  iconImg.src = config.icon;
  iconImg.alt = config.name;
  categoryIcon.appendChild(iconImg);
  
  const categoryContent = document.createElement('div');
  categoryContent.className = 'category-content';
  
  const categoryLabel = document.createElement('span');
  categoryLabel.textContent = 'Категория:';
  categoryLabel.style.opacity = '0.5';
  
  const categoryName = document.createElement('span');
  categoryName.textContent = config.name;
  categoryName.style.opacity = '0.7';
  
  categoryContent.appendChild(categoryLabel);
  categoryContent.appendChild(categoryName);
  
  categoryDiv.appendChild(categoryIcon);
  categoryDiv.appendChild(categoryContent);

  // Контейнер интеграций
  const integrationContainer = document.createElement('div');
  integrationContainer.className = 'integration-container';
  
  const integration = document.createElement('div');
  integration.className = 'integration';
  
  const sotsIntImg = document.createElement('img');
  sotsIntImg.className = 'sotsint';
  sotsIntImg.src = 'static/UI/sotsintegration.png';
  sotsIntImg.alt = '';
  
  const integrationText = document.createElement('span');
  integrationText.textContent = 'Интеграции';
  
  const arrowContainer = document.createElement('div');
  arrowContainer.className = 'arrow-container';
  
  const arrowWhite = document.createElement('img');
  arrowWhite.className = 'arrow white';
  arrowWhite.src = 'static/UI/arrowint.svg';
  arrowWhite.alt = '';
  
  const arrowBlack = document.createElement('img');
  arrowBlack.className = 'arrow black';
  arrowBlack.src = 'static/UI/arrowintblack.svg';
  arrowBlack.alt = '';
  
  arrowContainer.appendChild(arrowWhite);
  arrowContainer.appendChild(arrowBlack);
  
  integration.appendChild(sotsIntImg);
  integration.appendChild(integrationText);
  integration.appendChild(arrowContainer);

  // Контекстное меню интеграций
  const integrationsContextMenu = document.createElement('div');
  integrationsContextMenu.className = 'integrations-context-menu';
  
  INTEGRATIONS.forEach(integrationItem => {
    const contextMenuItem = document.createElement('div');
    contextMenuItem.className = 'context-menu-item';
    
    const contextMenuIcon = document.createElement('div');
    contextMenuIcon.className = 'context-menu-icon';
    const integrationIcon = document.createElement('img');
    integrationIcon.src = integrationItem.icon;
    integrationIcon.alt = integrationItem.name;
    contextMenuIcon.appendChild(integrationIcon);
    
    const integrationNameSpan = document.createElement('span');
    integrationNameSpan.textContent = integrationItem.name;
    
    contextMenuItem.appendChild(contextMenuIcon);
    contextMenuItem.appendChild(integrationNameSpan);
    integrationsContextMenu.appendChild(contextMenuItem);
  });

  const contextMenuArrow = document.createElement('div');
  contextMenuArrow.className = 'context-menu-arrow';

  integrationContainer.appendChild(integration);
  integrationContainer.appendChild(integrationsContextMenu);
  integrationContainer.appendChild(contextMenuArrow);

  categoryIntgr.appendChild(categoryDiv);
  categoryIntgr.appendChild(integrationContainer);

  return categoryIntgr;
}

function generateTemplatesElements() {
  const fragment = document.createDocumentFragment();
  
  Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
    const templatesContainer = document.createElement('div');
    templatesContainer.className = 'templates-container';
    templatesContainer.dataset.category = category;
    
    Object.entries(config.templates).forEach(([templateId, template], index) => {
      const bottomMain = document.createElement('div');
      bottomMain.className = `bottom-main ${index === 0 ? 'active' : ''}`;
      bottomMain.dataset.template = templateId;
      
      // Добавляем category-intgr элемент
      const categoryIntegration = generateCategoryIntegrationElement(category);
      if (categoryIntegration) {
        bottomMain.appendChild(categoryIntegration);
      }
      
      // Заголовок
      const title = document.createElement('h1');
      const titleSpan = document.createElement('span');
      titleSpan.textContent = template.title;
      title.appendChild(titleSpan);
      bottomMain.appendChild(title);
      
      // Описание
      const description = document.createElement('p');
      // Используем insertAdjacentHTML для сохранения HTML-тегов в описании
      description.insertAdjacentHTML('beforeend', template.description);
      bottomMain.appendChild(description);
      
      // Форма
      const form = document.createElement('div');
      form.className = 'form';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Введите токен из бота @BotFather';
      form.appendChild(input);
      
      const buttons = document.createElement('div');
      buttons.className = 'buttons';
      
      const createButton = document.createElement('div');
      createButton.className = 'button create';
      const createSpan = document.createElement('span');
      createSpan.textContent = 'Создать';
      createButton.appendChild(createSpan);
      
      const demoLink = document.createElement('a');
      demoLink.href = '#';
      demoLink.className = 'button demo';
      const demoSpan = document.createElement('span');
      demoSpan.textContent = 'Демо-доступ';
      demoLink.appendChild(demoSpan);
      
      buttons.appendChild(createButton);
      buttons.appendChild(demoLink);
      form.appendChild(buttons);
      
      bottomMain.appendChild(form);
      templatesContainer.appendChild(bottomMain);
    });
    
    fragment.appendChild(templatesContainer);
  });
  
  return fragment;
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
    const templatesFragment = generateTemplatesElements();
    // Очищаем и добавляем элементы безопасно
    while (bottomBlock.firstChild) {
      bottomBlock.removeChild(bottomBlock.firstChild);
    }
    bottomBlock.appendChild(templatesFragment);
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