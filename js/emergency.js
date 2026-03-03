// js/emergency.js — Экстренная помощь: дозировки и первая помощь по стандартам РФ

const Emergency = {
    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.render();
    },

    getWeight() {
        if (typeof Growth !== 'undefined' && Growth.measurements && Growth.measurements.length > 0) {
            return Growth.measurements[Growth.measurements.length - 1].weight;
        }
        return null;
    },

    calcDose(mgPerKg, maxMg, weight) {
        var dose = Math.round(weight * mgPerKg * 10) / 10;
        if (maxMg && dose > maxMg) dose = maxMg;
        return dose;
    },

    render() {
        var w = this.getWeight();
        var wStr = w ? w.toFixed(1) : '—';

        // Drug dosages per RF clinical guidelines (КР РФ)
        var drugs = [
            { name: 'Парацетамол', form: 'сироп 120 мг/5 мл', mgKg: 15, max: 60, unit: 'мг', freq: 'не чаще 1 раз в 6 ч', icon: 'fa-temperature-arrow-down', color: 'var(--primary)', note: 'Суточная макс. 60 мг/кг. Действует через 30-40 мин.' },
            { name: 'Ибупрофен', form: 'сироп 100 мг/5 мл', mgKg: 10, max: 30, unit: 'мг', freq: 'не чаще 1 раз в 6-8 ч', icon: 'fa-temperature-arrow-down', color: 'var(--primary)', note: 'Разрешен с 3 месяцев. Суточная макс. 30 мг/кг.' },
            { name: 'Смекта (Диосмектит)', form: 'порошок', mgKg: 0, max: 0, unit: 'пакетик', freq: 'до 3-4 р/день', icon: 'fa-leaf', color: 'var(--warning)', note: 'До 1 года: 1 пак/сут. От 1 до 2 лет: 1-2 пак/сут. Более 2 лет: 2-3 пак/сут.' },
            { name: 'Оральная регидратационная соль (ОРС)', form: 'Адисорд / Регидрон Био', mgKg: 0, max: 0, unit: 'мл', freq: 'дробно', icon: 'fa-glass-water', color: 'var(--info)', note: 'Отпаивание при потере жидкости: 50-100 мл/кг за 4-6 часов.' },
            { name: 'Цетиризин (Зиртек)', form: 'капли 10 мг/мл', mgKg: 0, max: 0, unit: 'капель', freq: '1-2 р/день', icon: 'fa-hand-dots', color: '#8b5cf6', note: 'С 6 мес до 1 года: 5 кап. 1 р/д. От 1 до 2 лет: 5 кап. 2 р/д. От 2 до 6 лет: 5 кап. 2 р/д или 10 кап. 1 р/д.' }
        ];

        var calcMgToMl = function(mg, concentrationMg, concentrationMl) {
            return Math.round((mg * concentrationMl / concentrationMg) * 10) / 10;
        };

        var drugsHTML = drugs.map(function(d) {
            var doseStr = '';
            if (d.mgKg > 0 && w) {
                var doseMg = Math.round(w * d.mgKg * 10) / 10;
                var doseMl = 0;
                if (d.name === 'Парацетамол') doseMl = calcMgToMl(doseMg, 120, 5);
                if (d.name === 'Ибупрофен') doseMl = calcMgToMl(doseMg, 100, 5);
                
                doseStr = '<div style="font-size:1.5rem;font-weight:800;color:' + d.color + ';line-height:1">' +
                    doseMl + ' <span style="font-size:0.9rem;font-weight:600">мл</span>' +
                '</div>' +
                '<div style="font-size:0.85rem;color:var(--text);margin-top:0.25rem">Разовая: ' + doseMg + ' мг</div>';
            } else {
                doseStr = '<div style="font-size:0.9rem;color:var(--text);font-weight:500">' + d.note.split('.')[0] + '</div>';
            }
            return '<div class="card emg-drug-card">' +
                '<div class="emg-drug-icon" style="color:' + d.color + ';background:' + d.color + '1a"><i class="fas ' + d.icon + '"></i></div>' +
                '<div class="emg-drug-info">' +
                    '<div class="emg-drug-name">' + d.name + ' <span style="font-weight:400;font-size:0.8rem;color:var(--text-muted)">' + d.form + '</span></div>' +
                    doseStr +
                    '<div class="emg-drug-freq" style="margin-top:0.5rem"><i class="fas fa-clock"></i> ' + d.freq + '</div>' +
                    (d.mgKg > 0 ? '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem">' + d.note + '</div>' : '') +
                '</div>' +
            '</div>';
        }).join('');

        // First aid algorithms per RF standards
        var aidCards = [
            { title: 'Лихорадка', icon: 'fa-temperature-high', color: 'var(--error)',
              steps: '1. Давать жаропонижающие при t >38.5-39.0°C (для здоровых детей) или при дискомфорте.\n2. НЕ использовать Анальгин, Аспирин или Нимесулид.\n3. Раскрыть ребенка, не кутать.\n4. Обильное теплое питье (часто, мелкими порциями).\n5. Физические методы охлаждения: обтирание водой Т-Т тела. НЕ использовать спирт/уксус.' },
            { title: 'Обезвоживание (при рвоте/диарее)', icon: 'fa-droplet-slash', color: 'var(--warning)',
              steps: '1. Начинать отпаивание ОРС (Оральная регидратационная соль) немедленно.\n2. Объем: 50-100 мл/кг в течение первых 4-6 часов.\n3. Давать по 5-10 мл (1-2 чайные ложки) каждые 5-10 минут.\n4. При регулярной рвоте: сделать паузу 10-15 мин, затем продолжить по 5 мл.\n5. Вызвать врача, если: плач без слез, сухие губы, впавший родничок, нет мочи >6 часов.' },
            { title: 'Судороги при температуре (Фебрильные)', icon: 'fa-brain', color: '#8b5cf6',
              steps: '1. Сохранять спокойствие. Вызвать СМП (112).\n2. Положить ребенка на бок на пол или кровать.\n3. Убрать от головы твердые и острые предметы.\n4. НЕ вставлять в рот ложки, пальцы и другие предметы!\n5. НЕ удерживать силой.\n6. Засечь время. Обычно приступ длится 1-3 минуты.' },
            { title: 'Инородное тело дыхательных путей', icon: 'fa-lungs', color: 'var(--error)',
              steps: '1. Если ребенок эффективно кашляет, кричит, дышит — НЕ вмешиваться, поощрять кашель.\n2. До 1 года (в сознании): положить животом на предплечье, 5 ударов основанием ладони между лопатками, перевернуть, 5 толчков двумя пальцами в центр грудины.\n3. Старше 1 года (в сознании): прием Геймлиха (толчки в живот над пупком).\n4. При потере сознания: немедленно начать СЛР и вызвать 112.' },
            { title: 'Ожог (термический)', icon: 'fa-fire-flame-curved', color: 'var(--error)',
              steps: '1. Немедленно охладить: проточная прохладная вода (15-20°C) на 10-20 минут.\n2. Снять одежду (вокруг ожога), если не прилипла.\n3. НЕ мазать пантенолом, маслом, сметаной, не прикладывать лед в первые минуты!\n4. Дать Нурофен или Парацетамол для обезболивания.\n5. Наложить чистую сухую или влажную повязку, обратиться к врачу.' }
        ];

        var aidHTML = aidCards.map(function(c) {
            var stepsList = c.steps.split('\n').map(function(s) { return '<li>' + s.replace(/^\d+\.\s*/, '') + '</li>'; }).join('');
            return '<div class="card emg-aid-card">' +
                '<div class="emg-aid-header" style="border-color:' + c.color + '">' +
                    '<i class="fas ' + c.icon + '" style="color:' + c.color + '"></i> ' + c.title +
                '</div>' +
                '<ol class="emg-aid-steps">' + stepsList + '</ol>' +
            '</div>';
        }).join('');

        this.container.innerHTML =
        '<div class="emg-page">' +
          '<h2><i class="fas fa-kit-medical" style="color:var(--error)"></i> Экстренная помощь</h2>' +
          '<p class="section-desc">Дозировки препаратов и алгоритмы первой помощи по клиническим рекомендациям РФ</p>' +

          '<div class="emg-weight-banner card animate-in">' +
            '<i class="fas fa-weight-scale"></i>' +
            '<div>' +
                '<div style="font-weight:700;font-size:1.1rem">Актуальный вес: ' + wStr + ' кг</div>' +
                '<div style="font-size:0.8rem;color:var(--text-muted)">Дозировки рассчитаны автоматически по последнему измерению</div>' +
            '</div>' +
          '</div>' +

          '<h3 class="emg-section-title animate-in stagger-1"><i class="fas fa-pills"></i> Дозировки жаропонижающих</h3>' +
          '<div class="emg-drugs-grid animate-in stagger-2">' + drugsHTML + '</div>' +

          '<h3 class="emg-section-title animate-in stagger-3"><i class="fas fa-heart-pulse"></i> Алгоритмы первой помощи</h3>' +
          '<div class="emg-aid-grid animate-in stagger-4">' + aidHTML + '</div>' +

          '<div class="emg-footer animate-in stagger-5">' +
            '<div class="card" style="padding:1rem;text-align:center;border:2px solid var(--error)">' +
                '<div style="font-size:1.5rem;font-weight:800;color:var(--error);margin-bottom:0.25rem"><i class="fas fa-phone"></i> 112</div>' +
                '<div style="font-size:0.85rem;color:var(--text-secondary)">Единый номер экстренных служб</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
};
