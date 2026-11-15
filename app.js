const repo = 'https://github.com/alejandrobarco01-coder/taller-patrones-de-dise-o';
const patterns = [
  { id: 1, name: 'Builder', family: 'creacional', label: 'Creacional', icon: '▤', tags: ['Construcción', 'Opciones'], summary: 'Construye una orden compleja paso a paso y valida que tenga al menos un servicio.', context: 'Orden de mantenimiento de vehículo: combina servicios opcionales y una solicitud de vehículo sustituto sin llenar el constructor de parámetros.', file: '01_builder.ts' },
  { id: 2, name: 'Factory Method', family: 'creacional', label: 'Creacional', icon: '⚒', tags: ['Creación', 'Formatos'], summary: 'Delega en creadores concretos la selección del exportador adecuado.', context: 'Reportes de ventas que pueden generarse en CSV o JSON. El flujo es común, pero el producto concreto depende del creador.', file: '02_factory_method.ts' },
  { id: 3, name: 'Singleton', family: 'creacional', label: 'Creacional', icon: '◎', tags: ['Instancia única', 'Registro'], summary: 'Mantiene una sola instancia para compartir un registro de eventos entre módulos.', context: 'Dos módulos escriben en el mismo registro y consultan un historial común.', file: '03_singleton.ts' },
  { id: 4, name: 'Adapter', family: 'estructural', label: 'Estructural', icon: '⇄', tags: ['Compatibilidad', 'Integración'], summary: 'Traduce una interfaz existente al formato que espera el cliente.', context: 'Un GPS legado entrega latitud y longitud; el mapa necesita un proveedor que devuelva una ubicación compatible.', file: '04_adapter.ts' },
  { id: 5, name: 'Decorator', family: 'estructural', label: 'Estructural', icon: '◌', tags: ['Composición', 'Extensión'], summary: 'Añade responsabilidades y costo envolviendo un objeto con decoradores.', context: 'Agrega leche y jarabe a un café sin crear una clase distinta para cada combinación.', file: '05_decorator.ts' },
  { id: 6, name: 'Flyweight', family: 'estructural', label: 'Estructural', icon: '⠿', tags: ['Memoria', 'Compartir'], summary: 'Reutiliza el estado compartido entre muchos objetos para ahorrar memoria.', context: 'Miles de alertas viales comparten tipo, icono y severidad; cada reporte conserva su ubicación y hora.', file: '06_flyweight.ts' },
  { id: 7, name: 'Observer', family: 'comportamiento', label: 'Comportamiento', icon: '◉', tags: ['Notificaciones', 'Suscriptores'], summary: 'Notifica a varios observadores cuando cambia el estado de un objeto.', context: 'Un monitor de signos vitales actualiza el panel de enfermería, la alarma y el historial clínico.', file: '07_observer.ts' },
  { id: 8, name: 'Strategy', family: 'comportamiento', label: 'Comportamiento', icon: '⤳', tags: ['Algoritmos', 'Intercambiable'], summary: 'Permite cambiar el algoritmo de cálculo sin modificar al cliente que lo usa.', context: 'Un cotizador compara envíos terrestres, express e internacionales con tarifas y tiempos distintos.', file: '08_strategy.ts' },
  { id: 9, name: 'Command', family: 'comportamiento', label: 'Comportamiento', icon: '⌘', tags: ['Operaciones', 'Deshacer'], summary: 'Empaqueta operaciones como objetos para ejecutarlas, auditarlas y revertirlas.', context: 'Un gestor procesa depósitos, retiros y transferencias bancarias con soporte para deshacer.', file: '09_command.ts' },
  { id: 10, name: 'State', family: 'comportamiento', label: 'Comportamiento', icon: '◷', tags: ['Transiciones', 'Reglas'], summary: 'Cambia las acciones permitidas según el estado interno del objeto.', context: 'Una solicitud de crédito pasa por borrador, revisión, aprobación y desembolso con reglas por etapa.', file: '10_state.ts' },
];

const grid = document.querySelector('#pattern-grid');
const noResults = document.querySelector('#no-results');
const search = document.querySelector('#search');
const dialog = document.querySelector('#demo-dialog');
const content = document.querySelector('#demo-content');
let activeFilter = 'todos';
let flyweightReports = 8;
let singletonLog = ['Módulo de pagos inició sesión.', 'Notificaciones conectadas al registro compartido.'];

function renderCards() {
  const query = search.value.trim().toLowerCase();
  const visible = patterns.filter((item) => (activeFilter === 'todos' || item.family === activeFilter) && `${item.name} ${item.summary} ${item.context}`.toLowerCase().includes(query));
  grid.innerHTML = visible.map((item) => `<article class="pattern-card">
    <div class="card-top"><span class="card-number">PATTERN / ${String(item.id).padStart(2, '0')}</span><span class="card-type ${item.family}">${item.label}</span></div>
    <div class="card-main"><span class="pattern-icon" aria-hidden="true">${item.icon}</span><div><h3>${item.name}</h3><p>${item.summary}</p></div></div>
    <div class="card-footer"><div class="card-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join('')}</div><button class="demo-button" data-demo="${item.id}">Probar demo ↗</button></div>
  </article>`).join('');
  noResults.hidden = visible.length > 0;
}

function openDemo(id) {
  const item = patterns.find((pattern) => pattern.id === Number(id));
  if (!item) return;
  document.querySelector('#dialog-number').textContent = String(item.id).padStart(2, '0');
  document.querySelector('#dialog-category').textContent = `DEMO INTERACTIVA / ${item.label.toUpperCase()}`;
  document.querySelector('#dialog-title').textContent = item.name;
  document.querySelector('#dialog-subtitle').textContent = item.summary;
  document.querySelector('#dialog-description').textContent = item.context;
  document.querySelector('#source-link').href = `${repo}/blob/main/${item.file}`;
  content.innerHTML = demos[item.id]();
  dialog.showModal();
  bindDemo(item.id);
}

const demos = {
  1: () => `<div class="demo-grid"><div class="demo-field"><label for="plate">PLACA DEL VEHÍCULO</label><input id="plate" value="ABC-123" maxlength="8" /></div><div class="demo-field"><label for="service-level">TALLER</label><select id="service-level"><option>Mantenimiento general</option><option>Servicio especializado</option></select></div></div>
    <div class="demo-label">SERVICIOS OPCIONALES</div><div class="demo-checks"><label><input type="checkbox" name="service" value="Cambio de aceite" checked /> Cambio de aceite</label><label><input type="checkbox" name="service" value="Revisión de frenos" /> Revisión de frenos</label><label><input type="checkbox" name="service" value="Alineación" /> Alineación</label><label><input type="checkbox" id="loaner" /> Vehículo sustituto</label></div><button class="demo-action" id="build-order">Construir orden</button><div class="demo-output" id="builder-output">Selecciona las opciones y construye la orden.</div>`,
  2: () => `<div class="demo-grid"><div class="demo-field"><label for="report-format">FORMATO DE EXPORTACIÓN</label><select id="report-format"><option value="csv">CSV</option><option value="json">JSON</option></select></div><div class="demo-field"><label for="report-period">PERÍODO</label><select id="report-period"><option>Octubre 2026</option><option>Septiembre 2026</option><option>Agosto 2026</option></select></div></div><div class="demo-actions"><button class="demo-action" id="generate-report">Generar reporte</button><button class="demo-action secondary" id="download-report">Descargar archivo</button></div><div class="demo-output" id="factory-output">ventas\nV-001,150000\nV-002,89000</div><p class="demo-note">El generador define el flujo; cada creador escoge el exportador concreto.</p>`,
  3: () => `<div class="metric-row"><div class="metric"><strong id="log-count">${singletonLog.length}</strong><small>eventos compartidos</small></div><div class="metric"><strong>1</strong><small>instancia del registro</small></div><div class="metric"><strong>2</strong><small>módulos conectados</small></div></div><div class="demo-actions"><button class="demo-action" data-log="Nuevo pago procesado.">Registrar pago</button><button class="demo-action secondary" data-log="Correo de confirmación enviado.">Registrar notificación</button><button class="demo-action secondary" id="clear-log">Limpiar</button></div><div class="log-list" id="singleton-log"></div><p class="demo-note">Ambos módulos escriben en el mismo objeto registro, no en historiales separados.</p>`,
  4: () => `<div class="demo-grid"><div class="demo-field"><label for="latitude">LATITUD DEL GPS</label><input id="latitude" type="number" step="0.0001" value="3.9009" /></div><div class="demo-field"><label for="longitude">LONGITUD DEL GPS</label><input id="longitude" type="number" step="0.0001" value="-76.2978" /></div></div><div class="demo-actions"><button class="demo-action" id="adapt-location">Adaptar ubicación</button></div><div class="demo-output" id="adapter-output">El GPS legado entrega coordenadas; el mapa aún espera su proveedor compatible.</div><p class="demo-note">El Adapter convierte la interfaz en el punto de integración y deja intacto el GPS original.</p>`,
  5: () => `<div class="demo-label">PERSONALIZA TU PEDIDO</div><div class="demo-checks"><label><input type="checkbox" id="milk" /> Leche <span>+$800</span></label><label><input type="checkbox" id="syrup" /> Jarabe <span>+$500</span></label></div><div class="metric-row"><div class="metric"><strong id="drink-total">$3.000</strong><small>precio total</small></div><div class="metric"><strong id="drink-name">Café</strong><small>bebida decorada</small></div><div class="metric"><strong id="decorator-count">0</strong><small>decoradores</small></div></div><p class="demo-note">Cada ingrediente envuelve la bebida y agrega descripción y costo sin alterar el objeto base.</p>`,
  6: () => `<div class="metric-row"><div class="metric"><strong id="report-count">${flyweightReports}</strong><small>alertas viales</small></div><div class="metric"><strong id="type-count">3</strong><small>tipos compartidos</small></div><div class="metric"><strong id="saved-count">5</strong><small>objetos pesados evitados</small></div></div><div class="demo-actions"><button class="demo-action" id="add-alerts">Simular 500 alertas</button><button class="demo-action secondary" id="reset-alerts">Reiniciar</button></div><div class="log-list"><div class="log-item">💥 Accidente · severidad alta · tipo compartido</div><div class="log-item">🕳 Bache · severidad media · tipo compartido</div><div class="log-item">📷 Fotomulta · severidad baja · tipo compartido</div></div><p class="demo-note">La ubicación y hora son únicas para cada reporte; tipo, icono y severidad se reutilizan.</p>`,
  7: () => `<div class="demo-grid"><div class="demo-field"><label for="heart-rate">RITMO CARDÍACO (LPM)</label><input id="heart-rate" type="number" min="20" max="220" value="75" /></div><div class="demo-field"><label for="oxygen">SATURACIÓN DE OXÍGENO (%)</label><input id="oxygen" type="number" min="50" max="100" value="98" /></div></div><div class="demo-actions"><button class="demo-action" id="send-vitals">Enviar nueva lectura</button><button class="demo-action secondary" id="toggle-alarm">Desconectar alarma</button></div><div class="signal-bars"><div class="signal safe" id="nurse-panel"><span class="demo-label">PANEL ENFERMERÍA</span><strong>75 LPM · 98%</strong></div><div class="signal safe" id="alarm-panel"><span class="demo-label">ALARMA UCI</span><strong>En rango</strong></div></div><div class="demo-output" id="observer-output">Nueva lectura: el monitor notificará al panel, la alarma y el historial.</div>`,
  8: () => `<div class="demo-grid"><div class="demo-field"><label for="shipping">ESTRATEGIA DE ENVÍO</label><select id="shipping"><option value="standard">Terrestre estándar</option><option value="express">Express 24 horas</option><option value="international">Internacional courier</option></select></div><div class="demo-field"><label for="weight">PESO (KG)</label><input id="weight" type="number" min="0.1" step="0.5" value="12" /></div><div class="demo-field"><label for="distance">DISTANCIA (KM)</label><input id="distance" type="number" min="1" step="10" value="320" /></div></div><button class="demo-action" id="quote-shipping">Calcular cotización</button><div class="demo-output" id="strategy-output">Elige una modalidad para calcular su tarifa y tiempo estimado.</div>`,
  9: () => `<div class="metric-row"><div class="metric"><strong id="balance-a">$200.000</strong><small>cuenta 001-A</small></div><div class="metric"><strong id="balance-b">$50.000</strong><small>cuenta 002-B</small></div><div class="metric"><strong id="command-count">0</strong><small>comandos aplicados</small></div></div><div class="demo-grid"><div class="demo-field"><label for="bank-action">OPERACIÓN</label><select id="bank-action"><option value="deposit">Depositar en 001-A</option><option value="withdraw">Retirar de 001-A</option><option value="transfer">Transferir A → B</option></select></div><div class="demo-field"><label for="bank-amount">MONTO (COP)</label><input id="bank-amount" type="number" min="1000" step="1000" value="50000" /></div></div><div class="demo-actions"><button class="demo-action" id="run-command">Ejecutar comando</button><button class="demo-action secondary" id="undo-command">Deshacer última</button></div><div class="log-list" id="bank-log"></div>`,
  10: () => `<div class="demo-label">ESTADO DE LA SOLICITUD</div><div class="metric-row"><div class="metric"><strong class="status-pill" id="credit-status">Borrador</strong><small>estado actual</small></div><div class="metric"><strong id="document-count">0</strong><small>documentos adjuntos</small></div><div class="metric"><strong id="credit-number">CRE-7749</strong><small>radicado</small></div></div><div class="progress-track"><i id="credit-progress"></i></div><div class="demo-grid"><div class="demo-field"><label for="credit-doc">DOCUMENTO DE SOPORTE</label><input id="credit-doc" value="Certificado laboral" /></div><div class="demo-field"><label for="reject-reason">MOTIVO (SI SE RECHAZA)</label><input id="reject-reason" value="Capacidad de pago" /></div></div><div class="demo-actions"><button class="demo-action" data-credit="attach">Adjuntar</button><button class="demo-action secondary" data-credit="review">Enviar a revisión</button><button class="demo-action secondary" data-credit="approve">Aprobar</button><button class="demo-action secondary" data-credit="reject">Rechazar</button><button class="demo-action secondary" data-credit="disburse">Desembolsar</button></div><div class="demo-output" id="credit-log">Solicitud creada en estado Borrador.</div><p class="demo-note">Prueba acciones válidas y bloqueadas en cada estado para ver cómo cambian sus reglas.</p>`,
};

function bindDemo(id) {
  if (id === 1) document.querySelector('#build-order').addEventListener('click', () => {
    const services = [...document.querySelectorAll('input[name="service"]:checked')].map((input) => input.value);
    const plate = document.querySelector('#plate').value.trim().toUpperCase();
    const output = document.querySelector('#builder-output');
    if (!plate || services.length === 0) { output.textContent = 'Agrega una placa y selecciona al menos un servicio para construir la orden.'; return; }
    const loaner = document.querySelector('#loaner').checked ? 'Sí' : 'No';
    output.textContent = `ORDEN CONSTRUIDA\nPlaca: ${plate}\nTaller: ${document.querySelector('#service-level').value}\nServicios: ${services.join(', ')}\nVehículo sustituto: ${loaner}`;
  });

  if (id === 2) {
    const getReport = () => {
      const period = document.querySelector('#report-period').value;
      return document.querySelector('#report-format').value === 'csv'
        ? `periodo,id,total\n${period},V-001,150000\n${period},V-002,89000`
        : JSON.stringify({ periodo: period, ventas: [{ id: 'V-001', total: 150000 }, { id: 'V-002', total: 89000 }] }, null, 2);
    };
    document.querySelector('#generate-report').addEventListener('click', () => { document.querySelector('#factory-output').textContent = getReport(); });
    document.querySelector('#report-format').addEventListener('change', () => { document.querySelector('#factory-output').textContent = getReport(); });
    document.querySelector('#download-report').addEventListener('click', () => {
      const format = document.querySelector('#report-format').value;
      const blob = new Blob([getReport()], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `reporte-ventas.${format}`; link.click(); URL.revokeObjectURL(link.href);
    });
  }

  if (id === 3) {
    const renderLog = () => {
      document.querySelector('#log-count').textContent = singletonLog.length;
      document.querySelector('#singleton-log').innerHTML = singletonLog.length ? singletonLog.map((event) => `<div class="log-item">${escapeHTML(event)}</div>`).join('') : '<div class="log-item">El registro está vacío.</div>';
    };
    content.querySelectorAll('[data-log]').forEach((button) => button.addEventListener('click', () => { singletonLog.unshift(button.dataset.log); renderLog(); }));
    document.querySelector('#clear-log').addEventListener('click', () => { singletonLog = []; renderLog(); }); renderLog();
  }

  if (id === 4) document.querySelector('#adapt-location').addEventListener('click', () => {
    const lat = Number(document.querySelector('#latitude').value); const lon = Number(document.querySelector('#longitude').value);
    document.querySelector('#adapter-output').textContent = Number.isFinite(lat) && Number.isFinite(lon) ? `RESPUESTA ADAPTADA PARA EL MAPA\nUbicación: ${lat.toFixed(4)}, ${lon.toFixed(4)}\nFuente: GPS legado → AdaptadorGPS → Aplicación de mapas` : 'Ingresa coordenadas numéricas válidas.';
  });

  if (id === 5) {
    const updateDrink = () => {
      const milk = document.querySelector('#milk').checked; const syrup = document.querySelector('#syrup').checked;
      document.querySelector('#drink-total').textContent = formatCOP(3000 + (milk ? 800 : 0) + (syrup ? 500 : 0));
      document.querySelector('#drink-name').textContent = `Café${milk ? ' + leche' : ''}${syrup ? ' + jarabe' : ''}`;
      document.querySelector('#decorator-count').textContent = Number(milk) + Number(syrup);
    };
    content.querySelectorAll('#milk, #syrup').forEach((input) => input.addEventListener('change', updateDrink));
  }

  if (id === 6) {
    document.querySelector('#add-alerts').addEventListener('click', () => { flyweightReports += 500; updateFlyweight(); });
    document.querySelector('#reset-alerts').addEventListener('click', () => { flyweightReports = 8; updateFlyweight(); }); updateFlyweight();
  }

  if (id === 7) {
    let alarmConnected = true;
    document.querySelector('#send-vitals').addEventListener('click', () => {
      const bpm = Number(document.querySelector('#heart-rate').value); const oxygen = Number(document.querySelector('#oxygen').value); const critical = bpm < 50 || bpm > 120 || oxygen < 90;
      document.querySelector('#nurse-panel').innerHTML = `<span class="demo-label">PANEL ENFERMERÍA</span><strong>${bpm} LPM · ${oxygen}%</strong>`;
      const alarm = document.querySelector('#alarm-panel'); alarm.classList.toggle('alert', critical && alarmConnected); alarm.classList.toggle('safe', !critical || !alarmConnected);
      alarm.innerHTML = `<span class="demo-label">ALARMA UCI ${alarmConnected ? '· ACTIVA' : '· DESCONECTADA'}</span><strong>${!alarmConnected ? 'Sin suscripción' : critical ? '⚠ Revisar lectura' : 'En rango'}</strong>`;
      document.querySelector('#observer-output').textContent = `Monitor notificó nueva lectura a ${alarmConnected ? '3' : '2'} observadores: panel de enfermería${alarmConnected ? ', alarma UCI' : ''} e historial clínico.`;
    });
    document.querySelector('#toggle-alarm').addEventListener('click', (event) => { alarmConnected = !alarmConnected; event.currentTarget.textContent = alarmConnected ? 'Desconectar alarma' : 'Reconectar alarma'; document.querySelector('#observer-output').textContent = alarmConnected ? 'La alarma volvió a suscribirse al monitor.' : 'La alarma se desuscribió; los otros observadores siguen conectados.'; });
  }

  if (id === 8) document.querySelector('#quote-shipping').addEventListener('click', () => {
    const weight = Math.max(0, Number(document.querySelector('#weight').value)); const distance = Math.max(0, Number(document.querySelector('#distance').value)); const strategy = document.querySelector('#shipping').value;
    const choices = { standard: { name: 'Terrestre Estándar', fee: 10000 + weight * 2000 + distance * 50, time: '3 a 5 días hábiles' }, express: { name: 'Express 24 Horas', fee: 35000 + weight * 6000 + distance * 150, time: 'Máximo 24 horas garantizadas' }, international: { name: 'Internacional Courier', fee: 90000 + weight * 15000 + 40000, time: '7 a 12 días hábiles' } };
    const result = choices[strategy]; document.querySelector('#strategy-output').textContent = `COTIZACIÓN · ${result.name}\nPeso: ${weight} kg · Distancia: ${distance} km\nCosto: ${formatCOP(result.fee)}\nTiempo estimado: ${result.time}`;
  });

  if (id === 9) bindBankDemo();
  if (id === 10) bindCreditDemo();
}

function updateFlyweight() {
  const types = 3; const saved = Math.max(0, flyweightReports - types);
  document.querySelector('#report-count').textContent = flyweightReports.toLocaleString('es-CO');
  document.querySelector('#saved-count').textContent = saved.toLocaleString('es-CO');
}

function bindBankDemo() {
  let balanceA = 200000; let balanceB = 50000; const history = [];
  const render = (message = '') => {
    document.querySelector('#balance-a').textContent = formatCOP(balanceA); document.querySelector('#balance-b').textContent = formatCOP(balanceB);
    document.querySelector('#command-count').textContent = history.length;
    const log = document.querySelector('#bank-log'); log.innerHTML = (message ? `<div class="log-item">${escapeHTML(message)}</div>` : '') + history.slice().reverse().map((entry) => `<div class="log-item">${escapeHTML(entry.label)} · ${entry.undone ? 'deshecho' : 'aplicado'}</div>`).join('');
  };
  document.querySelector('#run-command').addEventListener('click', () => {
    const action = document.querySelector('#bank-action').value; const amount = Math.max(0, Number(document.querySelector('#bank-amount').value));
    if (!amount) { render('Ingresa un monto válido.'); return; }
    if (action === 'deposit') { balanceA += amount; history.push({ label: `Depósito ${formatCOP(amount)} en cuenta A`, undo: () => { balanceA -= amount; } }); render('Comando de depósito ejecutado.'); }
    else if (action === 'withdraw') { if (amount > balanceA) { render('Retiro rechazado: saldo insuficiente. No se guardó el comando.'); return; } balanceA -= amount; history.push({ label: `Retiro ${formatCOP(amount)} de cuenta A`, undo: () => { balanceA += amount; } }); render('Comando de retiro ejecutado.'); }
    else { if (amount > balanceA) { render('Transferencia rechazada: saldo insuficiente. No se guardó el comando.'); return; } balanceA -= amount; balanceB += amount; history.push({ label: `Transferencia ${formatCOP(amount)} de A a B`, undo: () => { balanceA += amount; balanceB -= amount; } }); render('Comando de transferencia ejecutado.'); }
  });
  document.querySelector('#undo-command').addEventListener('click', () => { const command = history.slice().reverse().find((entry) => !entry.undone); if (!command) { render('No hay comandos pendientes por deshacer.'); return; } command.undo(); command.undone = true; render(`Comando revertido: ${command.label}.`); }); render();
}

function bindCreditDemo() {
  let status = 'Borrador'; const documents = []; const transitions = { 'Borrador': 0, 'En Revisión': 30, 'Aprobado': 65, 'Desembolsado': 100, 'Rechazado': 100 };
  const log = document.querySelector('#credit-log');
  const update = (message) => { document.querySelector('#credit-status').textContent = status; document.querySelector('#credit-status').classList.toggle('alert', status === 'Rechazado'); document.querySelector('#document-count').textContent = documents.length; document.querySelector('#credit-progress').style.width = `${transitions[status]}%`; log.textContent = `${message}\nEstado actual: ${status}${documents.length ? ` · Documentos: ${documents.join(', ')}` : ''}`; };
  content.querySelectorAll('[data-credit]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.credit;
    if (action === 'attach') { if (status !== 'Borrador') return update(`Acción bloqueada: no se adjuntan documentos en ${status}.`); const doc = document.querySelector('#credit-doc').value.trim(); if (!doc) return update('Escribe el nombre del documento antes de adjuntarlo.'); documents.push(doc); return update(`Documento adjuntado: ${doc}.`); }
    if (action === 'review') { if (status !== 'Borrador') return update('Acción bloqueada: la solicitud ya salió de borrador.'); if (!documents.length) return update('Acción bloqueada: adjunta al menos un documento primero.'); status = 'En Revisión'; return update('La solicitud fue enviada al comité de riesgos.'); }
    if (action === 'approve') { if (status !== 'En Revisión') return update(`Acción bloqueada: no se puede aprobar desde ${status}.`); status = 'Aprobado'; return update('El comité aprobó la solicitud.'); }
    if (action === 'reject') { if (!['En Revisión', 'Aprobado'].includes(status)) return update(`Acción bloqueada: no se puede rechazar desde ${status}.`); status = 'Rechazado'; return update(`Solicitud rechazada: ${document.querySelector('#reject-reason').value}.`); }
    if (action === 'disburse') { if (status !== 'Aprobado') return update(`Acción bloqueada: se requiere aprobación; estado actual: ${status}.`); status = 'Desembolsado'; return update('Fondos desembolsados al titular.'); }
  }));
}

function formatCOP(value) { return `$${Math.round(value).toLocaleString('es-CO')}`; }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active'); activeFilter = button.dataset.filter; renderCards();
}));
search.addEventListener('input', renderCards);
grid.addEventListener('click', (event) => { const button = event.target.closest('[data-demo]'); if (button) openDemo(button.dataset.demo); });
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', (event) => { if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); search.focus(); } });
renderCards();

