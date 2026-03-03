// js/vaccines.js

const Vaccines = {
    vaccines: [],
    childInfo: null,

    standardVaccines: [
        { name: 'Гепатит В', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'БЦЖ', dose: '0.05 мл', administration: 'Внутрикожно' },
        { name: 'БЦЖ-М', dose: '0.025 мл', administration: 'Внутрикожно' },
        { name: 'Пневмококковая', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'АКДС', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'ИПВ', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'ОПВ', dose: '2 капли', administration: 'Перорально' },
        { name: 'Гемофильная инфекция тип b', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'Корь', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'Краснуха', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'Эпидемический паротит', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'КПК', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'АДС-М', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'Грипп', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'Менингококковая', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'Ротавирусная', dose: '1.5 мл', administration: 'Перорально' },
        { name: 'Ветряная оспа', dose: '0.5 мл', administration: 'Подкожно' },
    ],

    administrationRoutes: ['Внутримышечно', 'Подкожно', 'Внутрикожно', 'Перорально'],

    // Национальный календарь по Приказу Минздрава РФ No 1122н от 06.12.2021
    // scheduledDays - дни от рождения
    defaultSchedule: [
        { id: 1,  name: 'Гепатит В',                    scheduledDays: 0,    type: 'V1',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '24 часа',     completed: false },
        { id: 2,  name: 'БЦЖ-М',                        scheduledDays: 5,    type: 'V',   dose: '0.025 мл', administration: 'Внутрикожно', ageLabel: '3-7 дней',   completed: false },
        { id: 3,  name: 'Гепатит В',                    scheduledDays: 30,   type: 'V2',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '1 месяц',    completed: false },
        { id: 4,  name: 'Пневмококковая',               scheduledDays: 60,   type: 'V1',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '2 месяца',   completed: false },
        { id: 5,  name: 'АКДС',                         scheduledDays: 90,   type: 'V1',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '3 месяца',   completed: false },
        { id: 6,  name: 'ИПВ',                          scheduledDays: 90,   type: 'V1',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '3 месяца',   completed: false },
        { id: 7,  name: 'Гемофильная инфекция тип b',   scheduledDays: 90,   type: 'V1',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '3 месяца',   completed: false },
        { id: 8,  name: 'АКДС',                         scheduledDays: 135,  type: 'V2',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '4.5 месяца', completed: false },
        { id: 9,  name: 'ИПВ',                          scheduledDays: 135,  type: 'V2',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '4.5 месяца', completed: false },
        { id: 10, name: 'Пневмококковая',               scheduledDays: 135,  type: 'V2',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '4.5 месяца', completed: false },
        { id: 11, name: 'Гемофильная инфекция тип b',   scheduledDays: 135,  type: 'V2',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '4.5 месяца', completed: false },
        { id: 12, name: 'АКДС',                         scheduledDays: 180,  type: 'V3',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '6 месяцев',  completed: false },
        { id: 13, name: 'Гепатит В',                    scheduledDays: 180,  type: 'V3',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '6 месяцев',  completed: false },
        { id: 14, name: 'ИПВ',                          scheduledDays: 180,  type: 'V3',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '6 месяцев',  completed: false },
        { id: 15, name: 'Гемофильная инфекция тип b',   scheduledDays: 180,  type: 'V3',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '6 месяцев',  completed: false },
        { id: 16, name: 'Корь',                         scheduledDays: 365,  type: 'V1',  dose: '0.5 мл', administration: 'Подкожно',      ageLabel: '12 месяцев', completed: false },
        { id: 17, name: 'Краснуха',                     scheduledDays: 365,  type: 'V1',  dose: '0.5 мл', administration: 'Подкожно',      ageLabel: '12 месяцев', completed: false },
        { id: 18, name: 'Эпидемический паротит',        scheduledDays: 365,  type: 'V1',  dose: '0.5 мл', administration: 'Подкожно',      ageLabel: '12 месяцев', completed: false },
        { id: 19, name: 'Пневмококковая',               scheduledDays: 450,  type: 'RV',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '15 месяцев', completed: false },
        { id: 20, name: 'АКДС',                         scheduledDays: 540,  type: 'RV1', dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '18 месяцев', completed: false },
        { id: 21, name: 'ИПВ',                          scheduledDays: 540,  type: 'RV1', dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '18 месяцев', completed: false },
        { id: 22, name: 'Гемофильная инфекция тип b',   scheduledDays: 540,  type: 'RV',  dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '18 месяцев', completed: false },
        { id: 23, name: 'ИПВ',                          scheduledDays: 600,  type: 'RV2', dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '20 месяцев', completed: false },
        { id: 24, name: 'Корь',                         scheduledDays: 2190, type: 'RV',  dose: '0.5 мл', administration: 'Подкожно',      ageLabel: '6 лет',      completed: false },
        { id: 25, name: 'Краснуха',                     scheduledDays: 2190, type: 'RV',  dose: '0.5 мл', administration: 'Подкожно',      ageLabel: '6 лет',      completed: false },
        { id: 26, name: 'Эпидемический паротит',        scheduledDays: 2190, type: 'RV',  dose: '0.5 мл', administration: 'Подкожно',      ageLabel: '6 лет',      completed: false },
        { id: 27, name: 'ИПВ',                          scheduledDays: 2190, type: 'RV3', dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '6 лет',      completed: false },
        { id: 28, name: 'АДС-М',                        scheduledDays: 2370, type: 'RV2', dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '6-7 лет',    completed: false },
        { id: 29, name: 'АДС-М',                        scheduledDays: 5110, type: 'RV3', dose: '0.5 мл', administration: 'Внутримышечно', ageLabel: '14 лет',     completed: false },
    ],

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadVaccines();
        this.render();
        this.setupEventListeners();

    },

    loadVaccines() {
        const saved = localStorage.getItem(App.getStorageKey('vaccines'));
        if (saved) {
            this.vaccines = JSON.parse(saved);
        } else {
            this.vaccines = this.defaultSchedule.map(v => ({ ...v }));
            this.saveVaccines();
        }
    },

    saveVaccines() {
        localStorage.setItem(App.getStorageKey('vaccines'), JSON.stringify(this.vaccines));
    },

    render() {
        const completed = this.vaccines.filter(v => v.completed).length;
        const total = this.vaccines.length;
        const pct = total ? Math.round((completed / total) * 100) : 0;

        this.container.innerHTML = `
            <div class="vaccines-wrapper">
                <div class="vaccines-status-bar card animate-in">
                    <div class="status-bar-info">
                        <span class="status-bar-label">Общий прогресс вакцинации</span>
                        <span class="status-bar-value">${completed} из ${total} (${pct}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>

                <div class="vaccines-toolbar animate-in stagger-1">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" id="vaccine-search" placeholder="Поиск по названию...">
                    </div>
                    <select id="vaccine-filter" class="filter-select">
                        <option value="all">Все статусы</option>
                        <option value="completed">Выполнено</option>
                        <option value="pending">Ожидает</option>
                        <option value="overdue">Просрочено</option>
                    </select>
                    <button id="add-vaccine" class="btn btn-primary btn-sm">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>

                <div id="vaccines-list" class="vaccines-grid"></div>
            </div>
        `;
        this.renderVaccines();
    },

    renderVaccines(list = null) {
        const vaccinesList = document.getElementById('vaccines-list');
        if (!vaccinesList) return;
        const vaccines = list || this.vaccines;

        if (vaccines.length === 0) {
            vaccinesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-syringe"></i>
                    <p>Вакцины не найдены</p>
                </div>
            `;
            return;
        }

        // Group by age label
        const groups = {};
        vaccines.forEach(v => {
            const key = v.ageLabel || 'Другое';
            if (!groups[key]) groups[key] = [];
            groups[key].push(v);
        });

        let html = '';
        let staggerIndex = 2;
        Object.entries(groups).forEach(([ageLabel, items]) => {
            html += `<div class="vaccine-age-group animate-in stagger-${Math.min(staggerIndex, 6)}">`;
            html += `<h3 class="vaccine-group-title">${ageLabel}</h3>`;
            html += `<div class="vaccine-group-cards">`;
            items.forEach(vaccine => {
                const status = this.getVaccineStatus(vaccine);
                html += `
                    <div class="vaccine-card card ${status.class}">
                        <div class="vaccine-card-top">
                            <div class="vaccine-card-info">
                                <span class="vaccine-card-name">${vaccine.name}</span>
                                <span class="vaccine-card-type badge ${status.badgeClass}">${vaccine.type}</span>
                            </div>
                            <span class="badge ${status.badgeClass}">${status.label}</span>
                        </div>
                        <div class="vaccine-card-details">
                            <div class="vaccine-detail">
                                <span class="vaccine-detail-label">Доза</span>
                                <span class="vaccine-detail-value">${vaccine.dose}</span>
                            </div>
                            <div class="vaccine-detail">
                                <span class="vaccine-detail-label">Способ</span>
                                <span class="vaccine-detail-value">${vaccine.administration}</span>
                            </div>
                            <div class="vaccine-detail">
                                <span class="vaccine-detail-label">План. дата</span>
                                <span class="vaccine-detail-value">${this.getScheduledDate(vaccine)}</span>
                            </div>
                            ${vaccine.completed && vaccine.executionDate ? `
                            <div class="vaccine-detail">
                                <span class="vaccine-detail-label">Выполнено</span>
                                <span class="vaccine-detail-value" style="color:var(--success)">${Utils.formatDateShort(vaccine.executionDate)}</span>
                            </div>` : ''}
                            ${!vaccine.completed && vaccine.nextRevaccinationDays ? `
                            <div class="vaccine-detail">
                                <span class="vaccine-detail-label">След. этап</span>
                                <span class="vaccine-detail-value">${Utils.formatDateShort(Utils.addDays(this.childInfo.birthdate, vaccine.nextRevaccinationDays))}</span>
                            </div>` : ''}
                        </div>
                        <div class="vaccine-card-actions">
                            <button class="btn-icon btn-toggle" data-id="${vaccine.id}" data-tooltip="${vaccine.completed ? 'Отменить' : 'Выполнено'}">
                                <i class="fas ${vaccine.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
                            </button>
                            <button class="btn-icon btn-edit" data-id="${vaccine.id}" data-tooltip="Редактировать">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="btn-icon btn-delete" data-id="${vaccine.id}" data-tooltip="Удалить">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
            staggerIndex++;
        });

        vaccinesList.innerHTML = html;
    },

    getVaccineStatus(vaccine) {
        if (vaccine.completed) {
            return { label: 'Выполнено', class: 'vaccine-done', badgeClass: 'badge-success' };
        }
        const scheduledDate = this.getScheduledDateRaw(vaccine);
        if (scheduledDate && scheduledDate < new Date()) {
            return { label: 'Просрочено', class: 'vaccine-overdue', badgeClass: 'badge-error' };
        }
        return { label: 'Ожидает', class: 'vaccine-pending', badgeClass: 'badge-warning' };
    },

    recalculateCatchUp() {
        const groups = {};
        this.vaccines.forEach(v => {
            if (!groups[v.name]) groups[v.name] = [];
            groups[v.name].push(v);
        });

        const intervalMap = {
            'V2': { prev: 'V1', days: 45 },
            'V3': { prev: 'V2', days: 45 },
            'RV1': { prev: 'V3', days: 365 },
            'RV2': { prev: 'RV1', days: 60 },
            'RV3': { prev: 'RV2', days: 365 },
            'RV': { prev: 'V1', days: 365 }
        };

        if (!this.childInfo || !this.childInfo.birthdate) return;

        Object.values(groups).forEach(list => {
            list.sort((a, b) => a.scheduledDays - b.scheduledDays);
            list.forEach(v => {
                v.adjustedDays = null;
                if (intervalMap[v.type]) {
                    const rule = intervalMap[v.type];
                    const prevV = list.find(x => x.type === rule.prev);
                    if (prevV && prevV.completed && prevV.executionDate) {
                        const execDays = Utils.daysFromBirth(this.childInfo.birthdate, prevV.executionDate);
                        const minNextDays = execDays + rule.days;
                        if (minNextDays > v.scheduledDays) {
                            v.adjustedDays = minNextDays;
                        }
                    }
                }
            });
        });
    },

    getScheduledDate(vaccine) {
        if (!this.childInfo || !this.childInfo.birthdate) return 'Не указана';
        const days = vaccine.adjustedDays ? vaccine.adjustedDays : vaccine.scheduledDays;
        const date = Utils.addDays(this.childInfo.birthdate, days);
        const str = Utils.formatDateShort(date);
        return vaccine.adjustedDays ? `<span style="color:var(--warning)" data-tooltip="Смещено (Catch-up)">${str}</span>` : str;
    },

    getScheduledDateRaw(vaccine) {
        if (!this.childInfo || !this.childInfo.birthdate) return null;
        const days = vaccine.adjustedDays ? vaccine.adjustedDays : vaccine.scheduledDays;
        return Utils.addDays(this.childInfo.birthdate, days);
    },

    setupEventListeners() {
        // Guard against duplicate listeners when module is re-opened
        if (this._listenersAttached) return;
        this._listenersAttached = true;

        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            if (btn.id === 'add-vaccine') {
                this.showVaccineModal();
                return;
            }

            const id = parseInt(btn.dataset.id);
            if (isNaN(id)) return;
            if (btn.classList.contains('btn-toggle')) this.toggleVaccine(id);
            else if (btn.classList.contains('btn-edit')) this.showVaccineModal(id);
            else if (btn.classList.contains('btn-delete')) this.showDeleteConfirmation(id);
        });

        const searchInput = document.getElementById('vaccine-search');
        const filterSelect = document.getElementById('vaccine-filter');
        if (searchInput) searchInput.addEventListener('input', () => this.filterVaccines());
        if (filterSelect) filterSelect.addEventListener('change', () => this.filterVaccines());
    },

    filterVaccines() {
        const search = (document.getElementById('vaccine-search')?.value || '').toLowerCase();
        const filter = document.getElementById('vaccine-filter')?.value || 'all';

        const filtered = this.vaccines.filter(v => {
            const matchSearch = v.name.toLowerCase().includes(search) || v.type.toLowerCase().includes(search);
            let matchFilter = true;
            if (filter === 'completed') matchFilter = v.completed;
            else if (filter === 'pending') matchFilter = !v.completed;
            else if (filter === 'overdue') {
                const date = this.getScheduledDateRaw(v);
                matchFilter = !v.completed && date && date < new Date();
            }
            return matchSearch && matchFilter;
        });

        this.renderVaccines(filtered);
    },

    showVaccineModal(id = null) {
        const vaccine = id ? this.vaccines.find(v => v.id === id) : null;
        const title = vaccine ? 'Редактировать вакцину' : 'Добавить вакцину';

        const vaccineOptions = this.standardVaccines.map(v =>
            `<option value="${v.name}" ${vaccine && vaccine.name === v.name ? 'selected' : ''}>${v.name}</option>`
        ).join('');

        const routeOptions = this.administrationRoutes.map(r =>
            `<option value="${r}" ${vaccine && vaccine.administration === r ? 'selected' : ''}>${r}</option>`
        ).join('');

        Utils.showModal(title, `
            <form id="vaccine-form">
                <div class="form-group">
                    <label for="vaccine-name">Название вакцины</label>
                    <select id="vaccine-name" required>
                        <option value="">Выберите вакцину</option>
                        ${vaccineOptions}
                        <option value="custom" ${vaccine && !this.standardVaccines.find(sv => sv.name === vaccine.name) ? 'selected' : ''}>Другая</option>
                    </select>
                </div>
                <div id="custom-vaccine-group" class="form-group" style="display:none;">
                    <label for="custom-vaccine-name">Название</label>
                    <input type="text" id="custom-vaccine-name" placeholder="Введите название">
                </div>
                <div class="form-group">
                    <label for="vaccine-dose">Доза</label>
                    <input type="text" id="vaccine-dose" value="${vaccine ? vaccine.dose : ''}" required>
                </div>
                <div class="form-group">
                    <label for="vaccine-administration">Способ введения</label>
                    <select id="vaccine-administration" required>${routeOptions}</select>
                </div>
                <div class="form-group">
                    <label for="vaccine-type">Тип (V1, V2, RV и т.д.)</label>
                    <input type="text" id="vaccine-type" value="${vaccine ? vaccine.type : ''}" required>
                </div>
                <div class="form-group">
                    <label for="vaccine-date">Плановая дата</label>
                    <input type="date" id="vaccine-date" value="${vaccine && this.childInfo ? Utils.dateToISO(Utils.addDays(this.childInfo.birthdate, vaccine.scheduledDays)) : ''}" required>
                </div>
                <div class="form-group">
                    <label for="vaccine-completed">Статус</label>
                    <select id="vaccine-completed" required>
                        <option value="false" ${vaccine && !vaccine.completed ? 'selected' : ''}>Ожидает</option>
                        <option value="true" ${vaccine && vaccine.completed ? 'selected' : ''}>Выполнено</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">${vaccine ? 'Сохранить' : 'Добавить'}</button>
            </form>
        `);

        const nameSelect = document.getElementById('vaccine-name');
        const customGroup = document.getElementById('custom-vaccine-group');

        nameSelect.addEventListener('change', (e) => {
            customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
            const sv = this.standardVaccines.find(v => v.name === e.target.value);
            if (sv) {
                document.getElementById('vaccine-dose').value = sv.dose;
                document.getElementById('vaccine-administration').value = sv.administration;
            }
        });

        document.getElementById('vaccine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = nameSelect.value === 'custom'
                ? document.getElementById('custom-vaccine-name').value
                : nameSelect.value;
            const data = {
                name,
                dose: document.getElementById('vaccine-dose').value,
                administration: document.getElementById('vaccine-administration').value,
                type: document.getElementById('vaccine-type').value,
                scheduledDays: this.childInfo ? Utils.daysFromBirth(this.childInfo.birthdate, document.getElementById('vaccine-date').value) : 0,
                completed: document.getElementById('vaccine-completed').value === 'true',
                ageLabel: vaccine ? vaccine.ageLabel : 'Другое'
            };

            if (vaccine) {
                Object.assign(this.vaccines.find(v => v.id === id), data);
            } else {
                this.vaccines.push({ id: Date.now(), ...data });
            }
            this.recalculateCatchUp();
            this.saveVaccines();
            Utils.closeModal();
            this.renderVaccines();
            Utils.showNotification(vaccine ? 'Вакцина обновлена' : 'Вакцина добавлена', 'success');
        });
    },

    toggleVaccine(id) {
        const vaccine = this.vaccines.find(v => v.id === id);
        if (!vaccine) return;

        // Capture state BEFORE any changes
        const wasCompleted = vaccine.completed;
        
        if (!wasCompleted) {
            // Mark as completed — show confirmation modal
            Utils.showModal('Выполнение вакцинации', `
                <form id="execute-vaccine-form">
                    <p style="margin-bottom:1rem;font-size:0.9rem;">Вакцина: <strong>${vaccine.name} (${vaccine.type})</strong></p>
                    <div class="form-group">
                        <label for="exec-date">Дата выполнения</label>
                        <input type="date" id="exec-date" value="${Utils.dateToISO(new Date())}" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%">Подтвердить</button>
                </form>
            `);
            document.getElementById('execute-vaccine-form').addEventListener('submit', (e) => {
                e.preventDefault();
                vaccine.completed = true;
                vaccine.executionDate = document.getElementById('exec-date').value;
                this.recalculateCatchUp();
                this.saveVaccines();
                Utils.closeModal();
                this.render();
                Utils.showNotification('Вакцинация выполнена', 'success');
                if (typeof Dashboard !== 'undefined') Dashboard.refresh();
            });
        } else {
            // Unmark — no modal, just toggle off silently
            vaccine.completed = false;
            vaccine.executionDate = null;
            this.recalculateCatchUp();
            this.saveVaccines();
            this.renderVaccines();
            Utils.showNotification('Отметка снята', 'info');
            if (typeof Dashboard !== 'undefined') Dashboard.refresh();
        }
    },

    showDeleteConfirmation(id) {
        const vaccine = this.vaccines.find(v => v.id === id);
        if (!vaccine) return;
        Utils.showModal('Удаление вакцины', `
            <p style="margin-bottom:1rem;">Удалить вакцину "${vaccine.name} (${vaccine.type})"?</p>
            <div class="modal-actions">
                <button id="cancel-delete" class="btn btn-secondary">Отмена</button>
                <button id="confirm-delete" class="btn btn-danger">Удалить</button>
            </div>
        `);
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.vaccines = this.vaccines.filter(v => v.id !== id);
            this.saveVaccines();
            Utils.closeModal();
            this.render();

            Utils.showNotification('Вакцина удалена', 'warning');
        });
        document.getElementById('cancel-delete').addEventListener('click', () => Utils.closeModal());
    },

    getVaccines() {
        return this.vaccines;
    },

    getUpcomingVaccines(birthdate) {
        const now = new Date();
        const birth = new Date(birthdate);
        return this.vaccines
            .filter(v => !v.completed)
            .map(v => ({
                ...v,
                scheduledDate: new Date(birth.getTime() + v.scheduledDays * 86400000)
            }))
            .filter(v => v.scheduledDate > now)
            .sort((a, b) => a.scheduledDate - b.scheduledDate)
            .slice(0, 5);
    },

    getOverdueVaccines(birthdate) {
        const now = new Date();
        const birth = new Date(birthdate);
        return this.vaccines
            .filter(v => !v.completed)
            .map(v => ({
                ...v,
                scheduledDate: new Date(birth.getTime() + v.scheduledDays * 86400000)
            }))
            .filter(v => v.scheduledDate <= now)
            .sort((a, b) => a.scheduledDate - b.scheduledDate);
    }
};