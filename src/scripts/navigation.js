(() => {
  const header = document.querySelector('.site-header');
  const button = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-navigation');
  if (!header || !button || !nav) return;
  const mobile = window.matchMedia('(max-width: 700px)');

  function setOpen(open, restoreFocus = false) {
    const expanded = mobile.matches && open;
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    button.hidden = !mobile.matches;
    nav.hidden = mobile.matches && !expanded;
    if (restoreFocus) button.focus();
  }

  setOpen(false);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false, mobile.matches);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false, mobile.matches && nav.contains(document.activeElement));
  });
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusInNav = nav.contains(document.activeElement);
    const focusOnButton = document.activeElement === button;
    setOpen(false);
    if (mobile.matches && focusInNav) button.focus();
    else if (!mobile.matches && focusOnButton) nav.querySelector('a')?.focus();
  });
})();
