(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try {
    const saved = window.localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* Storage can be unavailable in private or restricted browsers. */ }

  function applyTheme() {
    const theme = preference ?? (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  applyTheme();
  system.addEventListener('change', () => {
    if (preference === null) applyTheme();
  });

  function bindToggle() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    applyTheme();
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      try { window.localStorage.setItem('portfolio-theme', preference); }
      catch { /* The toggle still works when the preference cannot be saved. */ }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindToggle, { once: true });
  else bindToggle();
})();
