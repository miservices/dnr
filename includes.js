/* =========================================================
   Michigan DNR — includes.js
   Loads header.html / footer.html into the page, then wires
   up sticky stacking (banner -> header) and the mobile nav.
   ========================================================= */

async function includeHTML(selector, url) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    target.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    target.innerHTML = `<p style="padding:16px;font-family:monospace;">Could not load ${url}. If you're opening this file directly (file://), run it through a local server instead.</p>`;
  }
}

function stackStickyLayers() {
  const banner = document.querySelector('.sim-banner');
  const header = document.getElementById('site-header');
  if (!banner || !header) return;
  const setOffset = () => {
    header.style.top = `${banner.offsetHeight}px`;
  };
  setOffset();
  window.addEventListener('resize', setOffset);
}

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.has-dropdown.open').forEach(li => {
    li.classList.remove('open');
    const btn = li.querySelector('.dropdown-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

function wireDropdowns(nav) {
  nav.querySelectorAll('.has-dropdown').forEach(li => {
    const toggleBtn = li.querySelector('.dropdown-toggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = li.classList.contains('open');
      closeAllDropdowns(nav);
      if (!isOpen) {
        li.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllDropdowns(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns(nav);
  });
}

function wireMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (!isOpen) closeAllDropdowns(nav);
  });
  // Only top-level links and submenu links close the mobile nav;
  // dropdown-toggle buttons are handled separately in wireDropdowns.
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      closeAllDropdowns(nav);
    });
  });
  wireDropdowns(nav);
}

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    includeHTML('#header-include', 'header.html'),
    includeHTML('#footer-include', 'footer.html'),
  ]);
  stackStickyLayers();
  wireMobileNav();
  setFooterYear();
});