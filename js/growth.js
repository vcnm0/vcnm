// js/growth.js

const Growth = {
    childInfo: null,
    measurements: [],
    weightChart: null,
    heightChart: null,

    // Расширенные центильные таблицы РФ (0-36 мес, помесячно)
    rfStandards: {
        weightForAge: {
            male: {
                0:{p3:2.9,p15:3.3,p50:3.5,p85:4.4,p97:4.9},1:{p3:3.6,p15:4.0,p50:4.5,p85:5.2,p97:5.7},
                2:{p3:4.4,p15:4.9,p50:5.6,p85:6.3,p97:6.9},3:{p3:5.1,p15:5.6,p50:6.4,p85:7.2,p97:7.9},
                4:{p3:5.6,p15:6.2,p50:7.0,p85:7.9,p97:8.6},5:{p3:6.1,p15:6.7,p50:7.5,p85:8.4,p97:9.2},
                6:{p3:6.4,p15:7.1,p50:7.9,p85:8.9,p97:9.7},7:{p3:6.7,p15:7.4,p50:8.3,p85:9.3,p97:10.2},
                8:{p3:7.0,p15:7.7,p50:8.6,p85:9.6,p97:10.5},9:{p3:7.2,p15:7.9,p50:8.9,p85:9.9,p97:10.9},
                10:{p3:7.4,p15:8.1,p50:9.1,p85:10.2,p97:11.2},11:{p3:7.6,p15:8.4,p50:9.4,p85:10.5,p97:11.5},
                12:{p3:7.8,p15:8.6,p50:9.6,p85:10.8,p97:11.8},15:{p3:8.4,p15:9.2,p50:10.3,p85:11.5,p97:12.6},
                18:{p3:8.9,p15:9.8,p50:10.9,p85:12.2,p97:13.4},21:{p3:9.3,p15:10.3,p50:11.5,p85:12.9,p97:14.1},
                24:{p3:9.8,p15:10.8,p50:12.2,p85:13.6,p97:14.9},30:{p3:10.7,p15:11.8,p50:13.3,p85:14.9,p97:16.3},
                36:{p3:11.4,p15:12.7,p50:14.3,p85:16.2,p97:17.7}
            },
            female: {
                0:{p3:2.8,p15:3.2,p50:3.4,p85:4.2,p97:4.7},1:{p3:3.4,p15:3.8,p50:4.2,p85:4.8,p97:5.3},
                2:{p3:4.0,p15:4.5,p50:5.1,p85:5.8,p97:6.4},3:{p3:4.6,p15:5.1,p50:5.8,p85:6.6,p97:7.2},
                4:{p3:5.1,p15:5.6,p50:6.4,p85:7.3,p97:8.0},5:{p3:5.5,p15:6.1,p50:6.9,p85:7.8,p97:8.6},
                6:{p3:5.8,p15:6.4,p50:7.3,p85:8.3,p97:9.1},7:{p3:6.1,p15:6.7,p50:7.6,p85:8.6,p97:9.5},
                8:{p3:6.3,p15:7.0,p50:7.9,p85:9.0,p97:9.9},9:{p3:6.5,p15:7.2,p50:8.2,p85:9.3,p97:10.2},
                10:{p3:6.7,p15:7.5,p50:8.5,p85:9.6,p97:10.5},11:{p3:6.9,p15:7.7,p50:8.7,p85:9.9,p97:10.8},
                12:{p3:7.1,p15:7.9,p50:8.9,p85:10.1,p97:11.1},15:{p3:7.7,p15:8.5,p50:9.6,p85:10.9,p97:12.0},
                18:{p3:8.2,p15:9.1,p50:10.2,p85:11.6,p97:12.7},21:{p3:8.6,p15:9.6,p50:10.9,p85:12.3,p97:13.5},
                24:{p3:9.1,p15:10.1,p50:11.5,p85:13.0,p97:14.3},30:{p3:10.0,p15:11.1,p50:12.7,p85:14.4,p97:15.8},
                36:{p3:10.8,p15:12.0,p50:13.9,p85:15.7,p97:17.2}
            }
        },
        heightForAge: {
            male: {
                0:{p3:46.1,p15:48.0,p50:50.0,p85:53.0,p97:54.9},1:{p3:50.8,p15:52.3,p50:54.7,p85:57.1,p97:58.6},
                2:{p3:54.4,p15:56.0,p50:58.4,p85:60.8,p97:62.4},3:{p3:57.3,p15:59.0,p50:61.4,p85:63.8,p97:65.5},
                4:{p3:59.7,p15:61.4,p50:63.9,p85:66.3,p97:68.0},5:{p3:61.7,p15:63.4,p50:65.9,p85:68.5,p97:70.1},
                6:{p3:63.3,p15:65.1,p50:67.6,p85:70.1,p97:71.9},7:{p3:64.8,p15:66.7,p50:69.2,p85:71.7,p97:73.5},
                8:{p3:66.2,p15:68.0,p50:70.6,p85:73.2,p97:75.0},9:{p3:67.5,p15:69.3,p50:72.0,p85:74.5,p97:76.5},
                10:{p3:68.7,p15:70.5,p50:73.3,p85:76.1,p97:77.9},11:{p3:69.9,p15:71.7,p50:74.5,p85:77.3,p97:79.2},
                12:{p3:71.0,p15:72.8,p50:75.7,p85:78.7,p97:80.5},15:{p3:74.1,p15:76.0,p50:79.1,p85:82.3,p97:84.2},
                18:{p3:76.9,p15:78.9,p50:82.3,p85:85.7,p97:87.7},21:{p3:79.4,p15:81.5,p50:85.1,p85:88.7,p97:90.9},
                24:{p3:81.7,p15:84.1,p50:87.8,p85:91.5,p97:94.0},30:{p3:85.8,p15:88.5,p50:92.9,p85:96.7,p97:99.5},
                36:{p3:89.5,p15:92.3,p50:96.5,p85:100.7,p97:103.5}
            },
            female: {
                0:{p3:45.4,p15:47.3,p50:49.5,p85:52.0,p97:54.0},1:{p3:49.8,p15:51.4,p50:53.7,p85:56.0,p97:57.6},
                2:{p3:53.0,p15:54.7,p50:57.1,p85:59.5,p97:61.1},3:{p3:55.6,p15:57.3,p50:59.8,p85:62.3,p97:63.9},
                4:{p3:57.8,p15:59.5,p50:62.1,p85:64.7,p97:66.4},5:{p3:59.6,p15:61.4,p50:64.0,p85:66.6,p97:68.5},
                6:{p3:61.2,p15:63.0,p50:65.7,p85:68.4,p97:70.3},7:{p3:62.7,p15:64.5,p50:67.3,p85:70.0,p97:71.9},
                8:{p3:64.0,p15:65.8,p50:68.7,p85:71.6,p97:73.5},9:{p3:65.3,p15:67.1,p50:70.1,p85:73.1,p97:75.0},
                10:{p3:66.5,p15:68.4,p50:71.5,p85:74.5,p97:76.4},11:{p3:67.7,p15:69.6,p50:72.8,p85:76.0,p97:78.0},
                12:{p3:68.9,p15:70.8,p50:74.0,p85:77.4,p97:79.6},15:{p3:72.0,p15:74.0,p50:77.5,p85:81.0,p97:83.2},
                18:{p3:74.9,p15:77.0,p50:80.7,p85:84.4,p97:86.5},21:{p3:77.5,p15:79.7,p50:83.7,p85:87.5,p97:89.8},
                24:{p3:80.0,p15:82.3,p50:86.4,p85:90.6,p97:92.9},30:{p3:84.3,p15:86.8,p50:91.2,p85:95.5,p97:98.1},
                36:{p3:87.7,p15:90.4,p50:95.1,p85:99.7,p97:102.7}
            }
        },
        // ИМТ-для-возраста (WHO/РФ, кг/м², 0-36 мес)
        bmiForAge: {
            male: {
                0:{p3:11.0,p15:12.2,p50:13.4,p85:14.8,p97:16.2},
                3:{p3:14.0,p15:15.2,p50:16.2,p85:17.3,p97:18.4},
                6:{p3:14.7,p15:15.9,p50:17.2,p85:18.6,p97:19.8},
                9:{p3:14.6,p15:15.7,p50:17.0,p85:18.4,p97:19.6},
                12:{p3:14.2,p15:15.2,p50:16.4,p85:17.8,p97:19.0},
                18:{p3:13.6,p15:14.6,p50:15.8,p85:17.2,p97:18.5},
                24:{p3:13.5,p15:14.4,p50:15.5,p85:16.9,p97:18.2},
                30:{p3:13.3,p15:14.2,p50:15.4,p85:16.7,p97:18.0},
                36:{p3:13.1,p15:14.0,p50:15.2,p85:16.5,p97:17.8}
            },
            female: {
                0:{p3:10.8,p15:12.0,p50:13.2,p85:14.6,p97:15.9},
                3:{p3:13.4,p15:14.6,p50:15.8,p85:17.0,p97:18.2},
                6:{p3:14.1,p15:15.3,p50:16.6,p85:18.0,p97:19.3},
                9:{p3:13.9,p15:15.0,p50:16.4,p85:17.9,p97:19.1},
                12:{p3:13.6,p15:14.6,p50:15.9,p85:17.3,p97:18.6},
                18:{p3:13.1,p15:14.1,p50:15.4,p85:16.8,p97:18.1},
                24:{p3:13.0,p15:13.9,p50:15.1,p85:16.5,p97:17.8},
                30:{p3:12.8,p15:13.7,p50:14.9,p85:16.3,p97:17.6},
                36:{p3:12.7,p15:13.6,p50:14.7,p85:16.1,p97:17.4}
            }
        }
    },

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadMeasurements();
        this.render();
        this.setupEventListeners();
    },

    loadMeasurements() {
        const saved = localStorage.getItem(App.getStorageKey('growthMeasurements'));
        if (saved) this.measurements = JSON.parse(saved);
    },

    saveMeasurements() {
        localStorage.setItem(App.getStorageKey('growthMeasurements'), JSON.stringify(this.measurements));
    },

    render() {
        this.container.innerHTML = `
            <div class="growth-wrapper">
                ${this.renderSummaryCards()}
                <div class="growth-actions animate-in stagger-2">
                    <button id="add-measurement" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Добавить измерение</button>
                    <button id="export-data" class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Экспорт CSV</button>
                </div>
                <div class="growth-charts animate-in stagger-3">
                    <div class="card"><div class="card-header"><span class="card-title">График веса</span></div><canvas id="weight-chart"></canvas></div>
                    <div class="card"><div class="card-header"><span class="card-title">График роста</span></div><canvas id="height-chart"></canvas></div>
                </div>
                <div class="card animate-in stagger-4">
                    <div class="card-header"><span class="card-title">История измерений</span></div>
                    <div id="measurements-table"></div>
                </div>
            </div>
        `;
        this.renderCharts();
        this.renderTable();
    },

    renderSummaryCards() {
        if (this.measurements.length === 0) {
            return '<div class="card animate-in"><div class="empty-state"><i class="fas fa-ruler-combined"></i><p>Нет данных об измерениях. Добавьте первое измерение.</p></div></div>';
        }
        const m = this.measurements[this.measurements.length - 1];
        const prev = this.measurements.length > 1 ? this.measurements[this.measurements.length - 2] : null;
        const bmi = this.calcBMI(m.weight, m.height);
        const age = this.childInfo ? Utils.calculateAgeInMonths(this.childInfo.birthdate, m.date) : 0;
        const wp = this.childInfo ? this.getPercentile(age, m.weight, 'weightForAge') : '--';
        const hp = this.childInfo ? this.getPercentile(age, m.height, 'heightForAge') : '--';

        const wDiff = prev ? (m.weight - prev.weight) : null;
        const hDiff = prev ? (m.height - prev.height) : null;

        const bmiAssess = this.childInfo ? this.getBMIAssessment(bmi, age) : { label: '--', color: 'var(--text-muted)', corridor: '--' };

        return `
            <div class="growth-summary grid-3 animate-in">
                <div class="card growth-sum-card">
                    <div class="growth-sum-icon"><i class="fas fa-weight-scale"></i></div>
                    <div class="growth-sum-data">
                        <span class="growth-sum-value">${m.weight.toFixed(1)} <small>кг</small></span>
                        ${wDiff !== null ? `<span class="growth-sum-diff ${wDiff >= 0 ? 'positive' : 'negative'}">${wDiff >= 0 ? '+' : ''}${wDiff.toFixed(1)} кг</span>` : ''}
                        <span class="growth-sum-label">Центиль: ${wp}</span>
                    </div>
                </div>
                <div class="card growth-sum-card">
                    <div class="growth-sum-icon"><i class="fas fa-ruler-vertical"></i></div>
                    <div class="growth-sum-data">
                        <span class="growth-sum-value">${m.height.toFixed(1)} <small>см</small></span>
                        ${hDiff !== null ? `<span class="growth-sum-diff ${hDiff >= 0 ? 'positive' : 'negative'}">${hDiff >= 0 ? '+' : ''}${hDiff.toFixed(1)} см</span>` : ''}
                        <span class="growth-sum-label">Центиль: ${hp}</span>
                    </div>
                </div>
                <div class="card growth-sum-card">
                    <div class="growth-sum-icon" style="color:${bmiAssess.color}"><i class="fas fa-calculator"></i></div>
                    <div class="growth-sum-data">
                        <span class="growth-sum-value">${bmi.toFixed(1)}</span>
                        <span class="growth-sum-label" style="color:${bmiAssess.color}; font-weight:600">${bmiAssess.label}</span>
                        <span class="growth-sum-label">Коридор: ${bmiAssess.corridor}</span>
                    </div>
                </div>
            </div>
        `;
    },

    calcBMI(w, h) { return h > 0 ? w / ((h / 100) ** 2) : 0; },

    // Оценка ИМТ для ребёнка по центильным коридорам РФ
    getBMIAssessment(bmi, ageMonths) {
        const gender = this.childInfo?.gender || 'male';
        const stds = this.rfStandards.bmiForAge?.[gender];
        if (!stds || ageMonths < 0) return { label: '--', color: 'var(--text-muted)', corridor: '--' };
        const closest = Object.keys(stds).reduce((p, c) => Math.abs(c - ageMonths) < Math.abs(p - ageMonths) ? c : p);
        const s = stds[closest];
        if (bmi < s.p3) return { label: 'Выраженный дефицит', color: 'var(--error)', corridor: '<3' };
        if (bmi < s.p15) return { label: 'Недостаточность',   color: 'var(--warning)', corridor: '3–15' };
        if (bmi < s.p85) return { label: 'Норма',             color: 'var(--success)', corridor: '15–85' };
        if (bmi < s.p97) return { label: 'Избыток массы',     color: 'var(--warning)', corridor: '85–97' };
        return { label: 'Ожирение', color: 'var(--error)', corridor: '>97' };
    },

    getPercentile(age, val, type) {
        const gender = this.childInfo?.gender || 'male';
        const stds = this.rfStandards[type]?.[gender];
        if (!stds) return '--';
        const closest = Object.keys(stds).reduce((p, c) => Math.abs(c - age) < Math.abs(p - age) ? c : p);
        const s = stds[closest];
        if (val < s.p3) return '<3';
        if (val < s.p15) return '3-15';
        if (val < s.p50) return '15-50';
        if (val < s.p85) return '50-85';
        if (val < s.p97) return '85-97';
        return '>97';
    },

    renderCharts() {
        if (this.measurements.length === 0) return;
        this.renderWeightChart();
        this.renderHeightChart();
    },

    renderWeightChart() {
        const ctx = document.getElementById('weight-chart');
        if (!ctx) return;
        if (this.weightChart) this.weightChart.destroy();
        this.weightChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Вес (кг)',
                    data: this.measurements.map(m => ({ x: new Date(m.date), y: m.weight })),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.1)',
                    tension: 0.3, fill: true, pointRadius: 4, pointHoverRadius: 6
                }]
            },
            options: this.chartOptions('Вес (кг)')
        });
    },

    renderHeightChart() {
        const ctx = document.getElementById('height-chart');
        if (!ctx) return;
        if (this.heightChart) this.heightChart.destroy();
        this.heightChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Рост (см)',
                    data: this.measurements.map(m => ({ x: new Date(m.date), y: m.height })),
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6,182,212,0.1)',
                    tension: 0.3, fill: true, pointRadius: 4, pointHoverRadius: 6
                }]
            },
            options: this.chartOptions('Рост (см)')
        });
    },

    chartOptions(yLabel) {
        const dark = document.body.classList.contains('dark-theme');
        return {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: { type: 'time', time: { unit: 'month' }, grid: { color: dark ? '#334155' : '#f1f5f9' }, ticks: { color: dark ? '#94a3b8' : '#64748b' } },
                y: { title: { display: true, text: yLabel, color: dark ? '#94a3b8' : '#64748b' }, grid: { color: dark ? '#334155' : '#f1f5f9' }, ticks: { color: dark ? '#94a3b8' : '#64748b' } }
            },
            plugins: {
                legend: { labels: { color: dark ? '#f1f5f9' : '#0f172a', font: { family: 'Inter' } } }
            }
        };
    },

    renderTable() {
        const container = document.getElementById('measurements-table');
        if (!container) return;
        if (this.measurements.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Нет данных</p></div>';
            return;
        }
        const sorted = [...this.measurements].sort((a, b) => new Date(b.date) - new Date(a.date));
        container.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Дата</th><th>Вес (кг)</th><th>Рост (см)</th><th>ИМТ / Оценка</th><th></th></tr></thead>
                <tbody>
                    ${sorted.map(m => {
                        const bmiVal = this.calcBMI(m.weight, m.height);
                        const ageAtM = this.childInfo ? Utils.calculateAgeInMonths(this.childInfo.birthdate, m.date) : 0;
                        const assess = this.getBMIAssessment(bmiVal, ageAtM);
                        return `
                        <tr>
                            <td>${Utils.formatDateShort(m.date)}</td>
                            <td>${m.weight.toFixed(1)}</td>
                            <td>${m.height.toFixed(1)}</td>
                            <td><span style="font-weight:600">${bmiVal.toFixed(1)}</span> <span style="color:${assess.color};font-size:0.8rem">${assess.label}</span></td>
                            <td style="text-align:right">
                                <button class="btn-icon btn-edit-m" data-id="${m.id}"><i class="fas fa-pen"></i></button>
                                <button class="btn-icon btn-delete-m" data-id="${m.id}"><i class="fas fa-trash-can"></i></button>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        `;
    },

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.id === 'add-measurement') { this.showMeasurementModal(); return; }
            if (btn.id === 'export-data') { this.exportData(); return; }
            const id = btn.dataset.id;
            if (btn.classList.contains('btn-edit-m')) this.showMeasurementModal(id);
            else if (btn.classList.contains('btn-delete-m')) this.deleteMeasurement(id);
        });
    },

    showMeasurementModal(id = null) {
        const m = id ? this.measurements.find(x => x.id === id) : null;
        Utils.showModal(m ? 'Редактировать измерение' : 'Добавить измерение', `
            <form id="measurement-form">
                <div class="form-group"><label for="m-date">Дата</label><input type="date" id="m-date" value="${m?.date || ''}" required></div>
                <div class="form-group"><label for="m-weight">Вес (кг)</label><input type="number" id="m-weight" step="0.1" min="0" value="${m?.weight ?? ''}" required></div>
                <div class="form-group"><label for="m-height">Рост (см)</label><input type="number" id="m-height" step="0.1" min="0" value="${m?.height ?? ''}" required></div>
                <button type="submit" class="btn btn-primary" style="width:100%">${m ? 'Сохранить' : 'Добавить'}</button>
            </form>
        `);
        document.getElementById('measurement-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                date: document.getElementById('m-date').value,
                weight: parseFloat(document.getElementById('m-weight').value),
                height: parseFloat(document.getElementById('m-height').value)
            };
            if (m) {
                Object.assign(this.measurements.find(x => x.id === id), data);
            } else {
                this.measurements.push({ id: Date.now().toString(), ...data });
            }
            this.measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
            this.saveMeasurements();
            Utils.closeModal();
            this.render();

            Utils.showNotification(m ? 'Измерение обновлено' : 'Измерение добавлено', 'success');
        });
    },

    deleteMeasurement(id) {
        Utils.showModal('Удаление', `
            <p style="margin-bottom:1rem">Удалить это измерение?</p>
            <div class="modal-actions">
                <button id="cancel-d" class="btn btn-secondary">Отмена</button>
                <button id="confirm-d" class="btn btn-danger">Удалить</button>
            </div>
        `);
        document.getElementById('confirm-d').addEventListener('click', () => {
            this.measurements = this.measurements.filter(m => m.id !== id);
            this.saveMeasurements();
            Utils.closeModal();
            this.render();

            Utils.showNotification('Измерение удалено', 'warning');
        });
        document.getElementById('cancel-d').addEventListener('click', () => Utils.closeModal());
    },

    exportData() {
        let csv = 'Дата,Вес (кг),Рост (см),ИМТ\n';
        this.measurements.forEach(m => {
            csv += `${m.date},${m.weight},${m.height},${this.calcBMI(m.weight, m.height).toFixed(1)}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'growth_data.csv';
        link.click();
        Utils.showNotification('Данные экспортированы', 'success');
    }
};