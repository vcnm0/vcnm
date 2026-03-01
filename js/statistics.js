// js/statistics.js

const Statistics = {
    childInfo: null,

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.render();
        this.setupEventListeners();
    },

    render() {
        this.container.innerHTML = `
            <div class="stats-wrapper">
                <div class="stats-header animate-in">
                    <div>
                        <h2 class="section-title"><i class="fas fa-chart-pie" style="color:var(--primary); margin-right:8px;"></i>Аналитика Здоровья</h2>
                        <p class="section-desc">Обзорная статистика и визуализация данных развития ребенка</p>
                    </div>
                    <button class="btn btn-primary" id="export-stats">
                        <i class="fas fa-download"></i> Экспортировать Отчет
                    </button>
                </div>

                <!-- Ключевые метрики -->
                <div id="stat-summary" class="stat-summary animate-in stagger-1"></div>

                <div class="stats-grid">
                    <div class="card animate-in stagger-2" style="grid-column: 1 / -1; min-height: 400px; display:flex; flex-direction:column;">
                        <div class="card-header"><span class="card-title"><i class="fas fa-weight-scale" style="color:var(--info);"></i> Динамика Антропометрии</span></div>
                        <div style="flex:1; position:relative; width:100%; min-height: 300px;">
                            <canvas id="stat-growth-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="card animate-in stagger-3" style="display:flex; flex-direction:column; align-items:center;">
                        <div class="card-header" style="width:100%;"><span class="card-title"><i class="fas fa-syringe" style="color:var(--success);"></i> Охват Вакцинацией</span></div>
                        <div style="flex:1; position:relative; width:100%; max-width: 220px; max-height: 220px; display:flex; align-items:center; justify-content:center; margin: 1rem auto;">
                            <canvas id="stat-vaccine-chart"></canvas>
                        </div>
                    </div>

                    <div class="card animate-in stagger-4" style="display:flex; flex-direction:column;">
                        <div class="card-header"><span class="card-title"><i class="fas fa-microscope" style="color:var(--warning);"></i> Туберкулинодиагностика</span></div>
                        <div style="flex:1; position:relative; width:100%; min-height: 250px;">
                            <canvas id="stat-tb-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderVaccineChart();
        this.renderGrowthChart();
        this.renderTBChart();
        this.renderSummary();
    },

    renderVaccineChart() {
        const vaccines = Vaccines.getVaccines();
        const completed = vaccines.filter(v => v.completed).length;
        const pending = vaccines.filter(v => !v.completed).length;
        const overdue = this.childInfo ? Vaccines.getOverdueVaccines(this.childInfo.birthdate).length : 0;

        const ctx = document.getElementById('stat-vaccine-chart');
        if (!ctx) return;
        const dark = document.body.classList.contains('dark-theme');
        new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Выполнено', 'Ожидает', 'Просрочено'],
                datasets: [{
                    data: [completed, pending - overdue, overdue],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    hoverOffset: 4,
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: dark ? '#f1f5f9' : '#0f172a', font: { family: 'Inter', size: 12, weight: '500' }, padding: 16, usePointStyle: true, boxWidth: 8 }
                    }
                }
            }
        });
    },

    renderGrowthChart() {
        const measurements = Growth.measurements || [];
        if (measurements.length === 0) return;

        const ctx = document.getElementById('stat-growth-chart');
        if (!ctx) return;
        const dark = document.body.classList.contains('dark-theme');
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Вес (кг)',
                        data: measurements.map(m => ({ x: new Date(m.date), y: m.weight })),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99,102,241,0.15)',
                        yAxisID: 'y-weight',
                        tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: '#fff', pointBorderWidth: 2
                    },
                    {
                        label: 'Рост (см)',
                        data: measurements.map(m => ({ x: new Date(m.date), y: m.height })),
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6,182,212,0.15)',
                        yAxisID: 'y-height',
                        tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: '#fff', pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { type: 'time', time: { unit: 'month' }, grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: dark ? '#94a3b8' : '#64748b' } },
                    'y-weight': { type: 'linear', position: 'left', title: {display: true, text: 'Вес (кг)', color: dark ? '#94a3b8' : '#64748b'}, grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: dark ? '#94a3b8' : '#64748b' } },
                    'y-height': { type: 'linear', position: 'right', title: {display: true, text: 'Рост (см)', color: dark ? '#94a3b8' : '#64748b'}, grid: { drawOnChartArea: false }, ticks: { color: dark ? '#94a3b8' : '#64748b' } }
                },
                plugins: {
                    legend: { labels: { color: dark ? '#f1f5f9' : '#0f172a', font: { family:'Inter' } } }
                }
            }
        });
    },

    renderTBChart() {
        const tests = Tuberculin.getTests();
        if (tests.length === 0) return;

        const ctx = document.getElementById('stat-tb-chart');
        if (!ctx) return;
        const dark = document.body.classList.contains('dark-theme');
        const mantu = tests.filter(t => t.type === 'mantu').map(t => ({ x: new Date(t.date), y: t.result }));
        const dst = tests.filter(t => t.type === 'diaskintest').map(t => ({ x: new Date(t.date), y: t.result }));

        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                datasets: [
                    { label: 'Проба Манту', data: mantu, backgroundColor: '#6366f1', borderRadius: 4, barThickness: 12 },
                    { label: 'Диаскинтест', data: dst, backgroundColor: '#06b6d4', borderRadius: 4, barThickness: 12 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { type: 'time', time: { unit: 'month' }, grid: { color: dark ? '#334155' : '#f1f5f9' }, ticks: { color: dark ? '#94a3b8' : '#64748b' } },
                    y: { title: { display: true, text: 'Результат (мм)', color: dark ? '#94a3b8' : '#64748b' }, grid: { color: dark ? '#334155' : '#f1f5f9' }, ticks: { color: dark ? '#94a3b8' : '#64748b' } }
                },
                plugins: {
                    legend: { labels: { color: dark ? '#f1f5f9' : '#0f172a', font: { family: 'Inter' } } }
                }
            }
        });
    },

    renderSummary() {
        const el = document.getElementById('stat-summary');
        if (!el) return;
        const vaccines = Vaccines.getVaccines();
        const measurements = Growth.measurements || [];
        const tests = Tuberculin.getTests();
        const checkups = (typeof Checkup !== 'undefined' && Checkup.checkups) ? Checkup.checkups : [];
        const diary = (() => { try { return JSON.parse(localStorage.getItem(App.getStorageKey('feedingDiary')) || '[]'); } catch { return []; } })();
        const nprDone = (() => { try { return Object.values(JSON.parse(localStorage.getItem(App.getStorageKey('nprProgress')) || '{}')).filter(Boolean).length; } catch { return 0; } })();

        el.innerHTML = `
            <div class="stat-summary-grid">
                <div class="stat-sum-item">
                    <div class="icon-wrap" style="color:var(--success); background:rgba(16,185,129,0.1);"><i class="fas fa-shield-virus"></i></div>
                    <div class="stat-sum-data">
                        <span class="stat-sum-val">${vaccines.filter(v => v.completed).length}<small>/${vaccines.length}</small></span>
                        <span class="stat-sum-label">Вакцинации</span>
                    </div>
                </div>
                <div class="stat-sum-item">
                    <div class="icon-wrap" style="color:var(--info); background:rgba(6,182,212,0.1);"><i class="fas fa-ruler-combined"></i></div>
                    <div class="stat-sum-data">
                        <span class="stat-sum-val">${measurements.length}</span>
                        <span class="stat-sum-label">Измерений</span>
                    </div>
                </div>
                <div class="stat-sum-item">
                    <div class="icon-wrap" style="color:var(--warning); background:rgba(245,158,11,0.1);"><i class="fas fa-microscope"></i></div>
                    <div class="stat-sum-data">
                        <span class="stat-sum-val">${tests.length}</span>
                        <span class="stat-sum-label">Проб ТБ</span>
                    </div>
                </div>
                <div class="stat-sum-item">
                    <div class="icon-wrap" style="color:var(--primary); background:rgba(99,102,241,0.1);"><i class="fas fa-user-md"></i></div>
                    <div class="stat-sum-data">
                        <span class="stat-sum-val">${checkups.length}</span>
                        <span class="stat-sum-label">Осмотров</span>
                    </div>
                </div>
                <div class="stat-sum-item">
                    <div class="icon-wrap" style="color:var(--error); background:rgba(239,68,68,0.1);"><i class="fas fa-utensils"></i></div>
                    <div class="stat-sum-data">
                        <span class="stat-sum-val">${diary.length}</span>
                        <span class="stat-sum-label">Записей питания</span>
                    </div>
                </div>
                <div class="stat-sum-item">
                    <div class="icon-wrap" style="color:#d946ef; background:rgba(217,70,239,0.1);"><i class="fas fa-brain"></i></div>
                    <div class="stat-sum-data">
                        <span class="stat-sum-val">${nprDone}</span>
                        <span class="stat-sum-label">Навыков НПР</span>
                    </div>
                </div>
            </div>
        `;
    },

    setupEventListeners() {
        const exportBtn = document.getElementById('export-stats');
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportStatistics());
    },

    exportStatistics() {
        const vaccines = Vaccines.getVaccines();
        const measurements = Growth.measurements || [];
        const tests = Tuberculin.getTests();

        let csv = '\uFEFF'; // BOM for Excel
        csv += 'Вакцинация\nНазвание,Тип,Статус\n';
        vaccines.forEach(v => csv += `${v.name},${v.type},${v.completed ? 'Выполнено' : 'Ожидает'}\n`);

        csv += '\nРост и вес\nДата,Вес (кг),Рост (см)\n';
        measurements.forEach(m => csv += `${m.date},${m.weight},${m.height}\n`);

        csv += '\nТуберкулинодиагностика\nДата,Тип,Результат (мм)\n';
        tests.forEach(t => csv += `${t.date},${t.type === 'mantu' ? 'Манту' : 'Диаскинтест'},${t.result}\n`);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'health_statistics.csv';
        link.click();
        Utils.showNotification('Статистика экспортирована', 'success');
    }
};