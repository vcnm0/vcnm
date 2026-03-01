// js/feeding.js — Вскармливание и прикорм

const Feeding = {
    childInfo: null,
    diary: [],
    introductions: [],
    feedingType: 'natural',

    complementaryFoods: [
        { ageMonths: 4, category: 'Овощное пюре', products: ['Кабачок','Цветная капуста','Брокколи'], portion: '10-150 г', notes: 'Начинать с 1/2 ч.л.(5г), доводить до нормы за 5-7 дней' },
        { ageMonths: 4, category: 'Каши', products: ['Гречневая','Рисовая','Кукурузная'], portion: '10-150 г', notes: 'Безмолочные, безглютеновые' },
        { ageMonths: 4, category: 'Масло растительное', products: ['Подсолнечное','Оливковое','Кукурузное'], portion: '1-3 г', notes: 'Добавляется в овощное пюре' },
        { ageMonths: 4, category: 'Масло сливочное', products: ['Сливочное 82.5%'], portion: '1-4 г', notes: 'Добавляется в кашу' },
        { ageMonths: 5, category: 'Овощное пюре', products: ['Тыква','Морковь','Картофель'], portion: '150 г', notes: 'Расширение ассортимента' },
        { ageMonths: 5, category: 'Фруктовое пюре', products: ['Яблоко','Груша','Чернослив'], portion: '5-50 г', notes: 'Вводится после овощей и каш' },
        { ageMonths: 6, category: 'Овощи/Каши', products: ['Все ранее введенные'], portion: '150 г', notes: 'Можно вводить глютеновые каши (овсяная, пшеничная)' },
        { ageMonths: 6, category: 'Мясное пюре', products: ['Кролик','Индейка','Телятина','Цыпленок'], portion: '5-30 г', notes: 'Гомогенизированное, источник железа' },
        { ageMonths: 6, category: 'Фруктовое пюре', products: ['Ранее введенные'], portion: '60 г', notes: '' },
        { ageMonths: 7, category: 'Овощи/Каши', products: ['Все доступные'], portion: '150 г', notes: '' },
        { ageMonths: 7, category: 'Мясное пюре', products: ['Все доступные'], portion: '50 г', notes: '' },
        { ageMonths: 7, category: 'Желток', products: ['Куриный', 'Перепелиный'], portion: '1/4 - 1/2 шт', notes: 'Сваренный вкрутую, размятый' },
        { ageMonths: 7, category: 'Фруктовое пюре', products: ['Все доступные'], portion: '70 г', notes: '' },
        { ageMonths: 7, category: 'Сухари, печенье', products: ['Детское печенье', 'Сухарики'], portion: '3-5 г', notes: '' },
        { ageMonths: 8, category: 'Овощи/Каши', products: ['Все доступные'], portion: '180 г / 200 г', notes: 'Постепенное введение комочков' },
        { ageMonths: 8, category: 'Кефир, Биолакт', products: ['Детский кефир', 'Биолакт', 'Йогурт'], portion: '200 мл', notes: 'Специализированные детские кисломолочные продукты' },
        { ageMonths: 8, category: 'Творог', products: ['Детский творожок'], portion: '50 г', notes: 'Ежедневно, не более 50г' },
        { ageMonths: 8, category: 'Рыбное пюре', products: ['Треска','Хек','Минтай','Судак'], portion: '5-30 г', notes: '1-2 раза в неделю вместо мяса' },
        { ageMonths: 8, category: 'Хлеб пшеничный', products: ['Хлеб'], portion: '5 г', notes: '' },
        { ageMonths: 9, category: 'Рыбное пюре', products: ['Разрешенная рыба'], portion: '50 г', notes: 'Кусочками' },
        { ageMonths: 9, category: 'Мясное пюре', products: ['Разрешенное мясо'], portion: '60-70 г', notes: 'Кусочками или фрикадельки' },
        { ageMonths: 9, category: 'Фрукты', products: ['Свежие/пюре'], portion: '90 г', notes: '' },
        { ageMonths: 10, category: 'Рыба', products: ['Разрешенная рыба'], portion: '60 г', notes: '' },
        { ageMonths: 10, category: 'Мясо', products: ['Разрешенное мясо'], portion: '70 г', notes: '' },
        { ageMonths: 10, category: 'Фрукты', products: ['Свежие'], portion: '100 г', notes: '' },
        { ageMonths: 12, category: 'Цельное молоко', products: ['Детское молоко'], portion: '100-200 мл', notes: 'Для приготовления каши или питья' },
    ],

    allergens: [
        { name: 'Коровье молоко', desc: 'Один из самых частых аллергенов. Альтернатива до 1 года — глубокий гидролизат или аминокислотная смесь.' },
        { name: 'Яйца', desc: 'Особенно яичный белок. Вводить тщательно проваренными (желток с 7 мес, белок позже).' },
        { name: 'Арахис и орехи', desc: 'Вводить в виде безопасных паст (без кусочков) после введения базового прикорма.' },
        { name: 'Соя', desc: 'Часто перекрестная реакция с белком коровьего молока.' },
        { name: 'Пшеница (глютен)', desc: 'Вводится после безглютеновых каш (гречка, рис, кукуруза) примерно с 6 мес.' },
        { name: 'Рыба и морепродукты', desc: 'Вводится в 8-9 месяцев, осторожно, начиная с белой рыбы (треска, хек).' }
    ],

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadDiary();
        this.render();
        this.setupEventListeners();
    },

    loadDiary() {
        const d = localStorage.getItem(App.getStorageKey('feedingDiary'));
        if (d) this.diary = JSON.parse(d);
        const intro = localStorage.getItem(App.getStorageKey('feedingIntroductions'));
        if (intro) this.introductions = JSON.parse(intro);
        const t = localStorage.getItem(App.getStorageKey('feedingType'));
        if (t) this.feedingType = t;
    },

    saveDiary() {
        localStorage.setItem(App.getStorageKey('feedingDiary'), JSON.stringify(this.diary));
        localStorage.setItem(App.getStorageKey('feedingIntroductions'), JSON.stringify(this.introductions));
        localStorage.setItem(App.getStorageKey('feedingType'), this.feedingType);
    },

    getMenuRecommendation(ageM) {
        if (ageM < 4) {
            if (this.feedingType === 'natural') return 'Исключительно грудное вскармливание по требованию. Прикорм не требуется.';
            if (this.feedingType === 'artificial') return 'Кормление адаптированной молочной смесью (например, NAN 1) по режиму. Прикорм не требуется.';
            return 'Грудное молоко + докорм смесью (например, NAN 1) при нехватке молока. Прикорм не требуется.';
        }
        if (ageM >= 4 && ageM < 6) {
            if (this.feedingType === 'artificial' || this.feedingType === 'mixed') {
                return 'Продолжаем кормление молочной смесью (NAN 1). Возможно раннее введение прикорма (овощное пюре или каши) в «критическое окно» по рекомендации педиатра.';
            }
            return 'Продолжаем грудное вскармливание. Идеальное время для начала первого прикорма (овощное пюре или безглютеновые каши) — 5-6 месяцев.';
        }
        if (ageM >= 6 && ageM < 12) {
            const mixture = ageM >= 6 ? 'NAN 2' : 'смесь 2 ступени';
            if (this.feedingType === 'natural') return 'Грудное вскармливание сохраняется по требованию. Активно вводится прикорм в 3-4 приема (каши, мясо, овощи, фрукты).';
            if (this.feedingType === 'artificial') return `Кормление молочной смесью (${mixture}) 2-3 раза в день. Продукты прикорма составляют основу рациона (4-5 приемов пищи).`;
            return `Грудное молоко и докорм смесью (${mixture}) утром/вечером. В течение дня — полноценные порции прикорма.`;
        }
        return 'Ребенок может быть переведен на общий семейный стол с постепенным отказом от детского баночного питания. Грудное вскармливание или смесь (NAN 3/4) сохраняется по желанию.';
    },

    render() {
        const ageM = this.childInfo ? Utils.calculateAgeInMonths(this.childInfo.birthdate) : 0;
        const availableFoods = this.complementaryFoods.filter(f => f.ageMonths <= Math.max(ageM, 4));
        const menuRec = this.getMenuRecommendation(ageM);

        this.container.innerHTML = `
            <div class="feed-wrapper">
                <div class="tabs animate-in" id="feed-tabs">
                    <button class="tab active" data-tab="rules">Нормы и Аллергены</button>
                    <button class="tab" data-tab="schedule">Схема и Меню</button>
                    <button class="tab" data-tab="diary">Дневник</button>
                </div>

                <div id="feed-rules" class="feed-tab-content">
                    <div class="card animate-in stagger-1">
                        <div class="section-header">
                            <span class="card-title"><i class="fas fa-book-medical" style="color:var(--primary);margin-right:8px;"></i>Национальная программа РФ</span>
                        </div>
                        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1rem;">
                            Введение прикорма целесообразно проводить в «критическое окно» - период с 4 до 6 месяцев.
                        </p>
                        <h4 style="margin-top:1.5rem; margin-bottom:0.5rem; color:var(--text)">Признаки готовности к прикорму:</h4>
                        <ul style="padding-left:1.5rem; font-size:0.9rem; color:var(--text-secondary); line-height:1.6">
                            <li>Ребенок сидит с поддержкой, уверенно держит голову</li>
                            <li>Угас рефлекс «выталкивания» (не выталкивает ложку)</li>
                            <li>Проявляет активный пищевой интерес</li>
                        </ul>
                        <div style="margin-top:1.5rem; padding:1rem; background:var(--error-bg); border-radius:var(--radius); border-left:4px solid var(--error);">
                            <h4 style="color:var(--error); margin-bottom:0.5rem;"><i class="fas fa-ban" style="margin-right:8px;"></i>Запрещенные продукты до 1 года:</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 0;">Мед, коровье и козье молоко (как напиток), чай, кофе, соки, соль, сахар, цельные орехи, сырое мясо и яйца.</p>
                        </div>
                    </div>

                    <div class="card animate-in stagger-2" style="margin-top:1.5rem;">
                        <div class="section-header">
                            <span class="card-title"><i class="fas fa-triangle-exclamation" style="color:var(--warning);margin-right:8px;"></i>Введение Аллергенов</span>
                        </div>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
                            Введение аллергенов следует проводить по одному, в микродозах в первой половине дня, внимательно отслеживая реакцию в течение 2-3 суток. Нельзя откладывать введение аллергенов (доказано, что позднее введение не снижает, а повышает риск аллергии).
                        </p>
                        <div class="grid-2">
                            ${this.allergens.map(a => `
                            <div style="padding:0.75rem; background:var(--bg-secondary); border-radius:var(--radius-sm); border-left:3px solid var(--warning);">
                                <h5 style="margin-bottom:0.25rem;">${a.name}</h5>
                                <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">${a.desc}</p>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div id="feed-schedule" class="feed-tab-content" style="display:none">
                    <div class="card animate-in stagger-1" style="margin-bottom:1.5rem;">
                        <div class="form-group" style="margin-bottom:1rem;">
                            <label for="feeding-type-select">Тип вскармливания</label>
                            <select id="feeding-type-select">
                                <option value="natural" ${this.feedingType === 'natural' ? 'selected' : ''}>Естественное (грудное)</option>
                                <option value="artificial" ${this.feedingType === 'artificial' ? 'selected' : ''}>Искусственное (смеси)</option>
                                <option value="mixed" ${this.feedingType === 'mixed' ? 'selected' : ''}>Смешанное (ГВ + смесь)</option>
                            </select>
                        </div>
                        <div style="padding:1rem; background:rgba(99, 102, 241, 0.05); border-radius:var(--radius); border-left:4px solid var(--primary);">
                            <h4 style="color:var(--primary); margin-bottom:0.5rem; font-size:0.95rem;">Рекомендация для ${ageM} мес:</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;" id="menu-rec-text">${menuRec}</p>
                        </div>
                    </div>

                    ${this.renderIntroTracker()}

                    <div class="feed-table-wrap card animate-in stagger-3">
                        <table class="data-table">
                            <thead>
                                <tr><th>Возраст</th><th>Категория</th><th>Продукты</th><th>Норма</th></tr>
                            </thead>
                            <tbody>
                                ${availableFoods.map(f => `
                                    <tr class="${f.ageMonths > ageM ? 'feed-future' : ''}">
                                        <td><span class="badge ${f.ageMonths <= ageM ? 'badge-success' : 'badge-muted'}">${f.ageMonths} мес</span></td>
                                        <td style="font-weight:550">${f.category}</td>
                                        <td>${f.products.map(p => `<span class="chip">${p}</span>`).join(' ')}</td>
                                        <td>${f.portion}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="feed-diary" class="feed-tab-content" style="display:none">
                    <div class="section-header animate-in">
                        <div>
                            <span class="section-title">Пищевой Дневник</span>
                            <p class="section-desc">Отслеживание реакций на продукты</p>
                        </div>
                        <button id="add-feeding" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Запись</button>
                    </div>
                    <div id="feed-diary-list" class="animate-in stagger-1">
                        ${this.renderDiary()}
                    </div>
                </div>
            </div>
        `;
    },

    renderIntroTracker() {
        const activeIntro = this.introductions.find(i => !i.finished);
        if (!activeIntro) {
            return `
                <div class="card animate-in stagger-2" style="margin-bottom:1.5rem; text-align:center; padding:1.5rem; background:rgba(99,102,241,0.03); border:1px dashed var(--primary-light);">
                    <i class="fas fa-seedling" style="font-size:2rem; color:var(--primary); margin-bottom:1rem; opacity:0.7;"></i>
                    <h4 style="margin-bottom:0.5rem; color:var(--text);">Введение нового продукта</h4>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">Система автоматически рассчитывает схему прикорма по дням (формула РФ).</p>
                    <button class="btn btn-primary btn-sm" id="btn-start-intro"><i class="fas fa-plus"></i> Начать введение</button>
                </div>
            `;
        }

        const currentDay = activeIntro.daysCompleted + 1;
        const totalDays = activeIntro.schedule.length;
        const todayPortion = activeIntro.schedule[activeIntro.daysCompleted] || activeIntro.targetPortion;
        const progress = (activeIntro.daysCompleted / totalDays) * 100;

        return `
            <div class="card animate-in stagger-2" style="margin-bottom:1.5rem; border-color:var(--primary-light);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <div>
                        <h4 style="margin:0; color:var(--primary); display:flex; align-items:center; gap:0.5rem;">
                            <i class="fas fa-spinner fa-spin" style="font-size:0.9rem"></i> Вводим: ${activeIntro.product}
                        </h4>
                        <span style="font-size:0.8rem; color:var(--text-muted);">День ${currentDay} из ${totalDays}</span>
                    </div>
                    <div>
                        <button class="btn-icon text-danger" id="btn-cancel-intro" data-tooltip="Отменить"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                
                <div style="background:var(--bg-secondary); padding:1rem; border-radius:var(--radius-sm); margin-bottom:1rem; text-align:center;">
                    <div style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Порция на сегодня (формула)</div>
                    <div style="font-size:1.75rem; font-weight:700; color:var(--text);">${todayPortion} г</div>
                </div>
                
                <div style="height:6px; background:var(--bg-secondary); border-radius:3px; overflow:hidden; margin-bottom:1rem;">
                    <div style="height:100%; width:${progress}%; background:var(--primary); transition:width 0.3s ease;"></div>
                </div>
                
                <button class="btn btn-primary" id="btn-next-day-intro" style="width:100%;">
                    <i class="fas fa-check"></i> Отметить ${todayPortion}г выполненным
                </button>
            </div>
        `;
    },

    renderDiary() {
        if (this.diary.length === 0) return '<div class="empty-state card"><p>Нет записей.</p></div>';
        return this.diary.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
            <div class="card feed-diary-card" style="margin-bottom:1rem;">
                <div class="feed-diary-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="display:block;">${entry.product}</strong>
                        <span style="font-size:0.8rem; color:var(--text-secondary);">${Utils.formatDateShort(entry.date)}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="badge ${entry.reaction === 'good' ? 'badge-success' : entry.reaction === 'allergy' ? 'badge-error' : 'badge-warning'}">
                            ${entry.reaction === 'good' ? 'Норма' : entry.reaction === 'allergy' ? 'Аллергия' : 'Внимание'}
                        </span>
                        <button class="btn-icon btn-del-f" data-id="${entry.id}"><i class="fas fa-trash-can"></i></button>
                    </div>
                </div>
                ${entry.notes ? `<p style="font-size:0.85rem; margin-top:0.5rem; color:var(--text-secondary);">${entry.notes}</p>` : ''}
            </div>
        `).join('');
    },

    setupEventListeners() {
        this.container.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                document.getElementById('feed-rules').style.display = target === 'rules' ? '' : 'none';
                document.getElementById('feed-schedule').style.display = target === 'schedule' ? '' : 'none';
                document.getElementById('feed-diary').style.display = target === 'diary' ? '' : 'none';
            });
        });

        const feedTypeSelect = document.getElementById('feeding-type-select');
        if (feedTypeSelect) {
            feedTypeSelect.addEventListener('change', (e) => {
                this.feedingType = e.target.value;
                this.saveDiary();
                const ageM = this.childInfo ? Utils.calculateAgeInMonths(this.childInfo.birthdate) : 0;
                document.getElementById('menu-rec-text').innerText = this.getMenuRecommendation(ageM);
            });
        }

        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.id === 'add-feeding') this.showAddFeedingModal();
            else if (btn.id === 'btn-start-intro') this.showStartIntroModal();
            else if (btn.id === 'btn-cancel-intro') {
                const active = this.introductions.find(i => !i.finished);
                if (active) active.finished = true;
                this.saveDiary();
                this.render();
            }
            else if (btn.id === 'btn-next-day-intro') {
                const active = this.introductions.find(i => !i.finished);
                if (active) {
                    // Record in diary automatically
                    this.diary.push({
                        id: Date.now().toString(),
                        product: active.product,
                        date: Utils.dateToISO(new Date()),
                        reaction: 'good',
                        notes: `День ${active.daysCompleted + 1}: дал(а) ${active.schedule[active.daysCompleted]}г.`
                    });
                    
                    active.daysCompleted++;
                    if (active.daysCompleted >= active.schedule.length) {
                        active.finished = true;
                        Utils.showNotification('Введение продукта успешно завершено!', 'success');
                    } else {
                        Utils.showNotification('День введения отмечен', 'info');
                    }
                    this.saveDiary();
                    this.render();
                }
            }
            else if (btn.classList.contains('btn-del-f')) {
                this.diary = this.diary.filter(d => d.id !== btn.dataset.id);
                this.saveDiary();
                const list = document.getElementById('feed-diary-list');
                if (list) list.innerHTML = this.renderDiary();
            }
        });
    },

    showStartIntroModal() {
        Utils.showModal('Новое введение', `
            <form id="intro-form">
                <div class="form-group">
                    <label>Продукт</label>
                    <input type="text" id="i-product" placeholder="Например: Кабачок" required>
                </div>
                <div class="form-group">
                    <label>Целевая порция (г)</label>
                    <input type="number" id="i-target" value="150" required>
                </div>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1rem;">
                    Схема: 1 ч.л. (5г) в 1-й день, затем удвоение до целевой порции за 5-7 дней согласно рекомендациям РФ.
                </p>
                <button type="submit" class="btn btn-primary" style="width:100%">Начать по формуле</button>
            </form>
        `);
        document.getElementById('intro-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const target = parseInt(document.getElementById('i-target').value);
            let schedule = [];
            let val = 5;
            while(val < target) {
                schedule.push(val);
                val *= 2;
                if (val > target && schedule[schedule.length-1] !== target) val = target;
            }
            if (schedule[schedule.length-1] !== target) schedule.push(target);

            this.introductions.push({
                product: document.getElementById('i-product').value,
                targetPortion: target,
                daysCompleted: 0,
                schedule: schedule,
                finished: false
            });
            this.saveDiary();
            Utils.closeModal();
            this.render();
            Utils.showNotification('Введение начато', 'success');
        });
    },

    showAddFeedingModal() {
        Utils.showModal('Дневник', `
            <form id="feeding-form">
                <div class="form-group">
                    <label>Продукт</label>
                    <input type="text" id="f-product" required>
                </div>
                <div class="form-group">
                    <label>Дата</label>
                    <input type="date" id="f-date" value="${Utils.dateToISO(new Date())}" required>
                </div>
                <div class="form-group">
                    <label>Реакция</label>
                    <select id="f-reaction" required>
                        <option value="good">Хорошая</option>
                        <option value="caution">Внимание</option>
                        <option value="allergy">Аллергия</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Заметки</label>
                    <textarea id="f-notes" rows="2"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Сохранить</button>
            </form>
        `);
        document.getElementById('feeding-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.diary.push({
                id: Date.now().toString(),
                product: document.getElementById('f-product').value,
                date: document.getElementById('f-date').value,
                reaction: document.getElementById('f-reaction').value,
                notes: document.getElementById('f-notes').value
            });
            this.saveDiary();
            Utils.closeModal();
            const list = document.getElementById('feed-diary-list');
            if (list) list.innerHTML = this.renderDiary();
        });
    }
};
