
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1m9YlvgsH3_X8zMWW5LUhY6m825HLY1nE/export?format=csv';

let empleados = [];

async function cargarDesdeGoogle() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').map(l => l.split(','));
    const headers = rows.shift();

    empleados = rows.map(cols => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = cols[i]?.trim();
      });
      return {
        nombre: obj['Nombre'] || '',
        rate: obj['Rate'] || '',
        fsaf: obj['Fsaf'] || '',
        cantidad: obj['Cantidad'] || '',
        horas: obj['Horas'] || ''
      };
    });
    renderCards();
  } catch (e) {
    console.error('Error al leer Google Sheet:', e);
  }
}

function renderCards() {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  empleados.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'futuristic-card fade-in';
    card.innerHTML = `
      <h2>${emp.nombre}</h2>
      <ul>
        <li><strong>Rate:</strong> ${emp.rate}</li>
        <li><strong>Fsaf:</strong> ${emp.fsaf}</li>
        <li><strong>Cantidad:</strong> ${emp.cantidad}</li>
        <li><strong>Horas:</strong> ${emp.horas}</li>
      </ul>
    `;
    container.appendChild(card);
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', cargarDesdeGoogle);
