// ============================================
// i18n 多语言支持模块
// ============================================

const I18N = {
    currentLang: localStorage.getItem('wc-lang') || 'zh-CN',
    translations: {},

    async init() {
        await this.loadLang(this.currentLang);
        this.apply();
        this.renderSwitcher();
    },

    async loadLang(lang) {
        try {
            const response = await fetch(`lang/${lang}.json?t=${Date.now()}`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations = await response.json();
            this.currentLang = lang;
            localStorage.setItem('wc-lang', lang);
        } catch (e) {
            console.warn('i18n load failed:', e);
            // 回退到空对象，保持原有文本
            this.translations = {};
        }
    },

    t(key) {
        const keys = key.split('.');
        let value = this.translations;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // 回退显示 key
            }
        }
        return value;
    },

    apply() {
        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (text !== key) {
                el.textContent = text;
            }
        });

        // 更新所有带有 data-i18n-placeholder 属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = this.t(key);
            if (text !== key) {
                el.placeholder = text;
            }
        });

        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang === 'zh-CN' ? 'zh-CN' : 'en';

        // 更新语言切换按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    },

    async switchLang(lang) {
        if (lang === this.currentLang) return;
        await this.loadLang(lang);
        this.apply();
        // 触发语言切换事件，让 app.js 重新渲染动态内容
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    },

    renderSwitcher() {
        const container = document.getElementById('langSwitcher');
        if (!container) return;

        container.innerHTML = `
            <div class="lang-switcher">
                <span class="lang-label">${this.t('language.switch')}</span>
                <button class="lang-btn ${this.currentLang === 'zh-CN' ? 'active' : ''}" data-lang="zh-CN" onclick="I18N.switchLang('zh-CN')">${this.t('language.zh')}</button>
                <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="I18N.switchLang('en')">${this.t('language.en')}</button>
            </div>
        `;
    }
};
