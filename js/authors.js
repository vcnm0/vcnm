// js/authors.js

const Authors = {
    init(container) {
        this.container = container;
        this.render();
    },

    render() {
        const team = [
            { name: "Дёндёши Давид",                   desc: "БГМУ, специальность «Психиатрия»",                                    icon: "fa-user-doctor",     gradient: "linear-gradient(135deg, #6366f1, #818cf8)" },
            { name: "Прасковский Даниил Денисович",     desc: "ОрГМУ, специальность «Педиатрия»",                                     icon: "fa-stethoscope",     gradient: "linear-gradient(135deg, #10b981, #34d399)" },
            { name: "Бикметов Тимур Ильсурович",        desc: "Врач-педиатр, заведующий ДПО №1 г. Стерлитамак",                        icon: "fa-user-nurse",      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
            { name: "Зорин Игорь Владимирович",         desc: "Профессор, д.м.н., зав. кафедрой поликлинической педиатрии, ОрГМУ",     icon: "fa-user-tie",        gradient: "linear-gradient(135deg, #ef4444, #f87171)" },
            { name: "Карымова Гузель Корганбековна",    desc: "К.м.н., ст. преподаватель кафедры поликлинической педиатрии, ОрГМУ",    icon: "fa-user-graduate",   gradient: "linear-gradient(135deg, #d946ef, #e879f9)" },
            { name: "Никифоров Дмитрий Алексеевич",     desc: "Аспирант кафедры поликлинической педиатрии, ОрГМУ",                     icon: "fa-chalkboard-user", gradient: "linear-gradient(135deg, #06b6d4, #22d3ee)" }
        ];

        this.container.innerHTML = `
            <div class="au-page">
                <div class="au-hero animate-in">
                    <div class="au-hero-icon"><i class="fas fa-heartbeat"></i></div>
                    <h2>Child Health Tracker</h2>
                    <p>Цифровой помощник для мониторинга здоровья и развития ребёнка</p>
                </div>

                <div class="au-grid">
                    ${team.map((p, i) => `
                        <div class="au-card animate-in stagger-${(i % 5) + 1}">
                            <div class="au-icon" style="background:${p.gradient}">
                                <i class="fas ${p.icon}"></i>
                            </div>
                            <div class="au-text">
                                <div class="au-name">${p.name}</div>
                                <div class="au-desc">${p.desc}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="au-footer animate-in">
                    <span class="au-ver"><i class="fas fa-code-branch"></i> v2.0</span>
                    <span>©  2025 — 2026</span>
                </div>
            </div>
        `;
    }
};
