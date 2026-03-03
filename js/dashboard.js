// js/dashboard.js

const Dashboard = {
    childInfo: null,

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.render();
        this.setupEventListeners();
    },

    render() {
        const vaccines = Vaccines.getVaccines();
        const completed = vaccines.filter(v => v.completed).length;
        const total = vaccines.length;
        const pct = total ? Math.round((completed / total) * 100) : 0;

        const upcoming = this.childInfo ? Vaccines.getUpcomingVaccines(this.childInfo.birthdate) : [];
        const overdue = this.childInfo ? Vaccines.getOverdueVaccines(this.childInfo.birthdate) : [];
        
        // Next Actions
        let nextActions = [];
        if (this.childInfo) {
            const ageM = Utils.calculateAgeInMonths(this.childInfo.birthdate);
            const ageD = Utils.daysFromBirth(this.childInfo.birthdate, new Date());
            
            if (typeof Checkup !== 'undefined' && Checkup.schedule) {
                const pendingCheckups = Checkup.schedule.filter(s => 
                    s.ageMonths >= ageM && 
                    !Checkup.checkups.some(c => c.scheduleAge === s.ageMonths)
                );
                if (pendingCheckups.length > 0) {
                    const next = pendingCheckups[0];
                    const date = Utils.addDays(this.childInfo.birthdate, next.ageMonths * 30.4);
                    nextActions.push({ type: 'Осмотр', title: next.label, date: date, color: 'var(--info)' });
                }
            }
            
            if (upcoming.length > 0) {
                const nextV = upcoming[0];
                nextActions.push({ type: 'Вакцина', title: nextV.name, date: nextV.scheduledDate, color: 'var(--primary)' });
            }
            
            if (typeof Feeding !== 'undefined' && Feeding.complementaryFoods) {
                const nextFood = Feeding.complementaryFoods.find(f => f.ageMonths > ageM);
                if (nextFood) {
                    const date = Utils.addDays(this.childInfo.birthdate, nextFood.ageMonths * 30.4);
                    nextActions.push({ type: 'Прикорм', title: 'Этап (' + nextFood.ageMonths + ' мес)', date: date, color: 'var(--success)' });
                }
            }
            
            nextActions.sort((a,b) => a.date - b.date);
        }

        this.container.innerHTML = `
            <div class="dash-grid">
                <!-- Next Actions Card -->
                ${nextActions.length > 0 ? `
                <div class="card dash-actions animate-in" style="grid-column: 1 / -1; background: linear-gradient(135deg, rgba(99,102,241,0.05), rgba(6,182,212,0.05)); border-color: rgba(99,102,241,0.2);">
                    <div class="card-header" style="margin-bottom: 0px; cursor: pointer;" id="dash-actions-toggle">
                        <span class="card-title" style="display:flex; align-items:center; gap:0.5rem;">
                            <i class="fas fa-bell" style="color:var(--warning);"></i>
                            Ближайшие действия <span class="badge badge-warning" style="margin-left:auto">${nextActions.length}</span>
                        </span>
                        <button class="btn-icon"><i class="fas fa-chevron-down" id="dash-actions-icon" style="transition: transform 0.3s"></i></button>
                    </div>
                    <div id="dash-actions-content" style="display: none; padding-top: 1rem;">
                        <div class="dash-upcoming-list" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            ${nextActions.map(a => `
                                <div class="dash-action-item" style="flex: 1; min-width: 200px; background: var(--surface); padding: 1rem; border-radius: var(--radius); border-left: 4px solid ${a.color}; box-shadow: var(--shadow-sm);">
                                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">${a.type}</span>
                                    <h4 style="margin: 0.25rem 0; font-size: 1rem;">${a.title}</h4>
                                    <span style="font-size: 0.85rem; color: ${a.color}"><i class="fas fa-calendar-alt"></i> ${Utils.formatDateShort(a.date)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
                <!-- Child info card -->
                <div class="card dash-child animate-in">
                    <div class="card-header">
                        <span class="card-title">Профиль ребенка</span>
                        <button id="edit-child-info" class="btn-icon" data-tooltip="Редактировать">
                            <i class="fas fa-pen"></i>
                        </button>
                    </div>
                    <div class="dash-child-body">
                        <div class="dash-avatar" id="dash-avatar">
                            <i class="fas fa-${this.childInfo?.gender === 'male' ? 'mars' : 'venus'}"></i>
                        </div>
                        <div class="dash-child-info">
                            <h3 id="dash-name">${this.childInfo?.name || '--'}</h3>
                            <div class="dash-child-meta">
                                <div class="dash-meta-item">
                                    <span class="dash-meta-label">Дата рождения</span>
                                    <span class="dash-meta-value" id="dash-birthdate">${this.childInfo ? Utils.formatDate(this.childInfo.birthdate) : '--'}</span>
                                </div>
                                <div class="dash-meta-item">
                                    <span class="dash-meta-label">Возраст</span>
                                    <span class="dash-meta-value" id="dash-age">${this.childInfo ? Utils.calculateAge(this.childInfo.birthdate) : '--'}</span>
                                </div>
                                <div class="dash-meta-item">
                                    <span class="dash-meta-label">Пол</span>
                                    <span class="dash-meta-value" id="dash-gender">${this.childInfo?.gender === 'male' ? 'Мужской' : this.childInfo?.gender === 'female' ? 'Женский' : '--'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vaccination progress -->
                <div class="card dash-progress animate-in stagger-1">
                    <div class="card-header">
                        <span class="card-title">Прогресс вакцинации</span>
                    </div>
                    <div class="dash-progress-body">
                        <div class="dash-progress-circle">
                            <svg viewBox="0 0 36 36" class="dash-circular-chart">
                                <path class="dash-circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path class="dash-circle-fill" id="dash-circle-fill"
                                    stroke-dasharray="${pct}, 100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <text x="18" y="19.5" class="dash-circle-text" id="dash-pct">${pct}%</text>
                                <text x="18" y="23.5" class="dash-circle-sub">выполнено</text>
                            </svg>
                        </div>
                        <div class="dash-progress-stats">
                            <div class="dash-stat">
                                <span class="dash-stat-value" style="color:var(--success)">${completed}</span>
                                <span class="dash-stat-label">Выполнено</span>
                            </div>
                            <div class="dash-stat">
                                <span class="dash-stat-value" style="color:var(--warning)">${total - completed - overdue.length}</span>
                                <span class="dash-stat-label">Ожидает</span>
                            </div>
                            <div class="dash-stat">
                                <span class="dash-stat-value" style="color:var(--error)">${overdue.length}</span>
                                <span class="dash-stat-label">Просрочено</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upcoming vaccinations -->
                <div class="card dash-upcoming animate-in stagger-2">
                    <div class="card-header">
                        <span class="card-title">Ближайшие вакцинации</span>
                        <button id="view-all-vaccines" class="btn btn-sm btn-secondary">Все вакцины</button>
                    </div>
                    <div class="dash-upcoming-list" id="upcoming-list">
                        ${upcoming.length > 0 ? upcoming.map(v => `
                            <div class="dash-upcoming-item">
                                <div class="dash-upcoming-dot"></div>
                                <div class="dash-upcoming-info">
                                    <span class="dash-upcoming-name">${v.name} (${v.type})</span>
                                    <span class="dash-upcoming-date">${Utils.formatDateShort(v.scheduledDate)}</span>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-state" style="padding:1.5rem"><p>Нет предстоящих вакцинаций</p></div>'}
                    </div>
                </div>

                <!-- Overdue -->
                ${overdue.length > 0 ? `
                <div class="card dash-overdue animate-in stagger-3">
                    <div class="card-header">
                        <span class="card-title" style="color:var(--error)">Просроченные вакцинации</span>
                    </div>
                    <div class="dash-upcoming-list">
                        ${overdue.map(v => `
                            <div class="dash-upcoming-item overdue">
                                <div class="dash-upcoming-dot" style="background:var(--error)"></div>
                                <div class="dash-upcoming-info">
                                    <span class="dash-upcoming-name">${v.name} (${v.type})</span>
                                    <span class="dash-upcoming-date" style="color:var(--error)">${Utils.formatDateShort(v.scheduledDate)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Recent measurements -->
                <div class="card dash-measurements animate-in stagger-4">
                    <div class="card-header">
                        <span class="card-title">Последние измерения</span>
                    </div>
                    <div id="dash-measurements-data">${this.renderMeasurements()}</div>
                </div>
            </div>
        `;
    },

    renderMeasurements() {
        const measurements = Growth.measurements || [];
        if (measurements.length === 0) {
            return `<div class="empty-state" style="padding:1.5rem"><i class="fas fa-ruler-combined"></i><p>Нет данных</p></div>`;
        }
        const last = measurements[measurements.length - 1];
        const heightM = last.height / 100;
        const bmi = (last.weight / (heightM * heightM)).toFixed(1);
        return `
            <div class="dash-measure-grid">
                <div class="dash-measure-item">
                    <i class="fas fa-weight-scale"></i>
                    <div class="dash-measure-data">
                        <span class="dash-measure-value">${last.weight.toFixed(1)} кг</span>
                        <span class="dash-measure-label">Вес</span>
                    </div>
                </div>
                <div class="dash-measure-item">
                    <i class="fas fa-ruler-vertical"></i>
                    <div class="dash-measure-data">
                        <span class="dash-measure-value">${last.height.toFixed(1)} см</span>
                        <span class="dash-measure-label">Рост</span>
                    </div>
                </div>
                <div class="dash-measure-item">
                    <i class="fas fa-calculator"></i>
                    <div class="dash-measure-data">
                        <span class="dash-measure-value">${bmi}</span>
                        <span class="dash-measure-label">ИМТ</span>
                    </div>
                </div>
            </div>
            <p class="dash-measure-date">Обновлено: ${Utils.formatDateShort(last.date)}</p>
        `;
    },

    setupEventListeners() {
        const editBtn = document.getElementById('edit-child-info');
        if (editBtn) editBtn.addEventListener('click', () => this.showEditModal());

        const allBtn = document.getElementById('view-all-vaccines');
        if (allBtn) allBtn.addEventListener('click', () => App.loadModule('vaccines'));

        const actionsToggle = document.getElementById('dash-actions-toggle');
        if (actionsToggle) {
            actionsToggle.addEventListener('click', () => {
                const content = document.getElementById('dash-actions-content');
                const icon = document.getElementById('dash-actions-icon');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    content.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    },

    showEditModal() {
        Utils.showModal('Редактировать профиль', `
            <form id="edit-child-form">
                <div class="form-group">
                    <label for="edit-name">Имя ребенка</label>
                    <input type="text" id="edit-name" value="${this.childInfo?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="edit-birthdate">Дата рождения</label>
                    <input type="date" id="edit-birthdate" value="${this.childInfo?.birthdate || ''}" required>
                </div>
                <div class="form-group">
                    <label for="edit-gender">Пол</label>
                    <select id="edit-gender" required>
                        <option value="male" ${this.childInfo?.gender === 'male' ? 'selected' : ''}>Мужской</option>
                        <option value="female" ${this.childInfo?.gender === 'female' ? 'selected' : ''}>Женский</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Сохранить</button>
            </form>
        `);

        document.getElementById('edit-child-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const info = {
                name: document.getElementById('edit-name').value,
                birthdate: document.getElementById('edit-birthdate').value,
                gender: document.getElementById('edit-gender').value
            };
            this.childInfo = info;
            App.saveChildInfo(info);
            Utils.closeModal();
            this.render();

            Utils.showNotification('Профиль обновлен', 'success');
        });
    },

    refresh() {
        this.childInfo = JSON.parse(localStorage.getItem('childInfo'));
        
        // Only re-render Dashboard if it's currently visible
        if (window.location.hash === '' || window.location.hash === '#dashboard') {
            this.render();
        }
    }
};