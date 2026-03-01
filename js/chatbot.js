// js/chatbot.js

const Chatbot = {
    isOpen: false,
    
    // Справочник ответов по функционалу сайта
    knowledgeBase: {
        'how_to_start': {
            q: 'Как начать пользоваться?',
            a: 'Перейдите в настройки (иконка шестеренки), нажмите "Добавить ребенка", введите имя и дату рождения. Приложение автоматически рассчитает все календари вакцин и осмотров!'
        },
        'vaccines_logic': {
            q: 'Как работает Вакцинация?',
            a: 'В разделе "Вакцинация" встроен календарь РФ. Вы можете отметить вакцину галочкой как выполненную. Если вы сделали прививку позже графика — нажмите на дату под вакциной и укажите реальное число, график перестроится (догоняющая вакцинация).'
        },
        'feeding_guide': {
            q: 'Как работает Вскармливание?',
            a: 'Раздел "Вскармливание" рассчитает дату ввода прикорма (4.5 - 6 мес). Выберите тип питания (Естественное/Искусственное), и бот предложит схему. Также там есть удобный чеклист по введению каждого продукта.'
        },
        'allergens': {
            q: 'Где список аллергенов?',
            a: 'В модуле "Вскармливание" прокрутите вниз — там есть карточка "Большая восьмерка аллергенов" с правилами и симптомами.'
        },
        'stats_export': {
            q: 'Как скачать данные?',
            a: 'В верхнем правом углу (иконка ⚙️) есть кнопка "Экспорт". Она скачает все данные вашего ребенка в виде JSON-файла. Вы можете загрузить их обратно кнопкой "Импорт".'
        },
        'teeth_module': {
            q: 'Где Зубная формула?',
            a: 'Выберите "Зубная формула" в боковом меню! Там вы найдете интерактивную челюсть. Кликните на зубик, чтобы отметить, когда он прорезался или выпал.'
        },
        'checkup_norms': {
            q: 'Что за профосмотры?',
            a: 'Раздел "Профосмотры" основан на Приказе Минздрава РФ 211н. Он показывает, каких именно врачей нужно пройти и какие анализы сдать в каждом возрасте (в 1 мес, 3 мес, 1 год и т.д.).'
        },
        'multiple_children': {
            q: 'Можно добавить 2 детей?',
            a: 'Да! В настройках (⚙️) можно создать несколько профилей и быстро переключаться между ними. Данные каждого ребенка хранятся отдельно.'
        }
    },

    init() {
        this.injectHTML();
        this.cacheDOM();
        this.bindEvents();
        
        // Initial greeting interaction delay
        setTimeout(() => {
            this.showGreeting();
        }, 2000);
    },

    injectHTML() {
        if(document.getElementById('chatbot-container')) return;
        
        const html = `
            <div id="chatbot-container">
                <div class="chatbot-fab" id="chatbot-fab" title="Умный помощник">
                    <i class="fas fa-robot"></i>
                </div>

                <div class="chatbot-wrapper" id="chatbot-wrapper">
                    <div class="chatbot-header">
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <i class="fas fa-robot"></i>
                            <span>Педиатрический Бот</span>
                        </div>
                        <button class="chatbot-close" id="chatbot-close"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div class="chatbot-body" id="chatbot-body">
                        <!-- Messages render here -->
                    </div>

                    <div class="chatbot-options" id="chatbot-options">
                        ${Object.keys(this.knowledgeBase).map(k => `
                            <button class="chat-opt-btn" data-key="${k}">${this.knowledgeBase[k].q}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    cacheDOM() {
        this.fab = document.getElementById('chatbot-fab');
        this.wrapper = document.getElementById('chatbot-wrapper');
        this.closeBtn = document.getElementById('chatbot-close');
        this.body = document.getElementById('chatbot-body');
        this.optionsContainer = document.getElementById('chatbot-options');
    },

    bindEvents() {
        this.fab.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        
        document.querySelectorAll('.chat-opt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOptionClick(e));
        });
    },

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.wrapper.classList.add('active');
            this.fab.style.transform = 'scale(0)';
            if (this.body.children.length === 0) {
                this.showGreeting();
            }
        } else {
            this.wrapper.classList.remove('active');
            this.fab.style.transform = 'scale(1)';
        }
    },

    addMessage(text, isBot = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble ${isBot ? 'chat-bot' : 'chat-human'}`;
        msgDiv.innerHTML = text; // allow basic HTML like bold
        this.body.appendChild(msgDiv);
        this.scrollToBottom();
    },

    showTyping() {
        const typingId = 'typing-' + Date.now();
        const html = `
            <div class="typing-indicator" id="${typingId}">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.body.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
        return typingId;
    },

    removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    scrollToBottom() {
        this.body.scrollTop = this.body.scrollHeight;
    },

    showGreeting() {
        if(this.body.children.length > 0) return; // already greeted
        
        const tId = this.showTyping();
        
        setTimeout(() => {
            this.removeTyping(tId);
            this.addMessage('Привет! Я — гид по сайту Child Tracker 🚀<br><br>Выберите вопрос ниже, и я подскажу, как пользоваться нашими функциями:');
        }, 1200);
    },

    handleOptionClick(e) {
        const key = e.target.dataset.key;
        const kn = this.knowledgeBase[key];
        if(!kn) return;

        // User asks
        this.addMessage(kn.q, false);
        
        // Disable buttons temporarily
        this.optionsContainer.style.pointerEvents = 'none';
        this.optionsContainer.style.opacity = '0.5';

        // Bot typing
        const tId = this.showTyping();

        // Bot answers
        setTimeout(() => {
            this.removeTyping(tId);
            this.addMessage(kn.a, true);
            
            // Re-enable buttons
            this.optionsContainer.style.pointerEvents = 'auto';
            this.optionsContainer.style.opacity = '1';
        }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
    }
};

// Auto-initialize when loaded (or document ready)
document.addEventListener('DOMContentLoaded', () => {
    // Only init if we are on the main app page (not login/auth conceptually)
    if(document.getElementById('main-container')) {
        Chatbot.init();
    }
});
