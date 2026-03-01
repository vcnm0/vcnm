// js/tuberculin.js

const Tuberculin = {
    tests: [],
    childInfo: null,

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadTests();
        this.render();
        this.setupEventListeners();
    },

    loadTests() {
        const saved = localStorage.getItem(App.getStorageKey('tuberculinTests'));
        if (saved) this.tests = JSON.parse(saved);
    },

    saveTests() {
        localStorage.setItem(App.getStorageKey('tuberculinTests'), JSON.stringify(this.tests));
    },

    evaluateMantu(result) {
        if (result <= 1) return { label: 'Отрицательная', class: 'badge-success', desc: 'Инфильтрат отсутствует или уколочная реакция до 1 мм' };
        if (result <= 4) return { label: 'Сомнительная', class: 'badge-warning', desc: 'Инфильтрат 2-4 мм или только гиперемия' };
        if (result <= 9) return { label: 'Слабоположительная', class: 'badge-warning', desc: 'Инфильтрат 5-9 мм' };
        if (result <= 14) return { label: 'Средняя интенсивность', class: 'badge-warning', desc: 'Инфильтрат 10-14 мм' };
        if (result <= 16) return { label: 'Выраженная', class: 'badge-error', desc: 'Инфильтрат 15-16 мм' };
        return { label: 'Гиперергическая', class: 'badge-error', desc: 'Инфильтрат 17+ мм, везикулы, некроз, лимфангоит' };
    },

    evaluateDiaskin(result) {
        if (result <= 1) return { label: 'Отрицательная', class: 'badge-success', desc: 'Уколочная реакция до 1 мм' };
        if (result < 5) return { label: 'Сомнительная', class: 'badge-warning', desc: 'Гиперемия без инфильтрата' };
        if (result <= 14) return { label: 'Положительная', class: 'badge-error', desc: 'Инфильтрат 5-14 мм' };
        return { label: 'Гиперергическая', class: 'badge-error', desc: 'Инфильтрат 15+ мм, везикулы, некроз' };
    },

    evaluate(test) {
        return test.type === 'mantu' ? this.evaluateMantu(test.result) : this.evaluateDiaskin(test.result);
    },

    render() {
        this.container.innerHTML = `
            <div class="tb-wrapper">
                <div class="tb-info card animate-in">
                    <div class="card-header">
                        <span class="card-title">Справочная информация</span>
                    </div>
                    <div class="tb-info-grid">
                        <div class="tb-info-block">
                            <h4>Проба Манту</h4>
                            <p>Проводится ежегодно детям с 12 месяцев до 7 лет (включительно). Оценка реакции через 72 часа.</p>
                            <div class="tb-scale">
                                <div class="tb-scale-item" style="--w:10%;background:var(--success)"><span>0-1</span></div>
                                <div class="tb-scale-item" style="--w:15%;background:var(--warning)"><span>2-4</span></div>
                                <div class="tb-scale-item" style="--w:25%;background:#f97316"><span>5-9</span></div>
                                <div class="tb-scale-item" style="--w:25%;background:#ea580c"><span>10-14</span></div>
                                <div class="tb-scale-item" style="--w:10%;background:var(--error)"><span>15-16</span></div>
                                <div class="tb-scale-item" style="--w:15%;background:#991b1b"><span>17+</span></div>
                            </div>
                        </div>
                        <div class="tb-info-block">
                            <h4>Диаскинтест</h4>
                            <p>Проводится ежегодно детям с 8 до 17 лет. Более специфичный тест на туберкулезную инфекцию.</p>
                            <div class="tb-scale">
                                <div class="tb-scale-item" style="--w:20%;background:var(--success)"><span>0-1</span></div>
                                <div class="tb-scale-item" style="--w:20%;background:var(--warning)"><span>2-4</span></div>
                                <div class="tb-scale-item" style="--w:40%;background:var(--error)"><span>5-14</span></div>
                                <div class="tb-scale-item" style="--w:20%;background:#991b1b"><span>15+</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-header animate-in stagger-1">
                    <div>
                        <span class="section-title">Результаты проб</span>
                        <p class="section-desc">История всех проведенных проб</p>
                    </div>
                    <button id="add-test" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Добавить пробу</button>
                </div>

                <div id="tests-list" class="tb-grid animate-in stagger-2"></div>
            </div>
        `;
        this.renderTests();
    },

    renderTests() {
        const list = document.getElementById('tests-list');
        if (!list) return;
        if (this.tests.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-lungs"></i><p>Нет записей о пробах</p></div>';
            return;
        }

        list.innerHTML = this.tests.sort((a, b) => new Date(b.date) - new Date(a.date)).map(test => {
            const ev = this.evaluate(test);
            return `
                <div class="card tb-card">
                    <div class="tb-card-top">
                        <div>
                            <span class="tb-card-type">${test.type === 'mantu' ? 'Проба Манту' : 'Диаскинтест'}</span>
                            <span class="tb-card-date">${Utils.formatDateShort(test.date)}</span>
                        </div>
                        <span class="badge ${ev.class}">${ev.label}</span>
                    </div>
                    <div class="tb-card-result">
                        <div class="tb-result-value">${test.result} <small>мм</small></div>
                        <p class="tb-result-desc">${ev.desc}</p>
                    </div>
                    <div class="tb-card-actions">
                        <button class="btn-icon btn-edit" data-id="${test.id}"><i class="fas fa-pen"></i></button>
                        <button class="btn-icon btn-delete" data-id="${test.id}"><i class="fas fa-trash-can"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    },

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.id === 'add-test') { this.showTestModal(); return; }
            const id = parseInt(btn.dataset.id);
            if (btn.classList.contains('btn-edit')) this.showTestModal(id);
            else if (btn.classList.contains('btn-delete')) this.showDeleteConfirmation(id);
        });
    },

    showTestModal(id = null) {
        const test = id ? this.tests.find(t => t.id === id) : null;
        Utils.showModal(test ? 'Редактировать пробу' : 'Добавить пробу', `
            <form id="test-form">
                <div class="form-group">
                    <label for="test-type">Тип пробы</label>
                    <select id="test-type" required>
                        <option value="mantu" ${test?.type === 'mantu' ? 'selected' : ''}>Проба Манту</option>
                        <option value="diaskintest" ${test?.type === 'diaskintest' ? 'selected' : ''}>Диаскинтест</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="test-date">Дата проведения</label>
                    <input type="date" id="test-date" value="${test?.date || ''}" required>
                </div>
                <div class="form-group">
                    <label for="test-result">Результат (мм)</label>
                    <input type="number" id="test-result" step="0.5" min="0" value="${test?.result ?? ''}" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">${test ? 'Сохранить' : 'Добавить'}</button>
            </form>
        `);

        document.getElementById('test-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                type: document.getElementById('test-type').value,
                date: document.getElementById('test-date').value,
                result: parseFloat(document.getElementById('test-result').value)
            };
            if (test) {
                Object.assign(this.tests.find(t => t.id === id), data);
            } else {
                this.tests.push({ id: Date.now(), ...data });
            }
            this.saveTests();
            Utils.closeModal();
            this.renderTests();
            Utils.showNotification(test ? 'Проба обновлена' : 'Проба добавлена', 'success');
        });
    },

    showDeleteConfirmation(id) {
        const test = this.tests.find(t => t.id === id);
        Utils.showModal('Удаление пробы', `
            <p style="margin-bottom:1rem">Удалить пробу от ${Utils.formatDateShort(test.date)}?</p>
            <div class="modal-actions">
                <button id="cancel-del" class="btn btn-secondary">Отмена</button>
                <button id="confirm-del" class="btn btn-danger">Удалить</button>
            </div>
        `);
        document.getElementById('confirm-del').addEventListener('click', () => {
            this.tests = this.tests.filter(t => t.id !== id);
            this.saveTests();
            Utils.closeModal();
            this.renderTests();
            Utils.showNotification('Проба удалена', 'warning');
        });
        document.getElementById('cancel-del').addEventListener('click', () => Utils.closeModal());
    },

    getTests() { return this.tests; }
};