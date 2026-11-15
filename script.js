const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach((filter) => filter.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('is-active'));
  filter.classList.add('is-active');
  filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
  const selected = filter.dataset.filter;
  cards.forEach((card) => card.classList.toggle('hidden', selected !== 'all' && card.dataset.category !== selected));
}));
document.getElementById('year').textContent = new Date().getFullYear();
