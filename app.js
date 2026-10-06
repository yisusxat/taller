/* ==========================================================================
   AndesHome Chile S.A. | Control Tower Interactive Logic (Chart.js & JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initChartOtifOcupacion();
    initChartCostoCO2();
    initChartCyberDay();
    initChartVsmCanales();
    initChartInboundAsn();
    initChartInboundStages();
    initChartProductividadTurnos();
    initChartCompetencias();
    updatePortfolio();
    initChartFinancialProposal();
});

// Tab Navigation & 3 Master Phases Synchronization
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetElem = document.getElementById(target);
            if (targetElem) targetElem.classList.add('active');

            syncIndexPhasePill(target);
        });
    });
}

function syncIndexPhasePill(tabId) {
    let phase = 1;
    if (tabId === 'tab-documento-solucion') phase = 2;
    else if (tabId === 'tab-proyectos') phase = 3;

    document.querySelectorAll('.iphase-pill').forEach((pill, idx) => {
        if (idx + 1 === phase) pill.classList.add('active');
        else pill.classList.remove('active');
    });
}

window.switchIndexPhase = function(phaseNum) {
    if (phaseNum === 1) {
        const btn = document.querySelector('.tab-btn[data-tab="tab-ejecutivo"]');
        if (btn) btn.click();
    } else if (phaseNum === 2) {
        const btn = document.querySelector('.tab-btn[data-tab="tab-documento-solucion"]');
        if (btn) btn.click();
    } else if (phaseNum === 3) {
        const btn = document.querySelector('.tab-btn[data-tab="tab-proyectos"]');
        if (btn) btn.click();
    }
};

// 1. Chart OTIF vs Ocupación CD
function initChartOtifOcupacion() {
    const ctx = document.getElementById('chartOtifOcupacion').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jul 25', 'Ago 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dic 25', 'Ene 26', 'Feb 26', 'Mar 26', 'Abr 26', 'May 26', 'Jun 26'],
            datasets: [
                {
                    label: 'OTIF Mensual (%)',
                    data: [92.3, 91.8, 90.7, 88.4, 86.2, 83.6, 90.2, 91.0, 89.8, 88.6, 87.5, 80.9],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Ocupación CD (%)',
                    data: [86.0, 87.3, 88.5, 90.8, 92.7, 94.1, 89.2, 88.7, 90.1, 91.5, 93.2, 96.4],
                    borderColor: '#3B82F6',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 75,
                    max: 100,
                    title: { display: true, text: 'OTIF (%)', color: '#94A3B8' },
                    grid: { color: '#334155' },
                    ticks: { color: '#F8FAFC' }
                },
                y1: {
                    position: 'right',
                    min: 80,
                    max: 100,
                    title: { display: true, text: 'Ocupación (%)', color: '#94A3B8' },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#F8FAFC' }
                },
                x: { ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            },
            plugins: {
                legend: { labels: { color: '#F8FAFC' } }
            }
        }
    });
}

// 2. Chart Costo Unitario & CO2e
function initChartCostoCO2() {
    const ctx = document.getElementById('chartCostoCO2').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jul 25', 'Ago 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dic 25', 'Ene 26', 'Feb 26', 'Mar 26', 'Abr 26', 'May 26', 'Jun 26'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Costo / Pedido (CLP)',
                    data: [5880, 5960, 6070, 6280, 6620, 7010, 6150, 6040, 6230, 6450, 6780, 7920],
                    backgroundColor: '#F59E0B',
                    yAxisID: 'y'
                },
                {
                    type: 'line',
                    label: 'CO2e / Pedido (kg)',
                    data: [1.79, 1.81, 1.83, 1.90, 1.99, 2.08, 1.86, 1.84, 1.89, 1.94, 2.03, 2.22],
                    borderColor: '#10B981',
                    borderWidth: 3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: { display: true, text: 'CLP / Pedido', color: '#94A3B8' },
                    grid: { color: '#334155' },
                    ticks: { color: '#F8FAFC' }
                },
                y1: {
                    position: 'right',
                    min: 1.0,
                    max: 2.5,
                    title: { display: true, text: 'kg CO2e', color: '#94A3B8' },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#F8FAFC' }
                },
                x: { ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            },
            plugins: {
                legend: { labels: { color: '#F8FAFC' } }
            }
        }
    });
}

// 3. Chart CyberDay Daily Trend
let cyberChart;
function initChartCyberDay() {
    const ctx = document.getElementById('chartCyberDay').getContext('2d');
    cyberChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['25-May', '26-May', '27-May', '28-May', '29-May', '30-May', '31-May', '01-Jun', '02-Jun', '03-Jun', '04-Jun', '05-Jun', '06-Jun', '07-Jun', '08-Jun', '09-Jun', '10-Jun'],
            datasets: [
                {
                    label: 'Backlog al Cierre (Pedidos)',
                    data: [8961, 9172, 9333, 9486, 9658, 9698, 9773, 12835, 16142, 19504, 18284, 17367, 16202, 14959, 14057, 13423, 12805],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'OTIF Diario (%)',
                    data: [88.6, 89.6, 88.2, 89.6, 87.2, 89.0, 91.0, 71.0, 72.7, 73.6, 88.4, 86.7, 88.9, 88.4, 89.3, 86.5, 86.5],
                    borderColor: '#3B82F6',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: { display: true, text: 'Pedidos Backlog', color: '#94A3B8' },
                    grid: { color: '#334155' },
                    ticks: { color: '#F8FAFC' }
                },
                y1: {
                    position: 'right',
                    min: 40,
                    max: 100,
                    title: { display: true, text: 'OTIF (%)', color: '#94A3B8' },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#F8FAFC' }
                },
                x: { ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            },
            plugins: {
                legend: { labels: { color: '#F8FAFC' } }
            }
        }
    });
}

function filterCyberView(type) {
    document.querySelectorAll('.button-group .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (type === 'ecom') {
        cyberChart.data.datasets[0].data = [430, 1465, 2569, 3773, 5303, 6200, 6800, 10553, 13323, 14217, 13100, 12200, 11500, 10800, 10100, 9500, 9100];
        cyberChart.data.datasets[1].data = [83.6, 83.7, 83.7, 83.6, 82.9, 83.0, 84.0, 59.3, 61.2, 63.4, 81.3, 80.1, 83.5, 82.5, 83.5, 79.0, 80.6];
    } else if (type === 'cc') {
        cyberChart.data.datasets[0].data = [177, 484, 727, 1055, 1535, 1800, 2000, 2680, 3365, 3594, 3100, 2800, 2500, 2200, 1900, 1700, 1500];
        cyberChart.data.datasets[1].data = [88.4, 88.4, 88.8, 88.1, 87.8, 88.0, 89.0, 69.3, 71.0, 72.5, 86.0, 85.0, 87.0, 86.5, 87.5, 85.0, 86.0];
    } else {
        cyberChart.data.datasets[0].data = [8961, 9172, 9333, 9486, 9658, 9698, 9773, 12835, 16142, 19504, 18284, 17367, 16202, 14959, 14057, 13423, 12805];
        cyberChart.data.datasets[1].data = [88.6, 89.6, 88.2, 89.6, 87.2, 89.0, 91.0, 71.0, 72.7, 73.6, 88.4, 86.7, 88.9, 88.4, 89.3, 86.5, 86.5];
    }
    cyberChart.update();
}

// 4. Chart VSM Canales
function initChartVsmCanales() {
    const ctx = document.getElementById('chartVsmCanales').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['E-commerce domicilio', 'Click & Collect', 'Reposición tiendas'],
            datasets: [
                { label: 'Picking (h)', data: [5.63, 5.02, 7.91], backgroundColor: '#3B82F6' },
                { label: 'Packing (h)', data: [3.31, 2.21, 1.88], backgroundColor: '#06B6D4' },
                { label: 'Cola Packing/Desp (h)', data: [2.22, 2.02, 1.82], backgroundColor: '#F59E0B' },
                { label: 'Demora Despacho (h)', data: [14.39, 2.12, 7.09], backgroundColor: '#EF4444' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } },
                y: { stacked: true, title: { display: true, text: 'Horas Totales en CD', color: '#94A3B8' }, ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            },
            plugins: { legend: { labels: { color: '#F8FAFC' } } }
        }
    });
}

// 5. Chart Inbound ASN
function initChartInboundAsn() {
    const ctx = document.getElementById('chartInboundAsn').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Con ASN + Con Cita', 'Con ASN + Sin Cita', 'Sin ASN + Con Cita', 'Sin ASN + Sin Cita'],
            datasets: [
                { label: 'Dock-to-Stock Medio (Horas)', data: [3.16, 4.05, 4.09, 5.79], backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'] }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { title: { display: true, text: 'Horas', color: '#94A3B8' }, ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } },
                x: { ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// 6. Chart Inbound Stages Pie
function initChartInboundStages() {
    const ctx = document.getElementById('chartInboundStages').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Putaway', 'Descarga', 'Control QC', 'Espera Andén'],
            datasets: [{
                data: [40.8, 28.9, 16.0, 14.3],
                backgroundColor: ['#3B82F6', '#06B6D4', '#F59E0B', '#EF4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// 7. Chart Productividad Turnos
function initChartProductividadTurnos() {
    const canvas = document.getElementById('chartProductividadTurnos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Zona A-Rápida', 'Zona B-Media', 'Zona C-Lenta', 'Zona D-Bulky'],
            datasets: [
                { label: 'Turno Mañana (lin/h)', data: [49.6, 40.1, 29.7, 18.5], backgroundColor: '#3B82F6' },
                { label: 'Turno Tarde (lin/h)', data: [47.8, 38.2, 28.5, 17.6], backgroundColor: '#06B6D4' },
                { label: 'Turno Noche (lin/h)', data: [42.8, 34.4, 25.2, 15.8], backgroundColor: '#8B5CF6' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { title: { display: true, text: 'Líneas / HH', color: '#94A3B8' }, ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } },
                x: { ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            },
            plugins: { legend: { labels: { color: '#F8FAFC' } } }
        }
    });
}

// 8. Chart Competencias
function initChartCompetencias() {
    const canvas = document.getElementById('chartCompetencias');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Manejo RF', 'Conocimiento WMS', 'Metodología Lean', 'Ergonomía MMC', 'Superusuario'],
            datasets: [
                { label: 'Personal Propio (%)', data: [83.5, 81.7, 21.7, 57.4, 13.0], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                { label: 'Personal Temporal (%)', data: [65.9, 39.0, 34.1, 61.0, 7.3], borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)' },
                { label: 'Servicio Externo (%)', data: [50.0, 50.0, 29.2, 54.2, 12.5], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: '#334155' },
                    pointLabels: { color: '#F8FAFC', font: { size: 11 } },
                    ticks: { color: '#94A3B8', backdropColor: 'transparent' }
                }
            },
            plugins: { legend: { labels: { color: '#F8FAFC' } } }
        }
    });
}

// Interactive VSM Stage Inspector
function selectVsmStage(stage) {
    const box = document.getElementById('vsm-detail-box');
    const title = document.getElementById('vsm-title');
    const desc = document.getElementById('vsm-desc');

    const info = {
        inbound: {
            title: '01. Inbound & Recepción: Andenes Compartidos y Falta de Cita/ASN',
            desc: '43,1% de arribos tienen ASN+Cita. Arribos sin ASN/Cita generan esperas de 65,2 min por camión. 19 camiones importados acumularon CLP 146.319.000 en demurrage.'
        },
        putaway: {
            title: '02. Putaway a Racks: Estancamiento de Inventario en Staging',
            desc: 'Tiempo medio Dock-to-Stock de 22,6 h en junio. Falta de grúas reach disponibles (14 de 18 en peak) provoca que el inventario no esté disponible para picking a tiempo.'
        },
        picking: {
            title: '03. Picking en Olas: 67,6 km/día de Caminata Inútil por Mismatch',
            desc: '114 SKU desalineados (25,3%) causan excesos de recorrido. Horas acumuladas de caminata inútil suman CLP 585,2 MM en 4 meses. En peak el error sube a 2,44%.'
        },
        packing: {
            title: '04. Packing & Labeling: Colas de Espera de hasta 28 Horas en Peak',
            desc: 'Insuficiente right-sizing y transportadores degradados (2 de 3 operativos). Genera cuellos de botella masivos durante el CyberDay.'
        },
        despacho: {
            title: '05. Despacho & Staging: Falta de Preclasificación por Ruta',
            desc: 'Demora promedio de despacho de 14,4 h en E-commerce domicilio. Poca preclasificación por transportista produce mezcla de pedidos y reintentos.'
        }
    };

    if (info[stage]) {
        title.innerText = info[stage].title;
        desc.innerText = info[stage].desc;
        box.style.borderColor = '#3B82F6';
    }
}

// Interactive Portfolio Tracker (P1-P7)
function updatePortfolio() {
    let totalCapex = 0;
    let maxPlazo = 0;
    const maxCapex = 850000000;

    for (let i = 1; i <= 7; i++) {
        const chk = document.getElementById(`p${i}`);
        if (chk && chk.checked) {
            totalCapex += parseInt(chk.getAttribute('data-capex'));
            const plazo = parseInt(chk.getAttribute('data-plazo'));
            if (plazo > maxPlazo) maxPlazo = plazo;
        }
    }

    const marginCapex = maxCapex - totalCapex;

    const totalEl = document.getElementById('total-capex');
    const marginEl = document.getElementById('margin-capex');
    const plazoEl = document.getElementById('max-plazo');

    totalEl.innerText = `$${totalCapex.toLocaleString('es-CL')} CLP`;
    marginEl.innerText = `$${marginCapex.toLocaleString('es-CL')} CLP`;
    plazoEl.innerText = `${maxPlazo} semanas (Máx 36)`;

    if (totalCapex > maxCapex) {
        totalEl.className = 'text-danger';
        marginEl.className = 'text-danger';
    } else {
        totalEl.className = 'text-success';
        marginEl.className = 'text-success';
    }
}

// Global Helper to open Solution Proposal Tab
function openSolutionProposal() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    const solBtn = document.querySelector('[data-tab="tab-documento-solucion"]');
    const solTab = document.getElementById('tab-documento-solucion');

    if (solBtn) solBtn.classList.add('active');
    if (solTab) {
        solTab.classList.add('active');
        solTab.scrollIntoView({ behavior: 'smooth' });
    }
}

// Subtab Navigation inside Solution Proposal Portal
function switchSolSubtab(subtabId) {
    const subtabButtons = document.querySelectorAll('.sol-tab-btn');
    const subtabContents = document.querySelectorAll('.sol-subcontent');

    subtabButtons.forEach(btn => btn.classList.remove('active'));
    subtabContents.forEach(content => content.classList.remove('active'));

    const activeBtn = Array.from(subtabButtons).find(b => b.getAttribute('onclick').includes(subtabId));
    if (activeBtn) activeBtn.classList.add('active');

    const activeContent = document.getElementById(subtabId);
    if (activeContent) activeContent.classList.add('active');
}

// Global Financial Proposal Chart Instance
let chartFinProposalInstance = null;

function initChartFinancialProposal() {
    const ctx = document.getElementById('chartFinancialProposal');
    if (!ctx) return;

    chartFinProposalInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Inversión Año 0', 'Flujo Neto Año 1', 'Flujo Neto Año 2', 'Flujo Neto Año 3', 'Flujo Acumulado A3'],
            datasets: [{
                label: 'Flujo de Caja Proyectado (CLP)',
                data: [-766800000, 856097000, 856097000, 856097000, 1801491000],
                backgroundColor: [
                    '#EF4444',
                    '#10B981',
                    '#10B981',
                    '#10B981',
                    '#3B82F6'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ' $' + context.raw.toLocaleString('es-CL') + ' CLP';
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#F8FAFC',
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(0) + 'M';
                        }
                    },
                    grid: { color: '#334155' }
                },
                x: { ticks: { color: '#F8FAFC' }, grid: { color: '#334155' } }
            }
        }
    });
}

function recalculateROI() {
    const rate = parseFloat(document.getElementById('slider-rate').value);
    const contingency = parseFloat(document.getElementById('slider-contingency').value);
    const savingsPct = parseFloat(document.getElementById('slider-savings').value) / 100;

    document.getElementById('val-rate').innerText = rate + '%';
    document.getElementById('val-contingency').innerText = contingency + '%';
    document.getElementById('val-savings').innerText = Math.round(savingsPct * 100) + '%';

    const baseCapex = 710000000;
    const totalCapex = baseCapex * (1 + contingency / 100);
    const grossSavings = 1033097000 * savingsPct;
    const opex = 177000000;
    const netEbitda = grossSavings - opex;

    let van = -totalCapex;
    for (let t = 1; t <= 3; t++) {
        van += netEbitda / Math.pow(1 + rate / 100, t);
    }

    const paybackMonths = (totalCapex / netEbitda) * 12;

    document.getElementById('calc-capex-display').innerText = '$' + Math.round(totalCapex).toLocaleString('es-CL') + ' CLP';
    document.getElementById('calc-ebitda-display').innerText = '$' + Math.round(netEbitda).toLocaleString('es-CL') + ' CLP';
    document.getElementById('calc-van-display').innerText = '$' + Math.round(van).toLocaleString('es-CL') + ' CLP';
    document.getElementById('calc-rate-sub').innerText = 'Tasa Descuento: ' + rate + '%';
    document.getElementById('calc-payback-display').innerText = paybackMonths.toFixed(1) + ' Meses';

    if (chartFinProposalInstance) {
        chartFinProposalInstance.data.datasets[0].data = [
            -Math.round(totalCapex),
            Math.round(netEbitda),
            Math.round(netEbitda),
            Math.round(netEbitda),
            Math.round((netEbitda * 3) - totalCapex)
        ];
        chartFinProposalInstance.update();
    }
}

// WBS Phase Detail Drawer
function showWbsDetail(phaseNum) {
    const titleEl = document.getElementById('wbs-detail-title');
    const descEl = document.getElementById('wbs-detail-desc');

    const details = {
        1: {
            title: 'FASE 1 (Semanas 1 - 4): Preparación & Depuración de Datos',
            desc: 'Auditoría completa del maestro de SKU. Pesaje y volumetría automática de 450 SKU. Limpieza de datos EAN. Hito Gate 1: Aprobación del Comité de Dirección para liberar desembolsos de licencias.'
        },
        2: {
            title: 'FASE 2 (Semanas 5 - 10): Quick Wins & Re-slotting Físico',
            desc: 'Reubicación física de 114 SKU desalineados hacia la zona A-Rápida cercana a expedición. Instalación de mesas ergonómicas y reparación de gatos de elevación en D-Bulky. ⚠️ Freeze de TI Corporativo en Semana 10.'
        },
        3: {
            title: 'FASE 3 (Semanas 11 - 18): Integración Tecnológica en Ambiente Staging',
            desc: 'Despliegue de conectores API REST entre ERP SAP, WMS NextGen, Portal ASN proveedores y TMS ruteador. Pruebas de simulación de volumen equivalente al CyberDay (15.000 pedidos/día).'
        },
        4: {
            title: 'FASE 4 (Semanas 19 - 22): Pilotos Operacionales Controlados',
            desc: 'Piloto en pasillos A-Rápida con 30 operarios capacitados en Voice/RF. Piloto de ruteo dinámico con la flota principal LogiExpress. Medición de tiempos de ciclo y corrección de desvíos.'
        },
        5: {
            title: 'FASE 5 (Semanas 23 - 24): Cutover General & Go-Live',
            desc: 'Migración definitiva en vivo sin detener la recepción ni el despacho del CD. Certificación final de 18 superusuarios por turno y transferencia de soporte a Operaciones y Prevención.'
        }
    };

    if (details[phaseNum]) {
        titleEl.innerText = details[phaseNum].title;
        descEl.innerText = details[phaseNum].desc;
    }
}

// Preset Scenario Switcher
function applyPresetScenario(scenario) {
    const btns = document.querySelectorAll('.btn-preset');
    btns.forEach(b => b.classList.remove('active'));

    const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick').includes(scenario));
    if (activeBtn) activeBtn.classList.add('active');

    const rateSlider = document.getElementById('slider-rate');
    const contingencySlider = document.getElementById('slider-contingency');
    const savingsSlider = document.getElementById('slider-savings');

    if (scenario === 'pesimista') {
        rateSlider.value = 14;
        contingencySlider.value = 12;
        savingsSlider.value = 75;
    } else if (scenario === 'optimista') {
        rateSlider.value = 10;
        contingencySlider.value = 5;
        savingsSlider.value = 115;
    } else { // Base
        rateSlider.value = 12;
        contingencySlider.value = 8;
        savingsSlider.value = 100;
    }

    recalculateROI();
}

// Executive C-Suite Deck State & Functions
let currentDeckSlide = 1;
const totalDeckSlides = 5;

function openExecutiveDeck() {
    const modal = document.getElementById('modal-csuite-deck');
    if (modal) {
        modal.classList.add('active');
        currentDeckSlide = 1;
        updateDeckSlideView();
    }
}

function closeExecutiveDeck() {
    const modal = document.getElementById('modal-csuite-deck');
    if (modal) modal.classList.remove('active');
}

function navDeck(dir) {
    currentDeckSlide += dir;
    if (currentDeckSlide < 1) currentDeckSlide = 1;
    if (currentDeckSlide > totalDeckSlides) currentDeckSlide = totalDeckSlides;
    updateDeckSlideView();
}

function updateDeckSlideView() {
    for (let i = 1; i <= totalDeckSlides; i++) {
        const slide = document.getElementById(`slide-${i}`);
        if (slide) slide.classList.remove('active');
    }

    const activeSlide = document.getElementById(`slide-${currentDeckSlide}`);
    if (activeSlide) activeSlide.classList.add('active');

    const indicator = document.getElementById('deck-slide-indicator');
    if (indicator) indicator.innerText = `Slide ${currentDeckSlide} de ${totalDeckSlides}`;
}

