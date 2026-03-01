// js/achievements.js — Достижения и Награды

const Achievements = {
    achievements: [
        {
            id: 1,
            name: 'Первый укол',
            description: 'Выполнена первая вакцинация',
            icon: 'fa-syringe',
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            unlocked: false
        },
        {
            id: 2,
            name: 'Экватор',
            description: 'Выполнено 50% вакцинаций по календарю',
            icon: 'fa-hourglass-half',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
            unlocked: false
        },
        {
            id: 3,
            name: 'Полная защита',
            description: 'Все вакцинации успешно выполнены',
            icon: 'fa-shield-heart',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981, #059669)',
            unlocked: false
        },
        {
            id: 4,
            name: 'Точно в срок',
            description: 'Ни одна вакцинация не просрочена',
            icon: 'fa-stopwatch',
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            unlocked: false
        },
        {
            id: 5,
            name: 'Первый замер',
            description: 'Добавлено первое измерение роста и веса',
            icon: 'fa-weight-scale',
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
            unlocked: false
        },
        {
            id: 6,
            name: 'Антрополог',
            description: 'Записано 5 и более измерений роста/веса',
            icon: 'fa-chart-line',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            unlocked: false
        },
        {
            id: 7,
            name: 'Органайзер',
            description: 'Добавлено 5 и более событий в календарь',
            icon: 'fa-calendar-days',
            color: '#14b8a6',
            gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            unlocked: false
        },
        {
            id: 8,
            name: 'Манту-тест',
            description: 'Добавлена первая туберкулиновая проба',
            icon: 'fa-vial',
            color: '#f43f5e',
            gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            unlocked: false
        },
        {
            id: 9,
            name: 'Диспансеризация',
            description: 'Пройдено 3 и более профилактических осмотра',
            icon: 'fa-user-doctor',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            unlocked: false
        },
        {
            id: 10,
            name: 'Маленький гурман',
            description: 'Записано 10 и более продуктов в дневник',
            icon: 'fa-apple-whole',
            color: '#22c55e',
            gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
            unlocked: false
        },
        {
            id: 11,
            name: 'Умничка',
            description: 'Отмечено 10 и более навыков в развитии',
            icon: 'fa-puzzle-piece',
            color: '#a855f7',
            gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
            unlocked: false
        },
        {
            id: 12,
            name: 'Суперродитель',
            description: 'Активно используются 5 и более модулей',
            icon: 'fa-trophy',
            color: '#eab308',
            gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
            unlocked: false
        },
    ],

    init(container) {
        this.container = container;
        this.loadAchievements();
        this.checkAchievements();
        this.render();
    },

    loadAchievements() {
        const saved = localStorage.getItem(App.getStorageKey('achievements'));
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge saved unlock state with current definitions
            parsed.forEach(savedA => {
                const a = this.achievements.find(x => x.id === savedA.id);
                if (a) a.unlocked = savedA.unlocked;
            });
        }
    },

    saveAchievements() {
        localStorage.setItem(App.getStorageKey('achievements'), JSON.stringify(this.achievements));
    },

    render() {
        const unlocked = this.achievements.filter(a => a.unlocked).length;
        const total = this.achievements.length;
        const pct = Math.round((unlocked / total) * 100);

        this.container.innerHTML = `
            <div class="ach-wrapper">
                <div class="card ach-summary animate-in" style="background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(234,179,8,0.08)); border-color: rgba(99,102,241,0.15);">
                    <div class="ach-summary-row">
                        <div>
                            <span class="card-title" style="font-size:1.25rem;"><i class="fas fa-award" style="color: #eab308; margin-right: 10px;"></i>Достижения</span>
                            <p class="section-desc" style="margin-top:0.35rem">${unlocked} из ${total} разблокировано</p>
                        </div>
                        <div class="ach-pct" style="font-size:2.5rem; font-weight:800; background: linear-gradient(135deg, #6366f1, #eab308); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${pct}%</div>
                    </div>
                    <div class="progress-bar" style="margin-top:0.85rem; height: 8px;">
                        <div class="progress-bar-fill" style="width:${pct}%; background: linear-gradient(90deg, #6366f1, #eab308);"></div>
                    </div>
                </div>

                <div class="ach-grid">
                    ${this.achievements.map((a, i) => `
                        <div class="card ach-card animate-in stagger-${Math.min(i % 6 + 1, 6)} ${a.unlocked ? 'ach-unlocked' : 'ach-locked'}" style="${a.unlocked ? `border-color: ${a.color}20;` : ''}">
                            <div class="ach-icon-wrap" style="${a.unlocked
                                ? `background: ${a.gradient}; box-shadow: 0 4px 15px ${a.color}30;`
                                : 'background: var(--surface-hover); opacity: 0.5;'}">
                                <i class="fas ${a.icon}" style="color: ${a.unlocked ? '#fff' : 'var(--text-muted)'}; font-size: 1.4rem;"></i>
                            </div>
                            <h4 class="ach-name" style="${a.unlocked ? `color: ${a.color};` : ''}">${a.name}</h4>
                            <p class="ach-desc">${a.description}</p>
                            ${a.unlocked
                                ? `<span class="badge" style="margin-top:0.5rem; background: ${a.color}15; color: ${a.color}; border: 1px solid ${a.color}30;"><i class="fas fa-check" style="margin-right:4px;"></i>Получено</span>`
                                : '<span class="badge badge-muted" style="margin-top:0.5rem"><i class="fas fa-lock" style="margin-right:4px; font-size:0.7em;"></i>Заблокировано</span>'}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    checkAchievements() {
        const vaccines = Vaccines.getVaccines();
        const completed = vaccines.filter(v => v.completed);
        const measurements = Growth.measurements || [];
        const tests = Tuberculin.getTests();
        const checkups = (typeof Checkup !== 'undefined' && Checkup.checkups) ? Checkup.checkups : [];

        const feedKey = App.getStorageKey('feedingDiary');
        const nprKey = App.getStorageKey('nprProgress');
        const calKey = App.getStorageKey('calendarEvents');

        const diary = (() => { try { return JSON.parse(localStorage.getItem(feedKey) || '[]'); } catch { return []; } })();
        const nprProgress = (() => { try { return JSON.parse(localStorage.getItem(nprKey) || '{}'); } catch { return {}; } })();
        const customEvents = (() => { try { return JSON.parse(localStorage.getItem(calKey) || '[]'); } catch { return []; } })();

        // 1 - First vaccination
        if (completed.length > 0) this.unlock(1);
        // 2 - 50% vaccinations
        if (completed.length >= Math.ceil(vaccines.length / 2)) this.unlock(2);
        // 3 - All vaccinations
        if (completed.length === vaccines.length && vaccines.length > 0) this.unlock(3);
        // 4 - All on time
        if (completed.length === vaccines.length && vaccines.length > 0) {
            const childInfo = App.childInfo;
            if (childInfo) {
                const allOnTime = vaccines.every(v => {
                    if (!v.completed || !v.executionDate) return true;
                    const scheduled = Utils.addDays(childInfo.birthdate, v.scheduledDays);
                    const executed = new Date(v.executionDate);
                    return executed <= new Date(scheduled.getTime() + 30 * 86400000); // 30 days grace
                });
                if (allOnTime) this.unlock(4);
            }
        }
        // 5 - First measurement
        if (measurements.length > 0) this.unlock(5);
        // 6 - 5+ measurements
        if (measurements.length >= 5) this.unlock(6);
        // 7 - 5+ calendar events
        if (customEvents.length >= 5) this.unlock(7);
        // 8 - First TB test
        if (tests.length > 0) this.unlock(8);
        // 9 - 3+ checkups
        if (checkups.length >= 3) this.unlock(9);
        // 10 - 10+ feeding diary entries
        if (diary.length >= 10) this.unlock(10);
        // 11 - 10+ NPR skills
        if (Object.values(nprProgress).filter(Boolean).length >= 10) this.unlock(11);

        // 12 - Super parent: uses 5+ modules
        const moduleCount = [
            completed.length > 0,
            measurements.length > 0,
            tests.length > 0,
            checkups.length > 0,
            diary.length > 0,
            Object.values(nprProgress).filter(Boolean).length > 0,
            customEvents.length > 0
        ].filter(Boolean).length;
        if (moduleCount >= 5) this.unlock(12);

        this.saveAchievements();
    },

    unlock(id) {
        const a = this.achievements.find(x => x.id === id);
        if (a && !a.unlocked) {
            a.unlocked = true;
            Utils.showNotification(`Достижение разблокировано: ${a.name}`, 'success');
        }
    }
};