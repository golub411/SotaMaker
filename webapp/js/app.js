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
    const tokenInput = activeTemplate.querySelector(
        '.form input[type="text"]'
    );
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
            alert(
                `✅ Бот успешно создан!\nUsername: @${result.bot_username}`
            );
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
    const integrationButton = document.getElementById("integrationButton");
    const integrationsContextMenu = document.getElementById(
        "integrationsContextMenu"
    );
    const contextOverlay = document.getElementById("contextOverlay");
    const arrowWhite = document.querySelector(".arrow.white");
    const arrowBlack = document.querySelector(".arrow.black");

    function toggleIntegrationsMenu() {
        const isActive = integrationsContextMenu.classList.contains("active");

        if (isActive) {
            closeIntegrationsMenu();
        } else {
            openIntegrationsMenu();
        }
    }

    function openIntegrationsMenu() {
        integrationsContextMenu.classList.add("active");
        contextOverlay.classList.add("active");
        arrowWhite.classList.add("open");
        arrowBlack.classList.add("open");
    }

    function closeIntegrationsMenu() {
        integrationsContextMenu.classList.remove("active");
        contextOverlay.classList.remove("active");
        arrowWhite.classList.remove("open");
        arrowBlack.classList.remove("open");
    }

    integrationButton.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleIntegrationsMenu();
    });

    // Закрытие меню при клике вне его
    contextOverlay.addEventListener("click", closeIntegrationsMenu);
    document.addEventListener("click", closeIntegrationsMenu);

    // Предотвращаем закрытие при клике внутри меню
    integrationsContextMenu.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Закрытие по ESC
    document.addEventListener("keydown", function (e) {
        if (
            e.key === "Escape" &&
            integrationsContextMenu.classList.contains("active")
        ) {
            closeIntegrationsMenu();
        }
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

            closeIntegrationsMenu();
        });
    });
}

// Функционал для переключения шаблонов
function initTemplateSwitcher() {
    document.querySelectorAll(".template-tab").forEach((tab) => {
        tab.addEventListener("click", function () {
            const templateContainer = this.closest(".templates-container");
            const templateId = this.getAttribute("data-template");

            // Убираем активный класс у всех вкладок
            templateContainer
                .querySelectorAll(".template-tab")
                .forEach((t) => {
                    t.classList.remove("active");
                });

            // Добавляем активный класс текущей вкладке
            this.classList.add("active");

            // Скрываем все шаблоны и показываем только выбранный   
            templateContainer
                .querySelectorAll(".bottom-main")
                .forEach((template) => {
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

// Основная функция инициализации приложения
function initApp() {
    // Функционал для выбора типа бота
    const botTypes = document.querySelectorAll(".bot-type");
    let selectedBotType = "stars";

    function updateActiveState(selectedType) {
        botTypes.forEach((type) => {
            const botTypeValue = type.getAttribute("data-bot-type");
            if (
                botTypeValue === selectedType &&
                !type.classList.contains("disabled")
            ) {
                type.classList.add("active");
                selectedBotType = selectedType;
            } else {
                type.classList.remove("active");
            }
        });

        // Обновляем data-атрибут на body и элементах с контентом
        document.body.setAttribute("data-bot-type", selectedBotType);
        document
            .querySelector(".category-content")
            .setAttribute("data-active-content", selectedBotType);
        document
            .querySelector(".category-icon")
            .setAttribute("data-active-content", selectedBotType);

        // Показываем только активную категорию шаблонов
        document
            .querySelectorAll(".templates-container")
            .forEach((container) => {
                if (container.getAttribute("data-category") === selectedBotType) {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }
            });

        if (typeof store !== "undefined") {
            store.state.selectedBotType = selectedBotType;
        }
        console.log("Выбран тип бота:", selectedBotType);
    }

    botTypes.forEach((type) => {
        type.addEventListener("click", function () {
            const botTypeValue = this.getAttribute("data-bot-type");
            if (this.classList.contains("disabled")) return;
            updateActiveState(botTypeValue);
        });
    });

    updateActiveState(selectedBotType);
    initTemplateSwitcher();

    if (typeof store !== "undefined") {
        if (store.state.selectedBotType) {
            updateActiveState(store.state.selectedBotType);
        }
        store.subscribe((state) => {
            if (
                state.selectedBotType &&
                state.selectedBotType !== selectedBotType
            ) {
                updateActiveState(state.selectedBotType);
            }
        });
    }

    // Инициализируем меню интеграций
    initIntegrationsMenu();

    // Добавляем обработчик на кнопку "Создать" для всех активных шаблонов
    document
        .querySelectorAll(".bottom-main.active .button.create")
        .forEach((button) => {
            button.addEventListener("click", handleCreateBot);
        });
}

// Инициализируем при загрузке DOM
document.addEventListener("DOMContentLoaded", initApp);