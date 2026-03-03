// js/teeth.js — Зубная формула с кариесом как статус

const Teeth = {
    childInfo: null,
    teethData: {},

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
            var saved = localStorage.getItem(App.getStorageKey('teeth'));
            this.teethData = saved ? JSON.parse(saved) : {};
        } catch(e) { this.teethData = {}; }
    },

    saveData() {
        localStorage.setItem(App.getStorageKey('teeth'), JSON.stringify(this.teethData));
    },

    getStatus(id) {
        return (this.teethData[id] && this.teethData[id].status) || 'pending';
    },

    toothHTML(id) {
        var n = this.norms[id];
        var st = this.getStatus(id);
        // Classes: erupted, fallen, caries, treated, removed
        var cls = '';
        if (st === 'erupted') cls = ' erupted';
        else if (st === 'caries') cls = ' caries';
        else if (st === 'treated') cls = ' treated';
        else if (st === 'fallen') cls = ' fallen';
        else if (st === 'removed') cls = ' removed';

        var icon = '';
        if (st === 'caries')  icon = '<span class="caries-dot"></span>';
        if (st === 'treated') icon = '<span class="treated-mark">P</span>';

        return '<div class="t' + cls + '" data-tid="' + id + '">' +
                   '<div class="t-shape ' + n.shape + '">' + icon + '</div>' +
                   '<span class="t-num">' + id + '</span>' +
               '</div>';
    },

    rowHTML(ids, cls) {
        var h = '<div class="teeth-row ' + cls + '">';
        for (var i = 0; i < ids.length; i++) {
            h += this.toothHTML(ids[i]);
            if (i === 4) h += '<div class="row-divider"></div>';
        }
        h += '</div>';
        return h;
    },

    statsHTML() {
        var erupted = 0, fallen = 0, caries = 0, treated = 0, removed = 0;
        for (var k in this.teethData) {
            var s = this.teethData[k].status;
            if (s === 'erupted') erupted++;
            if (s === 'fallen')  fallen++;
            if (s === 'caries')  caries++;
            if (s === 'treated') treated++;
            if (s === 'removed') removed++;
        }
        var total = erupted + caries + treated; // active teeth
        var pct = Math.round((total / 20) * 100);

        // КПУ index (Кариес + Пломба + Удалённый)
        var kpu = caries + treated + removed;

        return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">' +
                  '<div>' +
                    '<div class="teeth-stat-number">' + total + ' <span style="font-size:1rem;font-weight:500;color:var(--text-muted)">/ 20</span></div>' +
                    '<div class="teeth-stat-label">Активных зубов</div>' +
                  '</div>' +
                  '<div class="teeth-progress-ring" style="background:conic-gradient(var(--primary) ' + pct + '%, var(--border-light) 0)"></div>' +
               '</div>' +
               '<div class="teeth-mini-stat">' +
                  '<div><div style="font-size:1.15rem;font-weight:700">' + (erupted + caries + treated) + '</div><div style="font-size:0.72rem;color:var(--text-muted)">Прорезалось</div></div>' +
                  '<div style="border-left-color:var(--error)"><div style="font-size:1.15rem;font-weight:700;color:var(--error)">' + caries + '</div><div style="font-size:0.72rem;color:var(--text-muted)">Кариес</div></div>' +
                  '<div style="border-left-color:var(--info)"><div style="font-size:1.15rem;font-weight:700;color:var(--info)">' + treated + '</div><div style="font-size:0.72rem;color:var(--text-muted)">Пломб</div></div>' +
                  '<div style="border-left-color:var(--warning)"><div style="font-size:1.15rem;font-weight:700">' + fallen + '</div><div style="font-size:0.72rem;color:var(--text-muted)">Сменилось</div></div>' +
               '</div>' +
               '<div style="margin-top:1rem;padding:0.75rem;background:var(--bg-secondary);border-radius:8px;text-align:center">' +
                  '<span style="font-size:0.78rem;color:var(--text-muted)">Индекс КПУ (к+п+у)</span>' +
                  '<div style="font-size:1.5rem;font-weight:700;color:' + (kpu === 0 ? 'var(--success)' : kpu <= 3 ? 'var(--warning)' : 'var(--error)') + '">' + kpu + '</div>' +
                  '<span style="font-size:0.72rem;color:var(--text-muted)">' + (kpu === 0 ? 'Отлично' : kpu <= 3 ? 'Компенсированный' : kpu <= 6 ? 'Субкомпенсированный' : 'Декомпенсированный') + '</span>' +
               '</div>';
    },

    render() {
        var u1 = ['55','54','53','52','51'];
        var u2 = ['61','62','63','64','65'];
        var l1 = ['85','84','83','82','81'];
        var l2 = ['71','72','73','74','75'];

        this.container.innerHTML =
        '<div class="teeth-page">' +
          '<h2><i class="fas fa-tooth" style="color:var(--primary)"></i> Зубная формула</h2>' +
          '<p class="section-desc">Полный учёт состояния зубов: прорезывание, кариес, лечение, смена</p>' +
          '<div class="teeth-layout">' +
            '<div class="card jaw-card">' +
              '<div class="jaw-section">' +
                '<div class="jaw-label">Верхняя челюсть</div>' +
                this.rowHTML(u1.concat(u2), 'upper') +
              '</div>' +
              '<div class="jaw-section">' +
                this.rowHTML(l1.concat(l2), 'lower') +
                '<div class="jaw-label">Нижняя челюсть</div>' +
              '</div>' +
              '<div class="teeth-legend">' +
                '<span><div class="legend-dot"></div>Ожидает</span>' +
                '<span><div class="legend-dot erupted"></div>Здоровый</span>' +
                '<span><div class="legend-dot lg-caries"></div>Кариес</span>' +
                '<span><div class="legend-dot lg-treated"></div>Пломба</span>' +
                '<span><div class="legend-dot fallen"></div>Сменился</span>' +
              '</div>' +
            '</div>' +
            '<div class="teeth-sidebar">' +
              '<div class="card" style="padding:1.25rem">' +
                '<div class="card-header"><span class="card-title"><i class="fas fa-chart-bar" style="color:var(--primary);margin-right:6px"></i>Статистика</span></div>' +
                '<div id="teeth-stats">' + this.statsHTML() + '</div>' +
              '</div>' +
              '<div class="card" style="padding:1.25rem">' +
                '<div class="card-header"><span class="card-title"><i class="fas fa-info-circle" style="color:var(--info);margin-right:6px"></i>Сроки прорезывания</span></div>' +
                '<ul class="teeth-info-list">' +
                  '<li><span>Центральные резцы</span><span>6–10 мес</span></li>' +
                  '<li><span>Боковые резцы</span><span>8–16 мес</span></li>' +
                  '<li><span>Первые моляры</span><span>13–19 мес</span></li>' +
                  '<li><span>Клыки</span><span>16–23 мес</span></li>' +
                  '<li><span>Вторые моляры</span><span>20–30 мес</span></li>' +
                '</ul>' +
                '<p style="margin-top:0.75rem;font-size:0.75rem;color:var(--text-muted);border-top:1px dashed var(--border-light);padding-top:0.5rem">*Задержка до 6 мес — вариант нормы</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    },

    openModal(id) {
        var info = this.norms[id];
        if (!info) return;
        var cur = this.teethData[id] || { status: 'pending', date: '', note: '' };

        var sel = function(val) { return cur.status === val ? ' selected' : ''; };

        Utils.showModal('Зуб ' + id + ' — ' + info.name,
            '<div style="margin-bottom:1rem;font-size:0.9rem;color:var(--text-secondary)">' +
                'Норма: <strong>' + info.time + '</strong>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Статус зуба</label>' +
                '<select id="t-st" class="form-control">' +
                    '<option value="pending"'  + sel('pending')  + '>Ожидается</option>' +
                    '<option value="erupted"'  + sel('erupted')  + '>Прорезался (здоровый)</option>' +
                    '<option value="caries"'   + sel('caries')   + '>Кариес</option>' +
                    '<option value="treated"'  + sel('treated')  + '>Пролечен (пломба)</option>' +
                    '<option value="fallen"'   + sel('fallen')   + '>Выпал (смена)</option>' +
                    '<option value="removed"'  + sel('removed')  + '>Удалён</option>' +
                '</select>' +
            '</div>' +
            '<div class="form-group" id="t-dg" style="' + (cur.status === 'pending' ? 'display:none' : '') + '">' +
                '<label>Дата</label>' +
                '<input type="date" id="t-dt" class="form-control" value="' + (cur.date || '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Заметка</label>' +
                '<input type="text" id="t-nt" class="form-control" value="' + (cur.note || '') + '" placeholder="Лечение, температура...">' +
            '</div>' +
            '<div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.25rem">' +
                '<button class="btn btn-secondary" onclick="Utils.closeModal()">Отмена</button>' +
                '<button class="btn btn-primary" id="t-save">Сохранить</button>' +
            '</div>'
        );

        document.getElementById('t-st').addEventListener('change', function(e) {
            document.getElementById('t-dg').style.display = e.target.value === 'pending' ? 'none' : '';
        });

        document.getElementById('t-save').addEventListener('click', function() {
            var status = document.getElementById('t-st').value;
            var date = document.getElementById('t-dt') ? document.getElementById('t-dt').value : '';
            var note = document.getElementById('t-nt').value;
            Teeth.teethData[id] = {
                status: status,
                date: status === 'pending' ? '' : date,
                note: note
            };
            Teeth.saveData();
            Utils.closeModal();
            Teeth.render();
        });
    }
};

window.Teeth = Teeth;

document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
        if (el.classList && el.classList.contains('t') && el.getAttribute('data-tid')) {
            e.preventDefault();
            e.stopPropagation();
            Teeth.openModal(el.getAttribute('data-tid'));
            return;
        }
        el = el.parentElement;
    }
}, true);
