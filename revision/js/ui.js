export function setStatus(el, text, colourClass) {
  el.textContent = text;
  el.classList.remove('status-green', 'status-amber', 'status-red');
  if (colourClass) el.classList.add(colourClass);
}

export function renderTable(data, config, saveData, updateTotals) {
  const { tbody, start, end, subjects, days, weekend } = config;

  tbody.innerHTML = '';

  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const key = d.toISOString().slice(0,10);
    const dow = d.getDay();
    const isWE = weekend.includes(dow);

    const tr = document.createElement('tr');
    if (isWE) tr.className = 'weekend';

    const dateTd = document.createElement('td');
    dateTd.className = 'date-cell';
    dateTd.innerHTML = `${days[dow]} ${d.getDate()} Apr<span>${isWE ? 'Weekend' : ''}</span>`;
    tr.appendChild(dateTd);

    subjects.forEach(s => {
      const td = document.createElement('td');
      const inp = document.createElement('input');

      inp.type = 'number';
      inp.step = 0.5;
      inp.value = data[key]?.[s] || '';

      inp.addEventListener('input', () => {
        if (!data[key]) data[key] = {};
        data[key][s] = inp.value;
        updateTotals(data, config);
        saveData();
      });

      td.appendChild(inp);
      tr.appendChild(td);
    });

    const totalTd = document.createElement('td');
    totalTd.id = 'row-' + key;
    tr.appendChild(totalTd);

    tbody.appendChild(tr);
  }
}

export function updateTotals(data, config) {
  const { subjects, start, end } = config;

  let grandTotal = 0;
  const subTotals = Object.fromEntries(subjects.map(s => [s, 0]));

  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const key = d.toISOString().slice(0,10);
    let rowTotal = 0;

    subjects.forEach(s => {
      const v = parseFloat(data[key]?.[s]) || 0;
      subTotals[s] += v;
      rowTotal += v;
      grandTotal += v;
    });

    const cell = document.getElementById('row-' + key);
    if (cell) cell.textContent = rowTotal > 0 ? rowTotal.toFixed(1) : '—';
  }

  document.getElementById('s-total').textContent = grandTotal.toFixed(1);
  subjects.forEach(s => {
    document.getElementById('s-' + s).textContent = subTotals[s].toFixed(1);
  });
}