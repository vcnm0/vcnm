// js/checkup.js — Профосмотры по Приказу Минздрава No 211н

const Checkup = {
    checkups: [],
    childInfo: null,

    // Расписание осмотров по Приказу No 211н
    schedule: [
        { ageMonths: 0, label: 'Новорожденный', specialists: ['Педиатр'], tests: ['Неонатальный скрининг', 'Аудиологический скрининг'] },
        { ageMonths: 1, label: '1 месяц', specialists: ['Педиатр','Детский хирург','Офтальмолог'], tests: ['УЗИ брюшной полости', 'УЗИ почек', 'УЗИ тазобедренных суставов', 'Эхокардиография', 'Нейросонография', 'Офтальмоскопия'] },
        { ageMonths: 2, label: '2 месяца', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 3, label: '3 месяца', specialists: ['Педиатр','Невролог','Травматолог-ортопед'], tests: ['Общий анализ крови', 'Общий анализ мочи'] },
        { ageMonths: 4, label: '4 месяца', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 5, label: '5 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 6, label: '6 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 7, label: '7 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 8, label: '8 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 9, label: '9 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 10, label: '10 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 11, label: '11 месяцев', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 12, label: '1 год', specialists: ['Педиатр','Невролог','Детский хирург','Офтальмолог','Оториноларинголог','Детский стоматолог'], tests: ['Общий анализ крови','Общий анализ мочи','Офтальмоскопия', 'Исследование отоакустической эмиссии', 'ЭКГ'] },
        { ageMonths: 15, label: '1 год 3 месяца', specialists: ['Педиатр'], tests: [] },
        { ageMonths: 18, label: '1 год 6 месяцев', specialists: ['Педиатр','Невролог'], tests: ['Скрининг развития'] },
        { ageMonths: 24, label: '2 года', specialists: ['Педиатр','Детский стоматолог','Детский психиатр'], tests: ['Скрининг развития'] },
        { ageMonths: 36, label: '3 года', specialists: ['Педиатр','Невролог','Детский хирург','Детский стоматолог','Офтальмолог','Оториноларинголог'], tests: ['Общий анализ крови','Общий анализ мочи'] },
        { ageMonths: 48, label: '4 года', specialists: ['Педиатр','Детский стоматолог'], tests: [] },
        { ageMonths: 60, label: '5 лет', specialists: ['Педиатр','Детский стоматолог'], tests: [] },
        { ageMonths: 72, label: '6 лет', specialists: ['Педиатр','Невролог','Детский хирург','Детский стоматолог','Травматолог-ортопед','Офтальмолог','Оториноларинголог','Детский психиатр','Акушер-гинеколог / Детский уролог'], tests: ['Общий анализ крови','Общий анализ мочи','УЗИ органов брюшной полости','УЗИ почек','Эхокардиография','ЭКГ'] },
        { ageMonths: 84, label: '7 лет', specialists: ['Педиатр','Невролог','Детский стоматолог','Офтальмолог'], tests: [] },
        { ageMonths: 96, label: '8 лет', specialists: ['Педиатр','Детский стоматолог'], tests: [] },
        { ageMonths: 108, label: '9 лет', specialists: ['Педиатр','Детский стоматолог'], tests: [] },
        { ageMonths: 120, label: '10 лет', specialists: ['Педиатр','Невролог','Детский стоматолог','Детский эндокринолог','Детский хирург','Офтальмолог'], tests: ['Общий анализ крови','Общий анализ мочи','Холестерин'] },
        { ageMonths: 132, label: '11 лет', specialists: ['Педиатр','Детский стоматолог'], tests: [] },
        { ageMonths: 144, label: '12 лет', specialists: ['Педиатр','Детский стоматолог','Детский психиатр','Травматолог-ортопед'], tests: [] },
        { ageMonths: 156, label: '13 лет', specialists: ['Педиатр','Детский стоматолог','Акушер-гинеколог / Детский уролог','Офтальмолог'], tests: [] },
        { ageMonths: 168, label: '14 лет', specialists: ['Педиатр','Детский хирург','Детский психиатр','Акушер-гинеколог / Детский уролог','Детский стоматолог'], tests: [] },
        { ageMonths: 180, label: '15 лет', specialists: ['Педиатр','Детский хирург','Детский стоматолог','Акушер-гинеколог / Детский уролог','Детский эндокринолог','Невролог','Травматолог-ортопед','Офтальмолог','Оториноларинголог','Детский психиатр'], tests: ['Общий анализ крови','Общий анализ мочи','УЗИ органов брюшной полости','УЗИ почек','ЭКГ'] },
        { ageMonths: 192, label: '16 лет', specialists: ['Педиатр','Детский хирург','Детский стоматолог','Невролог','Офтальмолог','Акушер-гинеколог / Детский уролог','Детский психиатр'], tests: ['Общий анализ крови', 'Общий анализ мочи'] },
        { ageMonths: 204, label: '17 лет', specialists: ['Педиатр','Детский хирург','Детский стоматолог','Детский эндокринолог','Невролог','Травматолог-ортопед','Офтальмолог','Оториноларинголог','Акушер-гинеколог / Детский уролог','Детский психиатр'], tests: ['Общий анализ крови','Общий анализ мочи','ЭКГ'] }
    ],

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadCheckups();
        this.render();
        this.setupEventListeners();
    },

    loadCheckups() {
        const saved = localStorage.getItem(App.getStorageKey('checkups'));
        if (saved) this.checkups = JSON.parse(saved);
    },

    saveCheckups() {
        localStorage.setItem(App.getStorageKey('checkups'), JSON.stringify(this.checkups));
    },

    render() {
        const ageM = this.childInfo ? Utils.calculateAgeInMonths(this.childInfo.birthdate) : 0;

        this.container.innerHTML = `
            <div class="checkup-wrapper">
                <div class="section-header animate-in">
                    <div>
                        <span class="section-title">Расписание осмотров</span>
                        <p class="section-desc">По Приказу Минздрава РФ No 211н</p>
                    </div>
                    <button id="add-checkup" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Записать осмотр</button>
                </div>

                <div class="checkup-timeline animate-in stagger-1">
                    ${this.schedule.map((s, i) => {
                        const done = this.checkups.some(c => c.scheduleAge === s.ageMonths);
                        const current = !done && ageM >= s.ageMonths && (!this.schedule[i+1] || ageM < this.schedule[i+1].ageMonths);
                        const future = ageM < s.ageMonths;
                        const overdue = !done && ageM >= s.ageMonths && !current;
                        return `
                        <div class="checkup-item ${done ? 'done' : current ? 'current' : overdue ? 'overdue' : 'future'}">
                            <div class="checkup-marker">
                                <div class="checkup-dot">${done ? '<i class="fas fa-check"></i>' : ''}</div>
                                ${i < this.schedule.length - 1 ? '<div class="checkup-line"></div>' : ''}
                            </div>
                            <div class="checkup-content card">
                                <div class="checkup-content-header">
                                    <h4>${s.label}</h4>
                                    <span class="badge ${done ? 'badge-success' : current ? 'badge-info' : overdue ? 'badge-error' : 'badge-muted'}">${done ? 'Пройден' : current ? 'Текущий' : overdue ? 'Просрочен' : 'Впереди'}</span>
                                </div>
                                <div class="checkup-specialists">
                                    ${s.specialists.map(sp => `<span class="chip">${sp}</span>`).join('')}
                                </div>
                                ${s.tests.length ? `<div class="checkup-tests">
                                    <span class="checkup-tests-label">Обследования:</span>
                                    ${s.tests.map(t => `<span class="chip chip-primary">${t}</span>`).join('')}
                                </div>` : ''}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>

                ${this.checkups.length > 0 ? `
                <div class="card animate-in stagger-2">
                    <div class="card-header"><span class="card-title">Пройденные осмотры</span></div>
                    <table class="data-table">
                        <thead><tr><th>Дата</th><th>Возраст</th><th>Специалисты</th><th>Заметки</th><th></th></tr></thead>
                        <tbody>
                            ${this.checkups.sort((a,b) => new Date(b.date) - new Date(a.date)).map(c => `
                                <tr>
                                    <td>${Utils.formatDateShort(c.date)}</td>
                                    <td>${this.schedule.find(s => s.ageMonths === c.scheduleAge)?.label || c.scheduleAge + ' мес'}</td>
                                    <td>${(c.specialists || []).map(s => `<span class="chip">${s}</span>`).join(' ')}</td>
                                    <td style="font-size:0.82rem;color:var(--text-secondary)">${c.notes || '--'}</td>
                                    <td><button class="btn-icon btn-del-c" data-id="${c.id}"><i class="fas fa-trash-can"></i></button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
            </div>
        `;
    },

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.id === 'add-checkup') this.showCheckupModal();
            else if (btn.classList.contains('btn-del-c')) {
                const id = btn.dataset.id;
                this.checkups = this.checkups.filter(c => c.id !== id);
                this.saveCheckups();
                this.render();

                Utils.showNotification('Осмотр удален', 'warning');
            }
        });
    },

    showCheckupModal() {
        const options = this.schedule.map(s =>
            `<option value="${s.ageMonths}">${s.label}</option>`
        ).join('');

        Utils.showModal('Записать осмотр', `
            <form id="checkup-form">
                <div class="form-group">
                    <label for="c-age">Возрастной этап</label>
                    <select id="c-age" required>${options}</select>
                </div>
                <div class="form-group">
                    <label for="c-date">Дата осмотра</label>
                    <input type="date" id="c-date" required>
                </div>
                <div class="form-group">
                    <label for="c-specs">Специалисты (через запятую)</label>
                    <input type="text" id="c-specs" placeholder="Педиатр, Невролог...">
                </div>
                <div class="form-group">
                    <label for="c-notes">Заметки</label>
                    <textarea id="c-notes" rows="3" placeholder="Результаты, рекомендации..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Сохранить</button>
            </form>
        `);

        const ageSelect = document.getElementById('c-age');
        const specsInput = document.getElementById('c-specs');

        ageSelect.addEventListener('change', () => {
            const s = this.schedule.find(sc => sc.ageMonths === parseInt(ageSelect.value));
            if (s) specsInput.value = s.specialists.join(', ');
        });
        // Pre-fill
        const first = this.schedule.find(sc => sc.ageMonths === parseInt(ageSelect.value));
        if (first) specsInput.value = first.specialists.join(', ');

        document.getElementById('checkup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkups.push({
                id: Date.now().toString(),
                scheduleAge: parseInt(ageSelect.value),
                date: document.getElementById('c-date').value,
                specialists: specsInput.value.split(',').map(s => s.trim()).filter(Boolean),
                notes: document.getElementById('c-notes').value
            });
            this.saveCheckups();
            Utils.closeModal();
            this.render();

            Utils.showNotification('Осмотр записан', 'success');
        });
    }
};
