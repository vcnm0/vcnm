// js/npr.js — Нервно-психическое развитие

const NPR = {
    childInfo: null,
    progress: {},

    // Оценка НПР по линиям развития
    milestones: [
        // 1 месяц
        { ageMonths: 1, category: 'Моторика', skill: 'Удерживает голову лежа на животе на несколько секунд', id: 'm1_1' },
        { ageMonths: 1, category: 'Сенсорное', skill: 'Фиксирует взгляд на лице взрослого', id: 's1_1' },
        { ageMonths: 1, category: 'Речь', skill: 'Издает отдельные гортанные звуки', id: 'r1_1' },
        { ageMonths: 1, category: 'Социальное', skill: 'Первая улыбка в ответ на обращение', id: 'so1_1' },
        // 3 месяца
        { ageMonths: 3, category: 'Моторика', skill: 'Уверенно держит голову в вертикальном положении', id: 'm3_1' },
        { ageMonths: 3, category: 'Моторика', skill: 'Опирается на предплечья лежа на животе', id: 'm3_2' },
        { ageMonths: 3, category: 'Сенсорное', skill: 'Следит за движущимся предметом', id: 's3_1' },
        { ageMonths: 3, category: 'Речь', skill: 'Гуление — протяжные гласные звуки', id: 'r3_1' },
        { ageMonths: 3, category: 'Социальное', skill: 'Комплекс оживления при общении со взрослым', id: 'so3_1' },
        // 6 месяцев
        { ageMonths: 6, category: 'Моторика', skill: 'Переворачивается со спины на живот и обратно', id: 'm6_1' },
        { ageMonths: 6, category: 'Моторика', skill: 'Сидит с поддержкой, берет игрушку', id: 'm6_2' },
        { ageMonths: 6, category: 'Сенсорное', skill: 'Различает знакомых и незнакомых людей', id: 's6_1' },
        { ageMonths: 6, category: 'Речь', skill: 'Лепет — повторение слогов (ба-ба, ма-ма)', id: 'r6_1' },
        { ageMonths: 6, category: 'Социальное', skill: 'Реагирует на свое имя', id: 'so6_1' },
        // 9 месяцев
        { ageMonths: 9, category: 'Моторика', skill: 'Сидит самостоятельно, ползает', id: 'm9_1' },
        { ageMonths: 9, category: 'Моторика', skill: 'Встает у опоры', id: 'm9_2' },
        { ageMonths: 9, category: 'Сенсорное', skill: 'Понимает слово "нельзя"', id: 's9_1' },
        { ageMonths: 9, category: 'Речь', skill: 'Произносит отдельные слоги осознанно', id: 'r9_1' },
        { ageMonths: 9, category: 'Социальное', skill: 'Играет в ладушки, подражает действиям', id: 'so9_1' },
        // 12 месяцев
        { ageMonths: 12, category: 'Моторика', skill: 'Ходит самостоятельно или с поддержкой', id: 'm12_1' },
        { ageMonths: 12, category: 'Моторика', skill: 'Пинцетный захват мелких предметов', id: 'm12_2' },
        { ageMonths: 12, category: 'Речь', skill: 'Произносит 8-10 слов', id: 'r12_1' },
        { ageMonths: 12, category: 'Речь', skill: 'Понимает простые просьбы', id: 'r12_2' },
        { ageMonths: 12, category: 'Социальное', skill: 'Указывает пальцем на предметы', id: 'so12_1' },
        // 18 месяцев
        { ageMonths: 18, category: 'Моторика', skill: 'Уверенно ходит, начинает бегать', id: 'm18_1' },
        { ageMonths: 18, category: 'Моторика', skill: 'Собирает пирамидку из 3-4 колец', id: 'm18_2' },
        { ageMonths: 18, category: 'Речь', skill: 'Словарный запас 15-20 слов', id: 'r18_1' },
        { ageMonths: 18, category: 'Социальное', skill: 'Пьет из чашки, ест ложкой', id: 'so18_1' },
        // 24 месяца
        { ageMonths: 24, category: 'Моторика', skill: 'Бегает координированно, поднимается по лестнице', id: 'm24_1' },
        { ageMonths: 24, category: 'Речь', skill: 'Строит фразы из 2-3 слов', id: 'r24_1' },
        { ageMonths: 24, category: 'Речь', skill: 'Словарный запас 50-200 слов', id: 'r24_2' },
        { ageMonths: 24, category: 'Социальное', skill: 'Подражательная игра (кормит куклу)', id: 'so24_1' },
        // 36 месяцев
        { ageMonths: 36, category: 'Моторика', skill: 'Прыгает на двух ногах, катается на трёхколесном велосипеде', id: 'm36_1' },
        { ageMonths: 36, category: 'Речь', skill: 'Говорит предложениями из 3-5 слов', id: 'r36_1' },
        { ageMonths: 36, category: 'Речь', skill: 'Задает вопросы "Почему?", "Где?"', id: 'r36_2' },
        { ageMonths: 36, category: 'Социальное', skill: 'Сюжетно-ролевая игра, контакт со сверстниками', id: 'so36_1' },
        { ageMonths: 36, category: 'Социальное', skill: 'Одевается с помощью взрослого', id: 'so36_2' },
    ],

    categoryIcons: {
        'Моторика': 'fa-person-running',
        'Сенсорное': 'fa-eye',
        'Речь': 'fa-comment',
        'Социальное': 'fa-users'
    },

    categoryColors: {
        'Моторика': 'var(--primary)',
        'Сенсорное': 'var(--accent)',
        'Речь': 'var(--warning)',
        'Социальное': 'var(--success)'
    },

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadProgress();
        this.render();
        this.setupEventListeners();

    },

    loadProgress() {
        const saved = localStorage.getItem(App.getStorageKey('nprProgress'));
        if (saved) this.progress = JSON.parse(saved);
    },

    saveProgress() {
        localStorage.setItem(App.getStorageKey('nprProgress'), JSON.stringify(this.progress));
    },

    render() {
        const ageM = this.childInfo ? Utils.calculateAgeInMonths(this.childInfo.birthdate) : 0;
        const totalRelevant = this.milestones.filter(m => m.ageMonths <= ageM).length;
        const completedRelevant = this.milestones.filter(m => m.ageMonths <= ageM && this.progress[m.id]).length;
        const pct = totalRelevant ? Math.round((completedRelevant / totalRelevant) * 100) : 0;

        // Group by age
        const groups = {};
        this.milestones.forEach(m => {
            const label = m.ageMonths + ' мес';
            if (!groups[m.ageMonths]) groups[m.ageMonths] = { label, items: [] };
            groups[m.ageMonths].items.push(m);
        });

        this.container.innerHTML = `
            <div class="npr-wrapper">
                <div class="card npr-summary animate-in">
                    <div class="npr-summary-row">
                        <div>
                            <span class="card-title">Прогресс развития</span>
                            <p class="section-desc">${completedRelevant} из ${totalRelevant} навыков освоено</p>
                        </div>
                        <div class="npr-pct">${pct}%</div>
                    </div>
                    <div class="progress-bar" style="margin-top:0.75rem">
                        <div class="progress-bar-fill" style="width:${pct}%"></div>
                    </div>
                    <div class="npr-legend">
                        ${Object.entries(this.categoryIcons).map(([cat, icon]) => `
                            <span class="npr-legend-item"><i class="fas ${icon}" style="color:${this.categoryColors[cat]}"></i> ${cat}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="npr-age-groups">
                    ${Object.entries(groups).map(([age, group], idx) => {
                        const isRelevant = parseInt(age) <= ageM;
                        const groupDone = group.items.filter(m => this.progress[m.id]).length;
                        return `
                        <div class="npr-age-group card animate-in stagger-${Math.min(idx + 1, 6)} ${isRelevant ? '' : 'npr-future'}">
                            <div class="npr-group-header">
                                <h4>${group.label}</h4>
                                <span class="badge ${groupDone === group.items.length ? 'badge-success' : isRelevant ? 'badge-info' : 'badge-muted'}">${groupDone}/${group.items.length}</span>
                            </div>
                            <div class="npr-skills">
                                ${group.items.map(m => `
                                    <label class="npr-skill ${this.progress[m.id] ? 'npr-skill-done' : ''}">
                                        <input type="checkbox" class="npr-check" data-id="${m.id}" ${this.progress[m.id] ? 'checked' : ''}>
                                        <div class="npr-skill-info">
                                            <i class="fas ${this.categoryIcons[m.category]}" style="color:${this.categoryColors[m.category]}"></i>
                                            <span>${m.skill}</span>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    setupEventListeners() {
        this.container.addEventListener('change', (e) => {
            if (e.target.classList.contains('npr-check')) {
                const id = e.target.dataset.id;
                this.progress[id] = e.target.checked;
                this.saveProgress();
                this.render();

                Utils.showNotification(e.target.checked ? 'Навык отмечен' : 'Отметка снята', 'info');
            }
        });
    }
};
