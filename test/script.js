const buttons = document.querySelectorAll('.filters button');
const rows = document.querySelectorAll('#projects .rows li');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.toggle('on', b === btn));
    rows.forEach(row => {
      row.hidden = btn.dataset.f !== 'all' && row.dataset.c !== btn.dataset.f;
    });
  });
});