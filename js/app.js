// js/app.js

const App = {
    currentModule: null,
    childInfo: null,

    pageSubtitles: {
        dashboard: 'Обзор состояния здоровья',
        calendar: 'Расписание вакцинаций и событий',
        vaccines: 'Национальный календарь прививок',
        tuberculin: 'Проба Манту и Диаскинтест',
        growth: 'Рост, вес и физические показатели',
        checkup: 'Профилактические осмотры специалистов',
        feeding: 'Прикорм и рацион питания',
        npr: 'Нервно-психическое развитие',
        achievements: 'Прогресс и достижения',
        statistics: 'Сводная аналитика и графики'
    },

    init() {
        this.migrateData();
        this.loadChildInfo();
        this.setupEventListeners();
        this.setupSidebarToggle();
        this.setupThemeToggle();
        this.setDefaultTheme();
        this.setupMobileMenu();
    },

    migrateData() {
        const oldChild = localStorage.getItem('childInfo');
        if (oldChild && !localStorage.getItem('ht_profiles')) {
            const info = JSON.parse(oldChild);
            info.id = 'default_profile';
            localStorage.setItem('ht_profiles', JSON.stringify([info]));
            localStorage.setItem('ht_active_profile', 'default_profile');
            
            // Migrate existing data to prefix
            const keysToMigrate = ['vaccines', 'checkups', 'feedingDiary', 'nprProgress', 'growthMeasurements', 'calendarEvents', 'tuberculinTests', 'achievements'];
            keysToMigrate.forEach(k => {
                const val = localStorage.getItem(k);
                if (val) {
                    localStorage.setItem('default_profile_' + k, val);
                    localStorage.removeItem(k);
                }
            });
            localStorage.removeItem('childInfo');
        }
    },

    getStorageKey(key) {
        return this.childInfo ? `${this.childInfo.id}_${key}` : key;
    },

    loadModuleData() {
        Vaccines.loadVaccines();
        Tuberculin.loadTests();
        Growth.loadMeasurements();
        if (typeof Checkup !== 'undefined') Checkup.loadCheckups();
    },

    loadChildInfo() {
        const savedProfiles = localStorage.getItem('ht_profiles');
        if (savedProfiles) {
            this.profiles = JSON.parse(savedProfiles);
            const activeId = localStorage.getItem('ht_active_profile');
            this.childInfo = this.profiles.find(p => p.id === activeId) || this.profiles[0];
            if (!activeId && this.childInfo) {
                localStorage.setItem('ht_active_profile', this.childInfo.id);
            }
            this.loadModuleData();
            this.updateQuickInfo();
            this.loadLastModule();
        } else {
            this.profiles = [];
            this.showChildInfoModal();
        }
    },

    showChildInfoModal() {
        Utils.showModal('Информация о ребенке', `
            <form id="child-info-form">
                <div class="form-group">
                    <label for="child-name">Имя ребенка</label>
                    <input type="text" id="child-name" placeholder="Введите имя" required>
                </div>
                <div class="form-group">
                    <label for="child-birthdate">Дата рождения</label>
                    <input type="date" id="child-birthdate" required>
                </div>
                <div class="form-group">
                    <label for="child-gender">Пол</label>
                    <select id="child-gender" required>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;margin-top:0.5rem;">Сохранить</button>
            </form>
        `);

        document.getElementById('child-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const info = {
                name: document.getElementById('child-name').value,
                birthdate: document.getElementById('child-birthdate').value,
                gender: document.getElementById('child-gender').value
            };
            this.saveChildInfo(info);
            Utils.closeModal();
            this.loadModule('dashboard');
        });
    },

    saveChildInfo(info) {
        if (!info.id) info.id = 'prof_' + Date.now();
        
        const existingIdx = this.profiles.findIndex(p => p.id === info.id);
        if (existingIdx >= 0) {
            this.profiles[existingIdx] = info;
        } else {
            this.profiles.push(info);
        }
        
        this.childInfo = info;
        localStorage.setItem('ht_profiles', JSON.stringify(this.profiles));
        localStorage.setItem('ht_active_profile', info.id);
        
        this.updateQuickInfo();
        location.reload(); // Reload to refresh all modules with new prefix
    },

    deleteProfile(id) {
        if (!confirm('Вы уверены, что хотите удалить этот профиль и все сохраненные данные?')) return;
        
        // Remove data specific to this profile from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ht_' + id + '_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        
        // Remove from profiles list
        this.profiles = this.profiles.filter(p => p.id !== id);
        localStorage.setItem('ht_profiles', JSON.stringify(this.profiles));
        
        // Set new active profile or clear
        if (this.childInfo && this.childInfo.id === id) {
            if (this.profiles.length > 0) {
                localStorage.setItem('ht_active_profile', this.profiles[0].id);
            } else {
                localStorage.removeItem('ht_active_profile');
            }
        }
        
        location.reload();
    },

    updateQuickInfo() {
        const el = document.getElementById('child-quick-info');
        if (!el || !this.childInfo) return;
        el.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;" onclick="App.showSettingsModal()">
                <i class="fas fa-${this.childInfo.gender === 'male' ? 'mars' : 'venus'}" 
                   style="color: ${this.childInfo.gender === 'male' ? 'var(--info)' : '#ec4899'}"></i>
                <span style="font-weight:600">${this.childInfo.name}, ${Utils.calculateAge(this.childInfo.birthdate)}</span>
                <i class="fas fa-chevron-down" style="font-size:0.7em; margin-left:4px; opacity:0.7"></i>
            </div>
        `;
    },
    
    showSettingsModal() {
        let profilesHtml = this.profiles.map(p => `
            <div class="card" style="padding:1rem; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center; ${p.id === this.childInfo.id ? 'border: 2px solid var(--primary);' : ''}">
                <div>
                    <strong>${p.name}</strong><br>
                    <span style="font-size:0.8rem; color:var(--text-secondary)">${Utils.formatDateShort(p.birthdate)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    ${p.id !== this.childInfo.id ? `<button class="btn btn-sm btn-secondary" onclick="App.switchProfile('${p.id}')">Выбрать</button>` : '<span class="badge badge-primary" style="margin-right:8px;">Активен</span>'}
                    ${this.profiles.length > 1 ? `<button class="btn btn-sm btn-danger" style="background:var(--warning); border-color:var(--warning);" onclick="App.deleteProfile('${p.id}')" title="Удалить"><i class="fas fa-trash"></i></button>` : ''}
                </div>
            </div>
        `).join('');

        Utils.showModal('Настройки и Профили', `
            <div style="margin-bottom:1.5rem;">
                <h4 style="margin-bottom:1rem;">Профили детей</h4>
                ${profilesHtml}
                <button class="btn btn-secondary" style="width:100%; margin-top:0.5rem;" onclick="Utils.closeModal(); App.showChildInfoModal()"><i class="fas fa-plus"></i> Добавить ребенка</button>
            </div>
            <hr style="border:0; border-top:1px solid var(--border); margin:1.5rem 0;">
            <div>
                <h4 style="margin-bottom:1rem;">Управление данными</h4>
                <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-primary" style="flex:1" onclick="App.exportData()"><i class="fas fa-download"></i> Экспорт</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="document.getElementById('import-file').click()"><i class="fas fa-upload"></i> Импорт</button>
                    <input type="file" id="import-file" style="display:none" accept=".json" onchange="App.importData(event)">
                </div>
            </div>
        `);
    },
    
    switchProfile(id) {
        localStorage.setItem('ht_active_profile', id);
        location.reload();
    },
    
    exportData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `healthtracker_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    },
    
    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                localStorage.clear();
                for (const key in data) {
                    localStorage.setItem(key, data[key]);
                }
                alert('Данные успешно импортированы!');
                location.reload();
            } catch (err) {
                alert('Ошибка импорта данных. Проверьте файл.');
            }
        };
        reader.readAsText(file);
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.currentTarget.getAttribute('href').substring(1);
                this.loadModule(module);
                this.closeMobileMenu();
            });
        });
    },

    loadLastModule() {
        const last = localStorage.getItem('currentModule') || 'dashboard';
        this.loadModule(last);
    },

    loadModule(moduleName) {
        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[href="#${moduleName}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Update page title
        const title = activeNav ? activeNav.dataset.title : moduleName;
        document.getElementById('page-title').textContent = title;
        document.getElementById('page-subtitle').textContent = this.pageSubtitles[moduleName] || '';

        // Clear and load module
        const container = document.getElementById('main-container');
        container.style.opacity = '0';
        container.style.transform = 'translateY(8px)';

        setTimeout(() => {
            container.innerHTML = '';

            switch (moduleName) {
                case 'dashboard': Dashboard.init(container, this.childInfo); break;
                case 'calendar': Calendar.init(container, this.childInfo); break;
                case 'vaccines': Vaccines.init(container, this.childInfo); break;
                case 'tuberculin': Tuberculin.init(container, this.childInfo); break;
                case 'growth': Growth.init(container, this.childInfo); break;
                case 'checkup': if (typeof Checkup !== 'undefined') Checkup.init(container, this.childInfo); break;
                case 'feeding': if (typeof Feeding !== 'undefined') Feeding.init(container, this.childInfo); break;
                case 'teeth': if (typeof Teeth !== 'undefined') Teeth.init(container, this.childInfo); break;
                case 'npr': if (typeof NPR !== 'undefined') NPR.init(container, this.childInfo); break;
                case 'achievements': if (typeof Achievements !== 'undefined') Achievements.init(container, this.childInfo); break;
                case 'statistics': if (typeof Statistics !== 'undefined') Statistics.init(container, this.childInfo); break;
                case 'authors': if (typeof Authors !== 'undefined') Authors.init(container); break;
                default: Dashboard.init(container, this.childInfo); break;
            }

            requestAnimationFrame(() => {
                container.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            });
        }, 80);

        localStorage.setItem('currentModule', moduleName);
        this.currentModule = moduleName;
    },

    setupSidebarToggle() {
        const toggleBtn = document.getElementById('sidebar-toggle');
        const savedState = localStorage.getItem('sidebarCollapsed');
        
        if (savedState === 'true') {
            document.body.classList.add('sidebar-collapsed');
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
                const isCollapsed = document.body.classList.contains('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            });
        }
    },

    setupMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        if (!toggle) return;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebar-overlay';
        document.body.appendChild(overlay);

        toggle.addEventListener('click', () => this.toggleMobileMenu());
        overlay.addEventListener('click', () => this.closeMobileMenu());
    },

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    },

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    },

    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            this.updateThemeIcon(toggle);
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    },

    setDefaultTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.body.classList.add('dark-theme');
        }
        this.updateThemeIcon(document.getElementById('theme-toggle'));
    },

    updateThemeIcon(toggle) {
        if (!toggle) return;
        const icon = toggle.querySelector('i');
        const text = toggle.querySelector('.toggle-text');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Светлая тема';
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Темная тема';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());