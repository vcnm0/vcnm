// js/calendar.js

const Calendar = {
    childInfo: null,
    events: [],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.events = [];
        this.loadEvents();
        this.render();
        this.setupEventListeners();
    },

    loadEvents() {
        const saved = localStorage.getItem(App.getStorageKey('calendarEvents'));
        if (saved) this.events = JSON.parse(saved);
        this.loadVaccineEvents();
        this.loadTuberculinEvents();
    },

    loadVaccineEvents() {
        Vaccines.getVaccines().forEach(v => {
            const date = this.calcDate(v.scheduledDays);
            if (date) {
                this.events.push({
                    id: `vaccine-${v.id}`,
                    title: `${v.name} (${v.type})`,
                    date, type: 'vaccine',
                    completed: v.completed
                });
            }
        });
    },

    loadTuberculinEvents() {
        Tuberculin.getTests().forEach(t => {
            this.events.push({
                id: `test-${t.id}`,
                title: t.type === 'mantu' ? 'Проба Манту' : 'Диаскинтест',
                date: t.date, type: 'tuberculin',
                result: t.result
            });
        });
    },

    calcDate(days) {
        if (!this.childInfo?.birthdate) return null;
        return Utils.dateToISO(Utils.addDays(this.childInfo.birthdate, days));
    },

    render() {
        this.container.innerHTML = `
            <div class="cal-wrapper">
                <div class="cal-main card animate-in">
                    <div class="cal-nav">
                        <button id="prev-month" class="btn-icon"><i class="fas fa-chevron-left"></i></button>
                        <h3 id="cal-month-year">${this.monthName(this.currentMonth)} ${this.currentYear}</h3>
                        <button id="next-month" class="btn-icon"><i class="fas fa-chevron-right"></i></button>
                        <button id="cal-today" class="btn btn-sm btn-secondary" style="margin-left:auto">Сегодня</button>
                    </div>
                    <div class="cal-grid" id="cal-grid"></div>
                </div>

                <div class="cal-sidebar animate-in stagger-1">
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">События</span>
                            <button id="add-event" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i> Добавить</button>
                        </div>
                        <div id="cal-events"></div>
                    </div>
                    <div class="card cal-legend">
                        <span class="card-title" style="margin-bottom:0.5rem;display:block">Легенда</span>
                        <div class="cal-legend-items">
                            <div class="cal-legend-item"><span class="cal-dot" style="background:var(--primary)"></span> Вакцинация</div>
                            <div class="cal-legend-item"><span class="cal-dot" style="background:var(--accent)"></span> Туберкулинодиагностика</div>
                            <div class="cal-legend-item"><span class="cal-dot" style="background:var(--warning)"></span> Личное событие</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.renderGrid();
        this.renderEvents();
    },

    renderGrid() {
        const grid = document.getElementById('cal-grid');
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const startOffset = (firstDay + 6) % 7;

        let html = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d =>
            `<div class="cal-weekday">${d}</div>`
        ).join('');

        for (let i = 0; i < startOffset; i++) html += '<div class="cal-day empty"></div>';

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(this.currentYear, this.currentMonth, day));
            const ds = date.toISOString().split('T')[0];
            const evts = this.eventsForDate(ds);
            const today = this.isToday(date);

            let dots = '';
            if (evts.some(e => e.type === 'vaccine')) dots += '<span class="cal-dot" style="background:var(--primary)"></span>';
            if (evts.some(e => e.type === 'tuberculin')) dots += '<span class="cal-dot" style="background:var(--accent)"></span>';
            if (evts.some(e => e.type === 'custom')) dots += '<span class="cal-dot" style="background:var(--warning)"></span>';

            html += `
                <div class="cal-day ${today ? 'today' : ''} ${evts.length ? 'has-events' : ''}" data-date="${ds}">
                    <span class="cal-day-num">${day}</span>
                    ${dots ? `<div class="cal-dots">${dots}</div>` : ''}
                </div>
            `;
        }
        grid.innerHTML = html;
    },

    renderEvents() {
        const container = document.getElementById('cal-events');
        const events = this.eventsForMonth(this.currentYear, this.currentMonth);

        if (!events.length) {
            container.innerHTML = '<div class="empty-state" style="padding:1.5rem"><p>Нет событий</p></div>';
            return;
        }

        container.innerHTML = events.map(e => {
            const d = new Date(e.date);
            const typeIcon = e.type === 'vaccine' ? 'fa-syringe' : e.type === 'tuberculin' ? 'fa-lungs' : 'fa-calendar-day';
            const typeColor = e.type === 'vaccine' ? 'var(--primary)' : e.type === 'tuberculin' ? 'var(--accent)' : 'var(--warning)';
            return `
                <div class="cal-event-item">
                    <div class="cal-event-icon" style="color:${typeColor}; background:${typeColor}20; border: 1px solid ${typeColor}40;"><i class="fas ${typeIcon}"></i></div>
                    <div class="cal-event-info">
                        <span class="cal-event-title">${e.title}</span>
                        <span class="cal-event-date">${d.getUTCDate()} ${this.monthName(d.getUTCMonth())}</span>
                    </div>
                    ${e.type === 'vaccine' ? `<span class="badge ${e.completed ? 'badge-success' : 'badge-warning'}">${e.completed ? 'Выполнено' : 'Ожидает'}</span>` : ''}
                    ${e.type === 'custom' ? `<button class="btn-icon btn-delete-event" data-id="${e.id}"><i class="fas fa-trash-can"></i></button>` : ''}
                </div>
            `;
        }).join('');
    },

    eventsForMonth(y, m) {
        return this.events.filter(e => {
            const d = new Date(e.date);
            return d.getUTCFullYear() === y && d.getUTCMonth() === m;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    eventsForDate(ds) {
        return this.events.filter(e => e.date === ds);
    },

    isToday(d) {
        const t = new Date();
        return d.getUTCFullYear() === t.getFullYear() && d.getUTCMonth() === t.getMonth() && d.getUTCDate() === t.getDate();
    },

    monthName(m) {
        return ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m];
    },

    setupEventListeners() {
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('cal-today').addEventListener('click', () => {
            this.currentYear = new Date().getFullYear();
            this.currentMonth = new Date().getMonth();
            this.updateView();
        });
        document.getElementById('add-event').addEventListener('click', () => this.showAddEventModal());

        document.getElementById('cal-grid').addEventListener('click', (e) => {
            const day = e.target.closest('.cal-day:not(.empty):not(.cal-weekday)');
            if (day) this.showDayEvents(day.dataset.date);
        });

        document.getElementById('cal-events').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-delete-event');
            if (btn) this.deleteEvent(btn.dataset.id);
        });
    },

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
        else if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
        this.updateView();
    },

    updateView() {
        document.getElementById('cal-month-year').textContent = `${this.monthName(this.currentMonth)} ${this.currentYear}`;
        this.renderGrid();
        this.renderEvents();
    },

    showDayEvents(ds) {
        const evts = this.eventsForDate(ds);
        let content = evts.length
            ? evts.map(e => `<div style="padding:0.4rem 0;border-bottom:1px solid var(--border-light)"><strong>${e.title}</strong>${e.type === 'vaccine' ? ` - ${e.completed ? 'Выполнено' : 'Ожидает'}` : ''}${e.type === 'tuberculin' ? ` - Результат: ${e.result} мм` : ''}</div>`).join('')
            : '<p>Нет событий на эту дату</p>';
        Utils.showModal(`События: ${Utils.formatDate(ds)}`, content);
    },

    showAddEventModal() {
        Utils.showModal('Добавить событие', `
            <form id="add-event-form">
                <div class="form-group">
                    <label for="event-title">Название</label>
                    <input type="text" id="event-title" placeholder="Введите название" required>
                </div>
                <div class="form-group">
                    <label for="event-date">Дата</label>
                    <input type="date" id="event-date" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Добавить</button>
            </form>
        `);

        document.getElementById('add-event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.push({
                id: Date.now().toString(),
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                type: 'custom'
            });
            this.saveCustomEvents();
            Utils.closeModal();
            this.updateView();
            Utils.showNotification('Событие добавлено', 'success');
        });
    },

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveCustomEvents();
        this.updateView();
        Utils.showNotification('Событие удалено', 'warning');
    },

    saveCustomEvents() {
        localStorage.setItem(App.getStorageKey('calendarEvents'), JSON.stringify(this.events.filter(e => e.type === 'custom')));
    },

    refresh() {
        this.events = [];
        this.loadEvents();
        this.renderGrid();
        this.renderEvents();
    }
};