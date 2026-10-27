const menu = document.querySelector('.mobile-nav');
menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => { menu.open = false; });
});
document.querySelector('#year').textContent = new Date().getFullYear();
