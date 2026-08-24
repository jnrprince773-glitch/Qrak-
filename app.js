const themeBtn = document.getElementById('themeBtn');
const navLinks = [...document.querySelectorAll('.nav a')];

// Small, dependency-free interaction layer. QRAK-specific state can be added here.
themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
  const enabled = document.body.classList.contains('high-contrast');
  themeBtn.textContent = enabled ? '◑' : '◐';
  themeBtn.setAttribute('aria-pressed', String(enabled));
});

const sections = [...document.querySelectorAll('main section[id]')];
const setActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.3;
  let current = sections[0]?.id;
  for (const section of sections) {
    if (marker >= section.offsetTop) current = section.id;
  }
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();
