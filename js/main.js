// Shared behavior: runs on every page.
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav a').forEach(link => { if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page'); });
