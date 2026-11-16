const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach((filter) => filter.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('is-active'));
  filter.classList.add('is-active');
  filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
  const selected = filter.dataset.filter;
  cards.forEach((card) => {
    const shouldHide = selected !== 'all' && card.dataset.category !== selected;
    card.classList.toggle('hidden', shouldHide);
    if (!shouldHide && !reducedMotion && typeof card.animate === 'function') {
      card.animate(
        [
          { opacity: 0, transform: 'translateY(14px) scale(.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
    }
  });
}));
document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const progressBar = document.querySelector('.scroll-progress span');
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-enabled');

  const revealItems = document.querySelectorAll(
    '.section-heading, .profile > *, .education-card, .learning-card, .project-card, .case-intro, .process > *, .metric-grid > *, .skills-grid > *, .contact > *',
  );

  revealItems.forEach((item, index) => {
    item.classList.add('reveal-pending');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const headerLinks = document.querySelectorAll('.site-header nav a');
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      headerLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55%' },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  if (window.matchMedia('(pointer: fine)').matches) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 2.6).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 2.6).toFixed(2)}deg`);
        card.style.setProperty('--glow-x', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--glow-y', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
        card.style.removeProperty('--glow-x');
        card.style.removeProperty('--glow-y');
      });
    });
  }
}
