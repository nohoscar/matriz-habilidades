// script.js

let empleados = [];

function getSkillClass(nivel) {
  switch ((nivel || '').toLowerCase()) {
    case "alto": return "skill-high futuristic-glow";
    case "medio": return "skill-medium futuristic-glow";
    case "bajo": return "skill-low futuristic-glow";
    default: return "";
  }
}

function renderTabla() {
  const filtroNombre = document.getElementById("filtroEmpleado").value.toLowerCase();
  const filtroHab = document.getElementById("filtroHabilidad").value;
  const tbody = document.getElementById("skillTable");
  const cards = document.getElementById("cardsContainer");
  tbody.innerHTML = "";
  cards.innerHTML = "";

  empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(filtroNombre)
  ).forEach(emp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.nombre}</td>
      <td class="${getSkillClass(emp.picking)}">${emp.picking}</td>
      <td class="${getSkillClass(emp.empaque)}">${emp.empaque}</td>
      <td class="${getSkillClass(emp.montacargas)}">${emp.montacargas}</td>
      <td class="${getSkillClass(emp.cincoS)}">${emp.cincoS}</td>
    `;
    tbody.appendChild(tr);

    const habs = {
      picking: emp.picking,
      empaque: emp.empaque,
      montacargas: emp.montacargas,
      cincoS: emp.cincoS
    };

    const filtered = filtroHab && filtroHab in habs ? { [filtroHab]: habs[filtroHab] } : habs;

    const liHabilidades = Object.entries(filtered)
      .map(([k, v]) => `<li class="${getSkillClass(v)}">${k}: ${v}</li>`)
      .join("");

    const card = document.createElement("div");
    card.className = "card futuristic-card";
    card.innerHTML = `
      <h3>${emp.nombre}</h3>
      <ul>${liHabilidades}</ul>
    `;
    cards.appendChild(card);
  });
}

document.getElementById("filtroEmpleado").addEventListener("input", renderTabla);
document.getElementById("filtroHabilidad").addEventListener("change", renderTabla);
document.getElementById("inputExcel").addEventListener("change", leerExcel);

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.createElement("button");
  toggle.textContent = "🌙 Modo Oscuro";
  toggle.className = "modo-toggle futuristic-button";
  toggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
  };
  document.querySelector(".container").prepend(toggle);
});

function leerExcel(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(hoja, { defval: "" });

    empleados = json.map(row => ({
      nombre:row.Empleado || "",
      Rate:row.Rate || "",
      FSAF:row.FSAF || "",
      Cantidad:row.Cantidad || "",
      Horas: row["5S"] || ""
    }));

    renderTabla();
  };

  reader.readAsArrayBuffer(archivo);
}
