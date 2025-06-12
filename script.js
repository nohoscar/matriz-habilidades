let empleados = [
  { nombre: "Juan Pérez", picking: 2, empaque: 3, montacargas: 1, cincoS: 3 },
  { nombre: "Ana López", picking: 3, empaque: 2, montacargas: 2, cincoS: 1 },
  { nombre: "Carlos Méndez", picking: 1, empaque: 1, montacargas: 3, cincoS: 2 },
];

const tabla = document.getElementById("skillTable");

function getSkillClass(n) {
  if (n === 1) return 'skill-low';
  if (n === 2) return 'skill-medium';
  if (n === 3) return 'skill-high';
}

function renderTabla() {
  tabla.innerHTML = "";
  const filtroNombre = document.getElementById("filtroEmpleado").value.toLowerCase();
  const filtroHab = document.getElementById("filtroHabilidad").value;

  empleados.forEach(emp => {
    if (!emp.nombre.toLowerCase().includes(filtroNombre)) return;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${emp.nombre}</td>
      ${['picking', 'empaque', 'montacargas', 'cincoS'].map(hab => {
        if (filtroHab && filtroHab !== hab) return '<td></td>';
        const nivel = emp[hab];
        return return `<td class="${getSkillClass(nivel)}">${nivel}</td>`;

      }).join("")}
    `;
    tabla.appendChild(fila);
  });
}

function actualizarNivel(nombre, habilidad, nuevoValor) {
  const nivel = parseInt(nuevoValor);
  if (![1,2,3].includes(nivel)) {
    alert("Solo se permiten valores 1, 2 o 3");
    renderTabla();
    return;
  }

  const emp = empleados.find(e => e.nombre === nombre);
  emp[habilidad] = nivel;
  renderTabla();
}

function exportarExcel() {
  const hoja = empleados.map(e => ({
    Empleado: e.nombre,
    Picking: e.picking,
    Empaque: e.empaque,
    Montacargas: e.montacargas,
    '5S': e.cincoS
  }));

  const ws = XLSX.utils.json_to_sheet(hoja);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Matriz");
  XLSX.writeFile(wb, "matriz_habilidades.xlsx");
}

function toggleModoOscuro() {
  document.body.classList.toggle("dark-mode");
}

document.getElementById("filtroEmpleado").addEventListener("input", renderTabla);
document.getElementById("filtroHabilidad").addEventListener("change", renderTabla);

renderTabla();
function renderTabla() {
  const filtroNombre = document.getElementById("filtroEmpleado").value.toLowerCase();
  const filtroHab = document.getElementById("filtroHabilidad").value;

  // Vista de escritorio (tabla)
  tabla.innerHTML = "";
  empleados.forEach(emp => {
    if (!emp.nombre.toLowerCase().includes(filtroNombre)) return;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${emp.nombre}</td>
      ${['picking', 'empaque', 'montacargas', 'cincoS'].map(hab => {
        if (filtroHab && filtroHab !== hab) return '<td></td>';
        const nivel = emp[hab];
        return `<td contenteditable onblur="actualizarNivel('${emp.nombre}', '${hab}', this.innerText.trim())" class="${getSkillClass(nivel)}">${nivel}</td>`;
      }).join("")}
    `;
    tabla.appendChild(fila);
  });

  // Vista móvil (tarjetas)
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = "";
  empleados.forEach(emp => {
    if (!emp.nombre.toLowerCase().includes(filtroNombre)) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${emp.nombre}</h3>
      <ul>
        ${['picking', 'empaque', 'montacargas', 'cincoS'].map(hab => {
          if (filtroHab && filtroHab !== hab) return '';
          const nivel = emp[hab];
          const habNombre = hab === "cincoS" ? "5S" : hab.charAt(0).toUpperCase() + hab.slice(1);
          return `<li class="${getSkillClass(nivel)}">${habNombre}: ${nivel}</li>`;
        }).join("")}
      </ul>
    `;
    cardsContainer.appendChild(card);
  });
}
