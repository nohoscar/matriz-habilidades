const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1m9YlvgsH3_X8zMWW5LUhY6m825HLY1nE/export?format=csv';
let empleados = [];

// Cargar datos desde Google Sheets (CSV)
async function cargarDesdeGoogle() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').map(r => r.split(','));
    const headers = rows.shift();

    empleados = rows.map(cols => {
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = cols[i]?.trim());
      return {
        nombre: obj['Nombre'] || '',
        rate: obj['Rate'] || '',
        fsaf: obj['Fsaf'] || '',
        cantidad: obj['Cantidad'] || '',
        horas: obj['Horas'] || ''
        DPMO: obj['DPMO'] || ''
      };
    });

    renderVista();
  } catch (err) {
    console.error('Error al cargar CSV:', err);
  }
}

// Renderiza la tabla o tarjetas dependiendo del ancho de pantalla
function renderVista() {
  const isMobile = window.innerWidth <= 768;
  document.getElementById('vistaEscritorio').style.display = isMobile ? 'none' : 'block';
  document.getElementById('vistaMovil').style.display = isMobile ? 'block' : 'none';

  const filtroEmpleado = document.getElementById('filtroEmpleado').value.toLowerCase();
  const filtroHabilidad = document.getElementById('filtroHabilidad').value;

  const filtrados = empleados.filter(emp => {
    const matchNombre = emp.nombre.toLowerCase().includes(filtroEmpleado);
    const matchHabilidad = filtroHabilidad === '' || emp[filtroHabilidad.toLowerCase()] !== '';
    return matchNombre && matchHabilidad;
  });

  if (isMobile) {
    renderTarjetas(filtrados);
  } else {
    renderTabla(filtrados);
  }
}

// Mostrar en formato de tabla
function renderTabla(data) {
  const tbody = document.getElementById('skillTable');
  tbody.innerHTML = '';

  data.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${emp.nombre}</td>
      <td>${emp.rate}</td>
      <td>${emp.fsaf}</td>
      <td>${emp.cantidad}</td>
      <td>${emp.horas}</td>
      <td>${emp.DPMO}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Mostrar en formato de tarjetas
function renderTarjetas(data) {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  data.forEach(emp => {
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

// Alternar tema oscuro
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

// Eventos
document.getElementById('descargarDatos').addEventListener('click', cargarDesdeGoogle);
document.getElementById('filtroEmpleado').addEventListener('input', renderVista);
document.getElementById('filtroHabilidad').addEventListener('change', renderVista);
window.addEventListener('resize', renderVista);

