// js/utils.js

const Utils = {
    formatDate(dateInput) {
        if (!dateInput) return '';
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (isNaN(date.getTime())) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    },

    formatDateShort(dateInput) {
        if (!dateInput) return '';
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    showModal(title, content) {
        const existingModal = document.querySelector('.modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" aria-label="Закрыть">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => modal.classList.add('show'));
        });

        const closeHandler = () => this.closeModal();
        modal.querySelector('.modal-close').addEventListener('click', closeHandler);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeHandler();
        });

        // Close on Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeHandler();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    },

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => {
            n.classList.remove('show');
            setTimeout(() => n.remove(), 300);
        });

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Закрыть">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => notification.classList.add('show'));
        });

        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.closeNotification(notification);
        });

        setTimeout(() => this.closeNotification(notification), 4000);
    },

    closeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    },

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    pluralize(n, one, few, many) {
        let abs = Math.abs(n) % 100;
        if (abs >= 5 && abs <= 20) return many;
        abs %= 10;
        if (abs === 1) return one;
        if (abs >= 2 && abs <= 4) return few;
        return many;
    },

    calculateAge(birthdate) {
        const birth = new Date(birthdate);
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        const parts = [];
        if (years > 0) parts.push(`${years} ${this.pluralize(years, 'год', 'года', 'лет')}`);
        if (months > 0) parts.push(`${months} ${this.pluralize(months, 'месяц', 'месяца', 'месяцев')}`);
        if (years === 0) parts.push(`${days} ${this.pluralize(days, 'день', 'дня', 'дней')}`);
        return parts.join(' ') || '0 дней';
    },

    calculateAgeInMonths(birthdate, targetDate) {
        const birth = new Date(birthdate);
        const target = targetDate ? new Date(targetDate) : new Date();
        let months = (target.getFullYear() - birth.getFullYear()) * 12;
        months += target.getMonth() - birth.getMonth();
        if (target.getDate() < birth.getDate()) months--;
        return Math.max(0, months);
    },

    daysFromBirth(birthdate, targetDate) {
        const birth = new Date(birthdate);
        const target = new Date(targetDate);
        return Math.round((target - birth) / (1000 * 60 * 60 * 24));
    },

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    dateToISO(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },

    animateElements(container, selector = '.animate-in') {
        const elements = container.querySelectorAll(selector);
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.animationDelay = `${i * 0.06}s`;
            el.classList.add('animate-in');
        });
    }
};