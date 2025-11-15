class Store {
    constructor() {
        this.state = this.createInitialState();
        this.subscribers = new Set();
        this.init();
    }

    createInitialState() {
        return {
            theme: 'light',
            counter: 0,
            selectedBotType: 'stars',
            selectedTemplates: {
                stars: 'stars-default',
                movies: 'movies-cinema',
                shops: 'shops-default',
                games: 'games-default'
            },
            user: {
                name: 'Иван Иванов',
                email: 'ivan@example.com',
                age: 25
            },
            settings: {
                notifications: true,
                language: 'ru'
            }
        };
    }

    init() {
        // Загружаем состояние из localStorage
        const saved = localStorage.getItem('app-state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            } catch (e) {
                console.warn('Failed to parse saved state:', e);
            }
        }

        // Создаем реактивный прокси
        this.state = this.makeReactive(this.state);
        
        // Инициализируем приложение
        this.updateDOM();
        this.applyTheme();
    }

    makeReactive(obj) {
        const self = this;
        
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                
                // Если значение объект, делаем его реактивным
                if (typeof value === 'object' && value !== null) {
                    value = self.makeReactive(value);
                }
                
                target[property] = value;
                
                // Сохраняем в localStorage
                self.saveState();
                
                // Уведомляем подписчиков только если значение изменилось
                if (oldValue !== value) {
                    self.notifySubscribers();
                    
                    // Особые обработчики для определенных свойств
                    if (property === 'theme') {
                        self.applyTheme();
                    }
                }
                
                return true;
            }
        });
    }

    // Подписка на изменения
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // Сохранение состояния
    saveState() {
        // Исключаем циклические ссылки при сериализации
        const stateToSave = {
            theme: this.state.theme,
            counter: this.state.counter,
            selectedBotType: this.state.selectedBotType,
            selectedTemplates: { ...this.state.selectedTemplates },
            user: { ...this.state.user },
            settings: { ...this.state.settings }
        };
        localStorage.setItem('app-state', JSON.stringify(stateToSave));
    }

    // Методы для работы с темой
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    }

    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.state.theme = theme;
        }
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.state.theme);
        
        // Обновляем текст кнопки переключения темы
        const themeButton = document.querySelector('.theme-toggle');
        if (themeButton) {
            themeButton.textContent = this.state.theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема';
        }
    }

    // Методы для работы с шаблонами
    setTemplate(category, template) {
        if (this.state.selectedTemplates[category]) {
            this.state.selectedTemplates[category] = template;
        }
    }

    getCurrentTemplate(category) {
        return this.state.selectedTemplates[category] || 'default';
    }

    // Методы для счётчика
    increment() {
        this.state.counter += 1;
    }

    decrement() {
        this.state.counter -= 1;
    }

    resetCounter() {
        this.state.counter = 0;
    }

    // Обновление DOM на основе данных хранилища
    updateDOM() {
        const bindings = document.querySelectorAll('[data-bind]');
        
        bindings.forEach(element => {
            const path = element.getAttribute('data-bind');
            const value = this.getNestedValue(this.state, path);
            
            if (element.type === 'checkbox') {
                element.checked = Boolean(value);
            } else if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        });
    }

    // Вспомогательная функция для получения вложенных свойств
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    }

    // Получение текущего состояния
    getState() {
        return JSON.parse(JSON.stringify(this.state)); // deep copy
    }
}

// Создаем глобальный экземпляр хранилища
const store = new Store();

// Подписываемся на изменения и обновляем DOM
store.subscribe(() => {
    store.updateDOM();
});

// Обработчики для input элементов
document.addEventListener('input', function(e) {
    const target = e.target;
    const path = target.getAttribute('data-bind');
    
    if (path && store) {
        const paths = path.split('.');
        const lastKey = paths.pop();
        let current = store.state;
        
        for (const key of paths) {
            current = current[key];
        }
        
        if (target.type === 'checkbox') {
            current[lastKey] = target.checked;
        } else {
            current[lastKey] = target.type === 'number' ? 
                parseInt(target.value) || 0 : target.value;
        }
    }
});

// Обработчики для select элементов
document.addEventListener('change', function(e) {
    const target = e.target;
    const path = target.getAttribute('data-bind');
    
    if (path && store && target.tagName === 'SELECT') {
        const paths = path.split('.');
        const lastKey = paths.pop();
        let current = store.state;
        
        for (const key of paths) {
            current = current[key];
        }
        
        current[lastKey] = target.value;
    }
});

// Обработчик переключения темы
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            store.toggleTheme();
        });
    }
});