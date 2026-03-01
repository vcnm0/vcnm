// js/teeth.js — Зубная формула (полная перезапись)

const Teeth = {
    childInfo: null,
    teethData: {},

    // 20 молочных зубов: нормы ВОЗ
    norms: {
        '55': { name: 'Второй моляр',       time: '20–30 мес', shape: 'molar' },
        '54': { name: 'Первый моляр',        time: '13–19 мес', shape: 'molar' },
        '53': { name: 'Клык',                time: '16–22 мес', shape: 'canine' },
        '52': { name: 'Боковой резец',        time: '8–12 мес',  shape: 'incisor' },
        '51': { name: 'Центральный резец',    time: '6–10 мес',  shape: 'incisor' },
        '61': { name: 'Центральный резец',    time: '6–10 мес',  shape: 'incisor' },
        '62': { name: 'Боковой резец',        time: '8–12 мес',  shape: 'incisor' },
        '63': { name: 'Клык',                time: '16–22 мес', shape: 'canine' },
        '64': { name: 'Первый моляр',        time: '13–19 мес', shape: 'molar' },
        '65': { name: 'Второй моляр',       time: '20–30 мес', shape: 'molar' },
        '85': { name: 'Второй моляр',       time: '20–30 мес', shape: 'molar' },
        '84': { name: 'Первый моляр',        time: '14–18 мес', shape: 'molar' },
        '83': { name: 'Клык',                time: '17–23 мес', shape: 'canine' },
        '82': { name: 'Боковой резец',        time: '10–16 мес', shape: 'incisor' },
        '81': { name: 'Центральный резец',    time: '6–10 мес',  shape: 'incisor' },
        '71': { name: 'Центральный резец',    time: '6–10 мес',  shape: 'incisor' },
        '72': { name: 'Боковой резец',        time: '10–16 мес', shape: 'incisor' },
        '73': { name: 'Клык',                time: '17–23 мес', shape: 'canine' },
        '74': { name: 'Первый моляр',        time: '14–18 мес', shape: 'molar' },
        '75': { name: 'Второй моляр',       time: '20–30 мес', shape: 'molar' }
    },

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadData();
        this.render();
    },

    loadData() {
        try {
            const saved = localStorage.getItem(App.getStorageKey('teeth'));
            this.teethData = saved ? JSON.parse(saved) : {};
        } catch(e) {
            this.teethData = {};
        }
    },

    saveData() {
        localStorage.setItem(App.getStorageKey('teeth'), JSON.stringify(this.teethData));
    },

    getStatus(id) {
        return (this.teethData[id] && this.teethData[id].status) || 'pending';
    },

    // Build the tooth HTML
    toothHTML(id) {
        const n = this.norms[id];
        const st = this.getStatus(id);
        const cls = st === 'erupted' ? ' erupted' : (st === 'fallen' ? ' fallen' : '');
        return '<div class="t' + cls + '" data-tid="' + id + '">' +
                   '<div class="t-shape ' + n.shape + '"></div>' +
                   '<span class="t-num">' + id + '</span>' +
               '</div>';
    },

    rowHTML(ids, cls) {
        let h = '<div class="teeth-row ' + cls + '">';
        for (let i = 0; i < ids.length; i++) {
            h += this.toothHTML(ids[i]);
            if (i === 4) h += '<div class="row-divider"></div>';
        }
        h += '</div>';
        return h;
    },

    statsHTML() {
        let erupted = 0, fallen = 0;
        for (const k in this.teethData) {
            if (this.teethData[k].status === 'erupted') erupted++;
            if (this.teethData[k].status === 'fallen')  fallen++;
        }
        const pct = Math.round((erupted / 20) * 100);
        return '<div style="display:flex;justify-content:space-between;align-items:center">' +
                  '<div>' +
                    '<div class="teeth-stat-number">' + erupted + ' <span style="font-size:1rem;font-weight:500;color:var(--text-muted)">/ 20</span></div>' +
                    '<div class="teeth-stat-label">Зубов прорезалось</div>' +
                  '</div>' +
                  '<div class="teeth-progress-ring" style="background:conic-gradient(var(--primary) ' + pct + '%, var(--border-light) 0)"></div>' +
               '</div>' +
               '<div class="teeth-mini-stat">' +
                  '<div><div style="font-size:1.2rem;font-weight:600">' + erupted + '</div><div style="font-size:0.75rem;color:var(--text-muted)">Прорезалось</div></div>' +
                  '<div><div style="font-size:1.2rem;font-weight:600">' + fallen + '</div><div style="font-size:0.75rem;color:var(--text-muted)">Сменилось</div></div>' +
               '</div>';
    },

    render() {
        const upperLeft  = ['55','54','53','52','51'];
        const upperRight = ['61','62','63','64','65'];
        const lowerLeft  = ['85','84','83','82','81'];
        const lowerRight = ['71','72','73','74','75'];

        this.container.innerHTML =
        '<div class="teeth-page">' +
          '<h2><i class="fas fa-tooth" style="color:var(--primary)"></i> Зубная формула</h2>' +
          '<p class="section-desc">Отмечайте прорезывание и смену молочных зубов малыша</p>' +

          '<div class="teeth-layout">' +

            // Left: jaw
            '<div class="card jaw-card">' +
              '<div class="jaw-section">' +
                '<div class="jaw-label">Верхняя челюсть</div>' +
                this.rowHTML(upperLeft.concat(upperRight), 'upper') +
              '</div>' +
              '<div class="jaw-section">' +
                this.rowHTML(lowerLeft.concat(lowerRight), 'lower') +
                '<div class="jaw-label">Нижняя челюсть</div>' +
              '</div>' +
              '<div class="teeth-legend">' +
                '<span><div class="legend-dot"></div>Ожидается</span>' +
                '<span><div class="legend-dot erupted"></div>Прорезался</span>' +
                '<span><div class="legend-dot fallen"></div>Выпал</span>' +
              '</div>' +
            '</div>' +

            // Right: sidebar
            '<div class="teeth-sidebar">' +
              '<div class="card" style="padding:1.25rem">' +
                '<div class="card-header"><span class="card-title">Статистика</span></div>' +
                '<div id="teeth-stats">' + this.statsHTML() + '</div>' +
              '</div>' +
              '<div class="card" style="padding:1.25rem">' +
                '<div class="card-header"><span class="card-title"><i class="fas fa-info-circle" style="color:var(--info);margin-right:6px"></i>Порядок появления</span></div>' +
                '<ul class="teeth-info-list">' +
                  '<li><span>Центральные резцы</span><span>6–10 мес</span></li>' +
                  '<li><span>Боковые резцы</span><span>8–16 мес</span></li>' +
                  '<li><span>Первые моляры</span><span>13–19 мес</span></li>' +
                  '<li><span>Клыки</span><span>16–23 мес</span></li>' +
                  '<li><span>Вторые моляры</span><span>20–30 мес</span></li>' +
                '</ul>' +
                '<p style="margin-top:0.75rem;font-size:0.78rem;color:var(--text-muted);border-top:1px dashed var(--border-light);padding-top:0.5rem">*Задержка до 6 мес считается вариантом нормы</p>' +
              '</div>' +
            '</div>' +

          '</div>' +
        '</div>';
    },

    openModal(id) {
        const info = this.norms[id];
        if (!info) return;
        const cur = this.teethData[id] || { status: 'pending', date: '', note: '' };

        Utils.showModal('Зуб ' + id + ' — ' + info.name,
            '<div style="margin-bottom:1rem;font-size:0.9rem;color:var(--text-secondary)">' +
                'Норма прорезывания: <strong>' + info.time + '</strong>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Статус</label>' +
                '<select id="t-st" class="form-control">' +
                    '<option value="pending"' + (cur.status==='pending'?' selected':'') + '>Ожидается</option>' +
                    '<option value="erupted"' + (cur.status==='erupted'?' selected':'') + '>Прорезался</option>' +
                    '<option value="fallen"'  + (cur.status==='fallen' ?' selected':'') + '>Выпал (Смена)</option>' +
                '</select>' +
            '</div>' +
            '<div class="form-group" id="t-dg" style="' + (cur.status==='pending'?'display:none':'') + '">' +
                '<label>Дата</label>' +
                '<input type="date" id="t-dt" class="form-control" value="' + (cur.date || '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Заметка</label>' +
                '<input type="text" id="t-nt" class="form-control" value="' + (cur.note || '') + '" placeholder="Температура, капризы...">' +
            '</div>' +
            '<div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.25rem">' +
                '<button class="btn btn-secondary" onclick="Utils.closeModal()">Отмена</button>' +
                '<button class="btn btn-primary" id="t-save">Сохранить</button>' +
            '</div>'
        );

        // Show/hide date based on status
        document.getElementById('t-st').addEventListener('change', function(e) {
            document.getElementById('t-dg').style.display = e.target.value === 'pending' ? 'none' : '';
        });

        // Save
        document.getElementById('t-save').addEventListener('click', function() {
            var status = document.getElementById('t-st').value;
            var date = document.getElementById('t-dt') ? document.getElementById('t-dt').value : '';
            var note = document.getElementById('t-nt').value;
            Teeth.teethData[id] = { status: status, date: status === 'pending' ? '' : date, note: note };
            Teeth.saveData();
            Utils.closeModal();
            Teeth.render();
            // Update stats
            var el = document.getElementById('teeth-stats');
            if (el) el.innerHTML = Teeth.statsHTML();
        });
    }
};

// Expose globally
window.Teeth = Teeth;

// ============================================
// GLOBAL click handler — catches ALL tooth clicks
// on any page, at any time, regardless of rendering.
// ============================================
document.addEventListener('click', function(e) {
    var el = e.target;
    // Walk up DOM to find .t with data-tid
    while (el && el !== document.body) {
        if (el.classList && el.classList.contains('t') && el.getAttribute('data-tid')) {
            e.preventDefault();
            e.stopPropagation();
            Teeth.openModal(el.getAttribute('data-tid'));
            return;
        }
        el = el.parentElement;
    }
}, true); // useCapture = true for maximum priority
