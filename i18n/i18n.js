(() => {
  const STORAGE_KEY = 'lang';
  const PROMPT_DISMISSED_KEY = 'langPromptDismissed';
  const dictCache = {};
  let currentLang = 'en';
  let currentDict = {};

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
  }

  async function loadDict(lang) {
    if (dictCache[lang]) return dictCache[lang];
    try {
      const res = await fetch(`i18n/${lang}.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load dictionary');
      const json = await res.json();
      dictCache[lang] = json;
      return json;
    } catch (e) {
      console.warn('i18n: could not load', lang, e);
      return {};
    }
  }

  function translateInPlace(dict) {
    const elements = document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-aria-label], [data-i18n-title]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const val = get(dict, key);
        if (val != null) el.textContent = val;
      }
      const htmlKey = el.getAttribute('data-i18n-html');
      if (htmlKey) {
        const val = get(dict, htmlKey);
        if (val != null) el.innerHTML = val;
      }
      const ariaLabelKey = el.getAttribute('data-i18n-aria-label');
      if (ariaLabelKey) {
        const val = get(dict, ariaLabelKey);
        if (val != null) el.setAttribute('aria-label', val);
      }
      const titleKey = el.getAttribute('data-i18n-title');
      if (titleKey) {
        const val = get(dict, titleKey);
        if (val != null) el.setAttribute('title', val);
      }
    });
  }

  async function applyLanguage(lang) {
    const dict = await loadDict(lang);
    currentLang = lang;
    currentDict = dict;
    document.documentElement.setAttribute('lang', lang);
    translateInPlace(dict);
    updateLangSwitchUI(lang);
    updateLangFabUI(lang, dict);
  }

  function setLanguage(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    return applyLanguage(lang);
  }

  function updateLangSwitchUI(lang) {
    document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateLangFabUI(lang, dict) {
    const fab = document.getElementById('lang-fab');
    if (!fab) return;
    fab.textContent = (lang || '').toUpperCase();
    const label = get(dict || {}, 'langswitch.label') || 'Language';
    fab.setAttribute('aria-label', label);
    fab.setAttribute('title', label);
  }

  function shouldSuggestSpanish() {
    const saved = (localStorage.getItem(STORAGE_KEY) || 'en').toLowerCase();
    const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === '1';
    const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return saved !== 'es' && nav.startsWith('es') && !dismissed;
  }

  async function showLangToast() {
    const es = await loadDict('es');
    const ask = get(es, 'toast.ask_es') || '¿Ver esta página en Español?';
    const yes = get(es, 'toast.yes') || 'Sí';
    const no = get(es, 'toast.no') || 'No, gracias';

    const toast = document.createElement('div');
    toast.className = 'lang-toast';
    toast.setAttribute('role', 'dialog');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="lang-toast__msg">${ask}</div>
      <div class="lang-toast__actions">
        <button class="lang-toast__btn lang-toast__btn--primary" type="button">${yes}</button>
        <button class="lang-toast__btn" type="button">${no}</button>
      </div>
    `;
    document.body.appendChild(toast);
    const [primaryBtn, secondaryBtn] = toast.querySelectorAll('.lang-toast__btn');
    if (primaryBtn) primaryBtn.addEventListener('click', async () => {
      await setLanguage('es');
      dismissToast();
    });
    if (secondaryBtn) secondaryBtn.addEventListener('click', dismissToast);

    function dismissToast() {
      try { localStorage.setItem(PROMPT_DISMISSED_KEY, '1'); } catch (e) {}
      toast.classList.add('is-hiding');
      setTimeout(() => toast.remove(), 250);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const saved = localStorage.getItem(STORAGE_KEY) || 'en';
    await applyLanguage(saved);
    // Wire header language switcher buttons (if present)
    document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang) setLanguage(lang);
      });
    });
    // Wire floating language FAB
    const fab = document.getElementById('lang-fab');
    if (fab) {
      fab.addEventListener('click', () => {
        const next = (currentLang === 'en') ? 'es' : 'en';
        setLanguage(next);
      });
    }
    if (shouldSuggestSpanish()) showLangToast();
  });

  // Expose minimal API for manual control (optional)
  window.i18n = {
    setLanguage,
    getLanguage: () => localStorage.getItem(STORAGE_KEY) || 'en'
  };
})();
