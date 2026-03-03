// js/vitamind.js — Профилактика: Витамин D (Национальная программа РФ 2021)

const VitaminD = {
    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.loadData();
        this.render();
    },

    loadData() {
        try {
            this.logD = JSON.parse(localStorage.getItem(App.getStorageKey('vitaminD_log')) || '[]');
        } catch(e) { 
            this.logD = []; 
        }
    },

    saveData() {
        localStorage.setItem(App.getStorageKey('vitaminD_log'), JSON.stringify(this.logD));
    },

    getAgeMonths() {
        if (!this.childInfo || !this.childInfo.birthdate) return 0;
        return Utils.calculateAgeInMonths(this.childInfo.birthdate, new Date());
    },

    // Национальная программа «Недостаточность витамина D» РФ 2021
    getVitDRec(ageMonths) {
        if (ageMonths < 1)  return { dose: '500 МЕ/сутки',  note: 'Ежедневно с первых дней жизни (вне зависимости от вида вскармливания)' };
        if (ageMonths < 12) return { dose: '1000 МЕ/сутки', note: 'Ежедневно, без перерыва на летние месяцы' };
        if (ageMonths < 36) return { dose: '1500 МЕ/сутки', note: 'Ежедневно, непрерывно, круглогодично' };
        return { dose: '1000 МЕ/сутки', note: 'Ежедневно, круглогодично' };
    },

    toggleDate(isoDate) {
        var idx = this.logD.indexOf(isoDate);
        if (idx >= 0) {
            this.logD.splice(idx, 1);
            Utils.showNotification('Отметка снята', 'info');
        } else {
            this.logD.push(isoDate);
            Utils.showNotification('Витамин D отмечен', 'success');
        }
        this.saveData();
    },

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    },

    renderCalendar() {
        var calEl = document.getElementById('vd-calendar-container');
        if (!calEl) return;

        var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        var firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        if (firstDay === 0) firstDay = 7; // Monday start
        var daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        var todayIso = new Date().toISOString().split('T')[0];

        // Header
        var html = '<div class="vd-cal-header">' +
            '<button class="btn-icon" id="vd-prev-mo"><i class="fas fa-chevron-left"></i></button>' +
            '<div class="vd-cal-title">' + monthNames[this.currentMonth] + ' ' + this.currentYear + '</div>' +
            '<button class="btn-icon" id="vd-next-mo"><i class="fas fa-chevron-right"></i></button>' +
        '</div>';

        // Weekdays
        html += '<div class="vd-cal-grid vd-cal-weekdays">' +
            '<div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>' +
        '</div>';

        // Days grid
        html += '<div class="vd-cal-grid vd-cal-days">';
        
        // Empty cells
        for (var i = 1; i < firstDay; i++) {
            html += '<div class="vd-cal-day empty"></div>';
        }

        // Actual days
        for (var i = 1; i <= daysInMonth; i++) {
            var dateStr = this.currentYear + '-' + String(this.currentMonth + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0');
            var isTaken = this.logD.indexOf(dateStr) >= 0;
            var isToday = dateStr === todayIso;
            
            var cls = 'vd-cal-day';
            if (isTaken) cls += ' taken';
            if (isToday) cls += ' today';

            html += '<div class="' + cls + '" data-date="' + dateStr + '">' + i + '</div>';
        }
        html += '</div>';

        calEl.innerHTML = html;

        // Attach events
        var self = this;
        document.getElementById('vd-prev-mo').onclick = function() { self.changeMonth(-1); };
        document.getElementById('vd-next-mo').onclick = function() { self.changeMonth(1); };

        var dayEls = calEl.querySelectorAll('.vd-cal-day:not(.empty)');
        for (var i = 0; i < dayEls.length; i++) {
            dayEls[i].onclick = function() {
                self.toggleDate(this.getAttribute('data-date'));
                self.renderCalendar();
                self.updateStats();
            };
        }
    },

    updateStats() {
        var el = document.getElementById('vd-total-taken');
        if (el) el.innerText = this.logD.length;
    },

    render() {
        var age = this.getAgeMonths();
        var recD = this.getVitDRec(age);

        this.container.innerHTML =
        '<div class="vd-page">' +
          '<h2><i class="fas fa-shield-halved" style="color:var(--primary)"></i> Профилактика</h2>' +
          '<p class="section-desc">Национальная программа по дефициту витамина D (2021 РФ)</p>' +

          '<div class="vd-layout">' +
            '<div class="vd-main">' +

              // === VITAMIN D RECOMMENDED DOSE ===
              '<div class="card vd-dose-card animate-in" style="border-left-color:var(--warning)">' +
                '<div class="vd-dose-header">' +
                    '<div class="vd-dose-icon" style="background:var(--warning)"><i class="fas fa-sun"></i></div>' +
                    '<div>' +
                        '<div class="vd-dose-title">Витамин D (Колекальциферол)</div>' +
                        '<div class="vd-dose-group">Профилактика рахита</div>' +
                    '</div>' +
                '</div>' +
                '<div class="vd-dose-value" style="color:var(--warning)">' + recD.dose + '</div>' +
                '<div class="vd-dose-note"><i class="fas fa-info-circle"></i> ' + recD.note + '</div>' +
              '</div>' +

              // === FULL CALENDAR ===
              '<div class="card animate-in stagger-1" style="padding:1.5rem">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">' +
                    '<h3 style="margin:0;font-size:1.1rem">Календарь приёма</h3>' +
                    '<div style="font-size:0.85rem;color:var(--text-muted)">Всего дней: <span id="vd-total-taken" style="font-weight:700;color:var(--text)">' + this.logD.length + '</span></div>' +
                '</div>' +
                '<p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1.5rem">Кликните на день, чтобы отметить приём препарата.</p>' +
                
                '<div id="vd-calendar-container"></div>' +
              '</div>' +

            '</div>' +

            // Sidebar
            '<div class="vd-sidebar animate-in stagger-2">' +
              '<div class="card" style="padding:1.25rem">' +
                '<div class="card-header"><span class="card-title"><i class="fas fa-book-medical" style="color:var(--primary);margin-right:6px"></i>Клинические рекомендации</span></div>' +
                '<p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5;margin-bottom:0.75rem">' +
                    'Витамин D вырабатывается в коже под воздействием УФ-лучей и поступает с пищей. В условиях РФ (северные широты) <strong>естественный синтез недостаточен</strong> даже летом.' +
                '</p>' +
                '<ul class="vd-signs-list">' +
                    '<li>Показан всем детям с 1 мес жизни</li>' +
                    '<li>Принимать желательно в первой половине дня</li>' +
                    '<li>Водный или масляный раствор (D3)</li>' +
                '</ul>' +
              '</div>' +
              '<div class="card" style="padding:1.25rem;margin-top:1.25rem">' +
                '<div class="card-header"><span class="card-title"><i class="fas fa-triangle-exclamation" style="color:var(--warning);margin-right:6px"></i>Дополнительный риск</span></div>' +
                '<div class="vd-risk-grid">' +
                    '<div class="vd-risk-item">Недоношенные дети</div>' +
                    '<div class="vd-risk-item">Дети на искусственном вскармливании (без адаптированных смесей)</div>' +
                    '<div class="vd-risk-item">Дети с темным цветом кожи</div>' +
                    '<div class="vd-risk-item">Дети с избыточной массой тела</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

          '</div>' +
        '</div>';

        this.renderCalendar();
    }
};
