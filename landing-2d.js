/* ==========================================================================
   AndesHome Chile S.A. | Lógica Interactiva del Plano 2D y Diagnóstico EA1
   Gestión de Selección de Pasillos SVG, Diagrama de Espagueti, VSM, APQC,
   Ruta Narrativa Guiada (Journey), Búsqueda de SKUs, Capas y Sandbox Financiero
   ========================================================================== */

let current2DMode = 'crisis'; // 'crisis' | 'optimized'
let currentActiveFilter = 'all';
let currentChannelFilter = 'ALL';
let currentMasterPhase = 1;
const totalMasterPhases = 3;
let currentJourneyStage = 1;
const journeyTotalStages = 3;

// Base de datos de pasillos y zonas del CD Pudahuel con Dimensión Humana Integrada
const layout2DData = {
    'ZONE-A': {
        title: 'Zona A — Rápida Rotación (Pick Express)',
        badge: 'PASILLOS A01 A A06 | DISTANCIA: 35M',
        role: 'Operario de Picking Express',
        skus: '84 SKU actuales (Óptimo: 105 SKU)',
        visitas: '30,9% del total de visitas CD',
        dist: '35 metros a expedición',
        prod: '46,8 líneas / HH',
        travelTime: '22,7% del tiempo en traslado',
        crisisText: '⚠️ Saturación en CyberDay: Congestión masiva de operarios en pasillos A01-A03 por falta de capacidad y retrasos en picking con papel.',
        optText: '✨ Capacidad ampliada a 105 SKU (+25%). Voice Picking WMS elimina detenciones y eleva productividad a 55,2 lin/HH (+18%).',
        humanCrisis: 'En pasillos de 2,4m de ancho, hasta 6 operarios con transpaletas manuales y listas de papel arrugadas chocan intentando cruzar. El estrés por la hora de corte provoca discusiones, fatiga y errores en cascada.',
        humanOpt: 'Flujo unidireccional despejado y picking manos libres por comando de voz (Voice Picking). El operario trabaja sereno, sin papeles ni distracciones, reduciendo su fatiga y terminando su turno a tiempo.',
        action: 'Re-slotting P1 + Voice Picking P2'
    },
    'ZONE-B': {
        title: 'Zona B — Media Rotación (Standard)',
        badge: 'PASILLOS B01 A B12 | DISTANCIA: 72M',
        role: 'Preparador de Pedidos Estándar',
        skus: '125 SKU actuales (Óptimo: 120 SKU)',
        visitas: '38,2% del total de visitas CD',
        dist: '72 metros a expedición',
        prod: '37,6 líneas / HH',
        travelTime: '31,7% del tiempo en traslado',
        crisisText: 'Operación balanceada pero afectada por retrasos en putaway desde staging inbound, generando quiebres en picking nocturno.',
        optText: '✨ Reposición preventiva sincronizada por WMS NextGen y terminales RF.',
        humanCrisis: 'El operario llega al rack y la ubicación está vacía (quiebre de stock en picking). Debe esperar 25 minutos de brazos cruzados a que una grúa baje un pallet desde altura, sintiendo la impotencia de no poder cumplir su meta.',
        humanOpt: 'Reposición preventiva automática: cuando quedan 2 cajas, el sistema ya envió al grullero para reponer. El operario jamás encuentra una posición desabastecida.',
        action: 'Estandarización de Olas'
    },
    'ZONE-C': {
        title: 'Zona C — Lenta Rotación (Pasillos Profundos)',
        badge: 'PASILLOS C01 A C06 | DISTANCIA: 118M',
        role: 'Operario de Turno Noche',
        skus: '154 SKU actuales (12 SKU Clase A extraviados)',
        visitas: '18,5% del total de visitas CD',
        dist: '118 metros a expedición',
        prod: '27,8 líneas / HH',
        travelTime: '42,9% del tiempo en traslado',
        crisisText: '🚨 Slotting Mismatch Crítico: 12 SKU de Alta Venta (ej. Cocina A) ubicados al fondo del CD obligan a caminar 28,4 km adicionales al día.',
        optText: '✨ Los 12 SKU Clase A fueron extraídos hacia la Zona A. El tiempo de viaje se reduce en un 64%.',
        humanCrisis: 'Juan debe caminar hasta el fondo de la bodega (118 metros) solo para buscar una Cocina o Sartén mal clasificado. Camina 14 km por noche solo por 12 productos extraviados. Al final del turno sufre dolores lumbares y pies hinchados.',
        humanOpt: 'Los 12 productos estrella fueron trasladados a la entrada (Zona A). La caminata diaria cae de 67 km a solo 7 km distribuidos. Menos desgaste físico y una jornada laboral digna y eficiente.',
        action: 'Extracción Prioritaria P1'
    },
    'ZONE-D': {
        title: 'Zona D — Carga Pesada & Voluminosa (Bulky)',
        badge: 'PASILLOS D01 A D03 | DISTANCIA: 154M',
        role: 'Operador de Carga Pesada (SST)',
        skus: '87 SKU actuales (64 SKU >25 kg)',
        visitas: '12,4% del total de visitas CD',
        dist: '154 metros a expedición',
        prod: '17,3 líneas / HH',
        travelTime: '39,1% del tiempo en traslado',
        crisisText: '⚠️ Alerta de Seguridad SST: 38 SKU >25 kg se manipulan a pulso sin ayuda mecánica. Tasa de accidentabilidad 83,8/100k HH (Fiscalización DT).',
        optText: '✨ 4 mesas elevadoras hidráulicas y transpaletas eléctricas operativas. Cero manipulación manual sobre 25 kg.',
        humanCrisis: 'Pedro y un compañero levantan hornos y estufas de 42 kg a pulso sobre una transpaleta porque las mesas elevadoras están rotas. Existe miedo constante a una hernia o lumbago (17 sobreesfuerzos y 53 días perdidos al año).',
        humanOpt: '4 mesas hidráulicas que ajustan la carga a la altura del pecho y transpaletas eléctricas. Cero levantamiento manual sobre 25 kg. Tranquilidad total para el trabajador y su familia.',
        action: 'Right-Sizing & Ergonomía P5'
    },
    'INBOUND': {
        title: 'Andenes Inbound & Área de Recepción',
        badge: '24 ANDENES DE DESCARGA | STAGING Y QC',
        role: 'Chofer de Camión & Recepcionista',
        skus: '30 Proveedores Activos',
        visitas: '120 camiones/semana',
        dist: 'Andén a Rack',
        prod: 'Dock-to-Stock: 22,6h',
        travelTime: 'Espera camión: 65,2 min',
        crisisText: '🛑 Colapso de andenes: Solo 43% de citas y ASN. Camiones en cola generando $146,3M en cobros de sobreestadía (demurrage).',
        optText: '✨ Portal ASN y YMS de citas operando con ventanas de 2 horas. Dock-to-Stock reducido a 4,5 horas.',
        humanCrisis: 'Marcelo, transportista que viajó de noche desde San Antonio, espera más de 65 minutos estacionado afuera de la bodega con frío y sin baño. Cada hora perdida es dinero que no lleva a su hogar, mientras AndesHome acumula $146M en multas.',
        humanOpt: 'Marcelo reserva su cita en una ventana de 2 horas desde su celular. Llega a Pudahuel, el andén lo espera despejado, descarga en 45 minutos y sigue su ruta sin esperas humillantes.',
        action: 'Portal ASN & YMS P3'
    },
    'OUTBOUND': {
        title: 'Andenes Despacho & Flota Última Milla',
        badge: 'EXPEDICIÓN, CONSOLIDACIÓN & TMS',
        role: 'Cliente Final & Repartidor',
        skus: '3 Carriers Principales',
        visitas: '3.560 pedidos/día',
        dist: 'Staging a Camión',
        prod: '11,5% entregas fallidas',
        travelTime: 'Costo falla: $29.628',
        crisisText: '🚨 11,5% de envíos fallidos por datos erróneos de cubicaje y falta de prueba de entrega móvil (POD). Sobrecosto masivo en reintentos.',
        optText: '✨ TMS con ruteo dinámico por cubicaje y aplicación móvil chofer (POD digital). Tasa de falla cae a ≤2,8%.',
        humanCrisis: 'Camila compró el regalo de cumpleaños de su hijo en CyberDay con promesa de 48 horas. Pasan 12 días, el chofer se pierde por falta de app con GPS y la caja llega rota. Camila llama frustrada a servicio al cliente jurando nunca más comprar.',
        humanOpt: 'El repartidor recibe la ruta óptima en su celular con foto y firma digital. La caja viaja con embalaje a medida. Camila recibe su producto a tiempo, intacto y califica el servicio con 5 estrellas.',
        action: 'TMS Ruteo Dinámico P4'
    }
};

/* Inicialización Principal */
document.addEventListener('DOMContentLoaded', () => {
    initDiagnosticTabs();
    initBlueprintInteraction();
    initModeSwitcher2D();
    initZoneFilters();
    initSandboxSimulator();
    initKeynoteModal2D();

    // Gestión de Fases Maestras y Navegación
    initMasterPhases();
    initChannelFilters();
    initSkuSearch();
    initLayerToggles();
    initSvgHoverCards();
    initKeyboardShortcuts();
    initDidacticTools();

    // Inicialización del Calculador de Racks y Layout 2D (SKU Master)
    if (typeof initRackCalculator === 'function') {
        initRackCalculator();
    }
});

/* ==========================================================================
   1. GESTOR DE PESTAÑAS DE DIAGNÓSTICO (EA1 SUITE & FASES)
   ========================================================================== */
function initDiagnosticTabs() {
    const tabBtns = document.querySelectorAll('.diag-tab-btn');
    const views = document.querySelectorAll('.diag-view-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-view');
            const phaseStr = btn.getAttribute('data-phase');

            tabBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');

            // Sincronizar Fase Maestra si el botón la declara
            if (phaseStr) {
                const phaseNum = parseInt(phaseStr);
                if (phaseNum && phaseNum !== currentMasterPhase) {
                    currentMasterPhase = phaseNum;
                    for (let i = 1; i <= totalMasterPhases; i++) {
                        const card = document.getElementById(`master-card-phase-${i}`);
                        if (card) {
                            if (i === phaseNum) card.classList.add('active');
                            else card.classList.remove('active');
                        }
                    }
                    const counterEl = document.getElementById('master-phase-counter');
                    if (counterEl && typeof masterPhaseConfigs !== 'undefined') {
                        const cfg = masterPhaseConfigs[phaseNum];
                        if (cfg) counterEl.innerText = cfg.counterText;
                    }
                }
            }
        });
    });

    // Soporte para navegación directa por Hash (#view-racks-calc, etc.)
    const handleUrlHash = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const matchingBtn = document.querySelector(`.diag-tab-btn[data-view="${hash}"]`);
            if (matchingBtn) {
                matchingBtn.click();
            }
        }
    };

    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
}

/* ==========================================================================
   2. INTERACCIÓN DEL PLANO 2D VECTORIAL (SVG)
   ========================================================================== */
function initBlueprintInteraction() {
    const blocks = document.querySelectorAll('.svg-aisle-block, .svg-dock');

    blocks.forEach(elem => {
        elem.addEventListener('click', () => {
            const zoneKey = elem.getAttribute('data-zone');
            if (zoneKey) {
                select2DZone(zoneKey);
            }
        });
    });
}

function select2DZone(zoneKey) {
    const data = layout2DData[zoneKey];
    if (!data) return;

    // Resaltar en SVG
    document.querySelectorAll('.svg-aisle-block').forEach(b => {
        if (b.getAttribute('data-zone') === zoneKey) {
            b.classList.add('selected');
        } else {
            b.classList.remove('selected');
        }
    });

    // Actualizar Panel Inspector
    const titleEl = document.getElementById('insp-title-2d');
    const badgeEl = document.getElementById('insp-badge-2d');
    const skuEl = document.getElementById('insp-sku-2d');
    const visitsEl = document.getElementById('insp-visits-2d');
    const distEl = document.getElementById('insp-dist-2d');
    const prodEl = document.getElementById('insp-prod-2d');
    const diagBox = document.getElementById('insp-diag-box');
    const solBox = document.getElementById('insp-sol-text');
    const actionBtn = document.getElementById('insp-action-btn');

    if (titleEl) titleEl.innerText = data.title;
    if (badgeEl) badgeEl.innerText = data.badge;
    if (skuEl) skuEl.innerText = data.skus;
    if (visitsEl) visitsEl.innerText = data.visitas;
    if (distEl) distEl.innerText = data.dist;
    if (prodEl) prodEl.innerText = data.prod;

    if (diagBox) {
        if (current2DMode === 'crisis') {
            diagBox.className = 'diagnostic-box-2d alert';
            diagBox.innerHTML = `<strong>Diagnóstico Crítico:</strong> ${data.crisisText}`;
        } else {
            diagBox.className = 'diagnostic-box-2d success';
            diagBox.innerHTML = `<strong>Desempeño To-Be:</strong> ${data.optText}`;
        }
    }

    // Actualizar Caja de Narrativa Humana
    const humanBox = document.getElementById('insp-human-box');
    const humanRoleEl = document.getElementById('insp-human-role');
    const humanTextEl = document.getElementById('insp-human-text');

    if (humanRoleEl && data.role) humanRoleEl.innerText = data.role;
    if (humanTextEl) {
        if (current2DMode === 'crisis') {
            humanTextEl.innerText = data.humanCrisis || '';
            if (humanBox) humanBox.classList.remove('opt-theme');
        } else {
            humanTextEl.innerText = data.humanOpt || '';
            if (humanBox) humanBox.classList.add('opt-theme');
        }
    }

    if (solBox) solBox.innerText = data.action;
    if (actionBtn) actionBtn.innerText = `Simular Impacto: ${data.action} ↓`;
}

/* ==========================================================================
   3. ALTERNADOR DE MODO: CRISIS (AS-IS) VS OPTIMIZADO (TO-BE)
   ========================================================================== */
function initModeSwitcher2D() {
    const btnCrisis = document.getElementById('mode-crisis-btn');
    const btnOpt = document.getElementById('mode-opt-btn');

    if (btnCrisis) {
        btnCrisis.addEventListener('click', () => setMode2D('crisis'));
    }
    if (btnOpt) {
        btnOpt.addEventListener('click', () => setMode2D('optimized'));
    }
}

function setMode2D(mode) {
    current2DMode = mode;
    const btnCrisis = document.getElementById('mode-crisis-btn');
    const btnOpt = document.getElementById('mode-opt-btn');
    const spaghettiPath = document.getElementById('svg-path-spaghetti');
    const optimizedPath = document.getElementById('svg-path-optimized');
    const mismatchPins = document.querySelectorAll('.svg-mismatch-pin');

    if (mode === 'crisis') {
        if (btnCrisis) btnCrisis.classList.add('active');
        if (btnOpt) btnOpt.classList.remove('active');

        if (spaghettiPath) spaghettiPath.style.display = 'block';
        if (optimizedPath) optimizedPath.style.display = 'none';
        mismatchPins.forEach(p => p.style.display = 'block');

        updateTopKPIs('crisis');
    } else {
        if (btnOpt) btnOpt.classList.add('active');
        if (btnCrisis) btnCrisis.classList.remove('active');

        if (spaghettiPath) spaghettiPath.style.display = 'none';
        if (optimizedPath) optimizedPath.style.display = 'block';
        mismatchPins.forEach(p => p.style.display = 'none');

        updateTopKPIs('optimized');
    }

    // Refrescar zona seleccionada
    const currentZone = document.querySelector('.svg-aisle-block.selected')?.getAttribute('data-zone') || 'ZONE-A';
    select2DZone(currentZone);
}

function updateTopKPIs(mode) {
    const otifEl = document.getElementById('kpi-otif-num');
    const backlogEl = document.getElementById('kpi-backlog-num');
    const costEl = document.getElementById('kpi-cost-num');
    const walkEl = document.getElementById('kpi-walk-num');

    if (mode === 'crisis') {
        if (otifEl) { otifEl.innerText = '43,5%'; otifEl.className = 'kpi-number red'; }
        if (backlogEl) { backlogEl.innerText = '15.387'; backlogEl.className = 'kpi-number red'; }
        if (costEl) { costEl.innerText = '$29.628'; costEl.className = 'kpi-number red'; }
        if (walkEl) { walkEl.innerText = '67,6 km'; walkEl.className = 'kpi-number red'; }
    } else {
        if (otifEl) { otifEl.innerText = '96,2%'; otifEl.className = 'kpi-number green'; }
        if (backlogEl) { backlogEl.innerText = '0'; backlogEl.className = 'kpi-number green'; }
        if (costEl) { costEl.innerText = '$5.675'; costEl.className = 'kpi-number green'; }
        if (walkEl) { walkEl.innerText = '7,2 km'; walkEl.className = 'kpi-number green'; }
    }
}

/* ==========================================================================
   4. FILTRADO DE ZONAS EN EL PLANO
   ========================================================================== */
function initZoneFilters() {
    const filterBtns = document.querySelectorAll('.zone-filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            currentActiveFilter = filter;

            const blocks = document.querySelectorAll('.svg-aisle-block, .svg-dock');
            blocks.forEach(b => {
                const zone = b.getAttribute('data-zone');
                if (filter === 'all' || zone === filter) {
                    b.style.opacity = '1';
                } else {
                    b.style.opacity = '0.2';
                }
            });

            if (filter !== 'all') {
                select2DZone(filter);
            }
        });
    });
}

/* ==========================================================================
   5. RUTA METODOLÓGICA DE 3 FASES MAESTRAS (EA1 -> EA2 -> EA3)
   ========================================================================== */
const masterPhaseConfigs = {
    1: {
        phase: 1,
        code: 'EA1',
        title: 'Fase 1: Diagnóstico Integral',
        tab: 'view-layout',
        mode: 'crisis',
        zone: 'ZONE-A',
        counterText: 'Fase 1 de 3: Diagnóstico Integral (EA1 - Línea Base Crisis)'
    },
    2: {
        phase: 2,
        code: 'EA2',
        title: 'Fase 2: Propuesta y Soluciones',
        tab: 'view-propuesta',
        mode: 'optimized',
        zone: 'all',
        counterText: 'Fase 2 de 3: Propuesta y Soluciones (EA2 - P1 a P5 & WBS)'
    },
    3: {
        phase: 3,
        code: 'EA3',
        title: 'Fase 3: Resultados Obtenidos & Beneficios',
        tab: 'view-resultados',
        mode: 'optimized',
        zone: 'all',
        counterText: 'Fase 3 de 3: Resultados Obtenidos & Beneficios (EA3 - Retorno & ESG)'
    }
};

window.showSolutionProposalTab = function() {
    window.setMasterPhase(2);
};

function initMasterPhases() {
    window.setMasterPhase = function(phaseNum) {
        if (phaseNum < 1) phaseNum = 1;
        if (phaseNum > totalMasterPhases) phaseNum = totalMasterPhases;
        currentMasterPhase = phaseNum;

        // Actualizar tarjetas de fases maestras
        for (let i = 1; i <= totalMasterPhases; i++) {
            const card = document.getElementById(`master-card-phase-${i}`);
            if (card) {
                if (i === phaseNum) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            }
        }

        const config = masterPhaseConfigs[phaseNum];
        if (!config) return;

        // Actualizar contador
        const counterEl = document.getElementById('master-phase-counter');
        if (counterEl) counterEl.innerText = config.counterText;

        // Activar tab correspondiente
        if (config.tab) {
            const tabBtn = document.querySelector(`.diag-tab-btn[data-view="${config.tab}"]`);
            if (tabBtn) tabBtn.click();
        }

        // Configurar modo (crisis vs optimizado)
        if (config.mode) {
            setMode2D(config.mode);
        }

        // Seleccionar zona si aplica
        if (config.zone && config.zone !== 'all') {
            select2DZone(config.zone);
        }

        // Scroll suave al contenedor si no es la primera carga
        const barElem = document.getElementById('master-phases-bar');
        if (barElem && phaseNum > 1) {
            barElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    window.prevMasterPhase = function() {
        if (currentMasterPhase > 1) {
            window.setMasterPhase(currentMasterPhase - 1);
        }
    };

    window.nextMasterPhase = function() {
        if (currentMasterPhase < totalMasterPhases) {
            window.setMasterPhase(currentMasterPhase + 1);
        }
    };

    // Retrocompatibilidad con nombres antiguos
    window.setJourneyStage = function(stageNum) {
        if (stageNum <= 2) window.setMasterPhase(1);
        else if (stageNum === 3) window.setMasterPhase(2);
        else window.setMasterPhase(3);
    };
    window.prevJourneyStage = window.prevMasterPhase;
    window.nextJourneyStage = window.nextMasterPhase;
}

/* ==========================================================================
   6. FILTRADO OMNICANAL EN EL PLANO Y APQC
   ========================================================================== */
function initChannelFilters() {
    const pills = document.querySelectorAll('.channel-filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const channelKey = pill.getAttribute('data-channel') || 'ALL';
            currentChannelFilter = channelKey;
            applyChannelFilter(channelKey);
        });
    });
}

function applyChannelFilter(channel) {
    const aisles = document.querySelectorAll('.svg-aisle-block');
    const docks = document.querySelectorAll('.svg-dock');

    if (channel === 'ALL') {
        aisles.forEach(a => a.style.opacity = '1');
        docks.forEach(d => d.style.opacity = '1');
        return;
    }

    // Filtrar según canal de entrega
    aisles.forEach(a => {
        const zone = a.getAttribute('data-zone');
        if (channel === 'ECOMMERCE' && (zone === 'ZONE-A' || zone === 'ZONE-C')) {
            a.style.opacity = '1';
        } else if (channel === 'RETAIL_STORES' && (zone === 'ZONE-B')) {
            a.style.opacity = '1';
        } else if (channel === 'MARKETPLACE' && (zone === 'ZONE-D' || zone === 'INBOUND')) {
            a.style.opacity = '1';
        } else {
            a.style.opacity = '0.2';
        }
    });

    docks.forEach(d => {
        const text = d.nextElementSibling ? d.nextElementSibling.textContent || '' : '';
        if (channel === 'ECOMMERCE' && text.includes('E-COM')) {
            d.style.opacity = '1';
        } else if (channel === 'RETAIL_STORES' && text.includes('TIENDAS')) {
            d.style.opacity = '1';
        } else if (channel === 'MARKETPLACE' && (text.includes('BULKY') || text.includes('CLICK'))) {
            d.style.opacity = '1';
        } else {
            d.style.opacity = '0.25';
        }
    });
}

/* ==========================================================================
   7. BUSCADOR DE SKU CON RADAR EN PLANO VECTORIAL
   ========================================================================== */
const localSkuCatalog = [
    {
        sku: 'SK-7001',
        name: "Smart TV OLED 65' 4K UHD",
        category: 'Electrónica / Pantallas',
        currentZone: 'ZONE-C',
        currentLocation: 'Pasillo C-04 (118 metros)',
        optimalZone: 'ZONE-A',
        optimalLocation: 'Pasillo A-02 (35 metros)',
        isMismatch: true,
        excessWalk: '18,4 km extras/semana',
        rotacion: 'Clase A (Top CyberDay)',
        humanBenefit: 'El operario deja de empujar transpaletas 200m ida y vuelta por un TV que se vende cada 8 minutos.',
        cx: 648,
        cy: 142
    },
    {
        sku: 'SK-7002',
        name: 'Refrigerador Side by Side 520L',
        category: 'Electrohogar Mayor',
        currentZone: 'ZONE-D',
        currentLocation: 'Rack Bulky D-02 (154 metros)',
        optimalZone: 'ZONE-D',
        optimalLocation: 'Rack Bulky D-02 + Mesa Tijera',
        isMismatch: false,
        excessWalk: '0 km (Correcto en Bulky)',
        rotacion: 'Clase B (Voluminoso)',
        humanBenefit: 'Mesa elevadora P5 permite deslizarlo a la transpaleta sin alzar 68 kg a pulso.',
        cx: 562,
        cy: 337
    },
    {
        sku: 'SK-7003',
        name: 'Set Sábanas 400 Hilos Queen',
        category: 'Textil Hogar',
        currentZone: 'ZONE-B',
        currentLocation: 'Pasillo B-05 (72 metros)',
        optimalZone: 'ZONE-A',
        optimalLocation: 'Pasillo A-01 (35 metros)',
        isMismatch: true,
        excessWalk: '6,2 km extras/semana',
        rotacion: 'Clase A (Alta Demanda)',
        humanBenefit: 'Al pasar a Pick Express, no requiere escaleras de tijera de altura en pasillo B.',
        cx: 105,
        cy: 364
    },
    {
        sku: 'SK-7004',
        name: 'Cafetera Espresso Barista Pro',
        category: 'Pequeño Electrodoméstico',
        currentZone: 'ZONE-A',
        currentLocation: 'Pasillo A-01 (35 metros)',
        optimalZone: 'ZONE-A',
        optimalLocation: 'Pasillo A-01 (35 metros)',
        isMismatch: false,
        excessWalk: '0 km (Ubicación Ideal)',
        rotacion: 'Clase A (Flujo Rápido)',
        humanBenefit: 'Ubicación ejemplar: a 35m de despacho. Recogida en 45 segundos con Voice Picking.',
        cx: 91,
        cy: 142
    },
    {
        sku: 'SK-7005',
        name: 'Colchón King Size Memory Foam',
        category: 'Dormitorio Pesado',
        currentZone: 'ZONE-C',
        currentLocation: 'Pasillo C-02 (118 metros)',
        optimalZone: 'ZONE-D',
        optimalLocation: 'Rack Bulky D-01 (154 metros con rampa)',
        isMismatch: true,
        excessWalk: '12,6 km extras/semana',
        rotacion: 'Clase C (Pesado Mal Ubicado)',
        humanBenefit: 'Estaba bloqueando pasillo angosto en Zona C. En Zona D cuenta con ancho de 4m para grúas.',
        cx: 543,
        cy: 173
    },
    {
        sku: 'SK-7006',
        name: 'Taladro Percutor Inalámbrico 20V',
        category: 'Herramientas',
        currentZone: 'ZONE-D',
        currentLocation: 'Rack Bulky D-03 (154 metros)',
        optimalZone: 'ZONE-A',
        optimalLocation: 'Pasillo A-04 (35 metros)',
        isMismatch: true,
        excessWalk: '14,2 km extras/semana',
        rotacion: 'Clase A (Liviano en Zona Pesada)',
        humanBenefit: 'Un producto de 2,4 kg estaba asignado a rack de 1 tonelada. Se reasigna a pasillo peatonal.',
        cx: 562,
        cy: 369
    }
];

function initSkuSearch() {
    const input = document.getElementById('sku-search-input');
    const clearBtn = document.getElementById('btn-clear-sku');
    const popup = document.getElementById('sku-popup-card');

    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            clearSkuSearch();
            return;
        }

        if (clearBtn) clearBtn.style.display = 'block';

        const found = localSkuCatalog.find(item => 
            item.sku.toLowerCase().includes(query) || 
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        if (found) {
            renderSkuMatch(found);
        } else if (popup) {
            popup.style.display = 'block';
            popup.innerHTML = `
                <div style="font-size: 0.8rem; color: #94a3b8; text-align: center;">
                    No se encontró SKU que coincida con "${input.value}".<br>
                    Prueba con: <strong>SK-7001, SK-7002, Cafetera, Colchón</strong>.
                </div>
            `;
            removeRadarPulse();
        }
    });

    window.clearSkuSearch = function() {
        if (input) input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (popup) {
            popup.style.display = 'none';
            popup.innerHTML = '';
        }
        removeRadarPulse();
    };
}

function renderSkuMatch(skuItem) {
    const popup = document.getElementById('sku-popup-card');
    if (!popup) return;

    popup.style.display = 'block';
    popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #38bdf8; font-weight: 800;">${skuItem.sku}</span>
                <h5 style="font-size: 0.88rem; font-weight: 800; color: #fff; margin-top: 2px;">${skuItem.name}</h5>
                <span style="font-size: 0.72rem; color: #94a3b8;">${skuItem.category} &bull; ${skuItem.rotacion}</span>
            </div>
            <span style="font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; ${skuItem.isMismatch ? 'background: rgba(244,63,94,0.2); color: #f43f5e; border: 1px solid rgba(244,63,94,0.4);' : 'background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4);'}">
                ${skuItem.isMismatch ? '🚨 MISMATCH SLOTTING' : '✓ ALINEADO'}
            </span>
        </div>
        <div style="font-size: 0.75rem; color: #cbd5e1; margin-bottom: 8px; line-height: 1.4;">
            <div><strong>Ubicación Actual:</strong> <span style="color: #f43f5e;">${skuItem.currentLocation}</span></div>
            <div><strong>Ubicación Óptima (P1):</strong> <span style="color: #34d399;">${skuItem.optimalLocation}</span></div>
            <div><strong>Desperdicio:</strong> ${skuItem.excessWalk}</div>
        </div>
        <div style="background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38bdf8; padding: 6px 8px; font-size: 0.73rem; color: #93c5fd; border-radius: 4px;">
            <strong>Impacto Humano:</strong> ${skuItem.humanBenefit}
        </div>
    `;

    // Seleccionar zona en el plano
    select2DZone(skuItem.currentZone);

    // Activar radar visual sobre las coordenadas
    triggerRadarPulse(skuItem.cx, skuItem.cy);
}

function triggerRadarPulse(cx, cy) {
    removeRadarPulse();
    const svg = document.getElementById('warehouse-2d-svg');
    if (!svg) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', 'sku-radar-group');

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', '14');
    ring.setAttribute('class', 'radar-pulse-ring');

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', cx);
    dot.setAttribute('cy', cy);
    dot.setAttribute('r', '6');
    dot.setAttribute('fill', '#38bdf8');

    g.appendChild(ring);
    g.appendChild(dot);
    svg.appendChild(g);
}

function removeRadarPulse() {
    const existing = document.getElementById('sku-radar-group');
    if (existing) existing.remove();
}

/* ==========================================================================
   8. TOGGLE DE CAPAS VISUALES EN PLANO 2D
   ========================================================================== */
const layerStates = {
    paths: true,
    mismatch: true,
    docks: true,
    crossdock: true
};

function initLayerToggles() {
    window.toggleLayer = function(layerName) {
        layerStates[layerName] = !layerStates[layerName];
        const isActive = layerStates[layerName];

        const btn = document.getElementById(`toggle-layer-${layerName}`);
        if (btn) {
            if (isActive) btn.classList.add('active');
            else btn.classList.remove('active');
        }

        if (layerName === 'paths') {
            const floorPaths = document.getElementById('svg-floor-paths');
            if (floorPaths) floorPaths.style.display = isActive ? 'block' : 'none';
        } else if (layerName === 'mismatch') {
            const pins = document.querySelectorAll('.svg-mismatch-pin');
            pins.forEach(p => p.style.display = isActive ? 'block' : 'none');
        } else if (layerName === 'docks') {
            const inb = document.getElementById('svg-inbound-group');
            const outb = document.getElementById('svg-packing-outbound-group');
            if (inb) inb.style.opacity = isActive ? '1' : '0.15';
            if (outb) outb.style.opacity = isActive ? '1' : '0.15';
        } else if (layerName === 'crossdock') {
            const cdGroup = document.getElementById('svg-crossdock-group');
            if (cdGroup) cdGroup.style.display = isActive ? 'block' : 'none';
        }
    };
}

/* ==========================================================================
   9. TOOLTIP FLOTANTE (HOVER CARD) EN SVG
   ========================================================================== */
function initSvgHoverCards() {
    const hoverCard = document.getElementById('svg-hover-card');
    const svg = document.getElementById('warehouse-2d-svg');
    if (!hoverCard || !svg) return;

    const interactiveNodes = svg.querySelectorAll('.svg-aisle-block, .svg-dock, .svg-mismatch-pin');

    interactiveNodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const zoneKey = node.getAttribute('data-zone');
            let title = 'Ubicación CD Pudahuel';
            let sub = 'Haz clic para inspeccionar detalles';

            if (zoneKey && layout2DData[zoneKey]) {
                title = layout2DData[zoneKey].title;
                sub = `${layout2DData[zoneKey].badge} | Productividad: ${layout2DData[zoneKey].prod}`;
            } else if (node.classList.contains('svg-mismatch-pin')) {
                title = '🚨 114 SKUs Desalineados';
                sub = 'Generan 67,6 km/día de caminata desperdiciada';
            }

            hoverCard.innerHTML = `
                <div class="hc-title">${title}</div>
                <div class="hc-sub">${sub}</div>
                <div style="font-size: 0.68rem; color: #38bdf8; font-weight: 700;">Click: Abrir inspector y datos humanos</div>
            `;
            hoverCard.style.display = 'block';
        });

        node.addEventListener('mousemove', (e) => {
            const x = e.clientX + 14;
            const y = e.clientY + 14;
            hoverCard.style.left = `${x}px`;
            hoverCard.style.top = `${y}px`;
        });

        node.addEventListener('mouseleave', () => {
            hoverCard.style.display = 'none';
        });
    });
}

/* ==========================================================================
   10. SIMULADOR DIDÁCTICO DEL PORTAFOLIO EN VIVO (SANDBOX 2D)
   ========================================================================== */
const projectData2D = {
    'p1': { name: 'P1: Re-slotting ABC + 5S', capex: 85000000, opex: 12000000, savings: 215000000, otifGain: 12.0 },
    'p2': { name: 'P2: WMS NextGen + Voice RF', capex: 310000000, opex: 75000000, savings: 385000000, otifGain: 18.5 },
    'p3': { name: 'P3: Portal ASN & YMS Citas', capex: 95000000, opex: 24000000, savings: 170000000, otifGain: 8.0 },
    'p4': { name: 'P4: TMS Ruteo Dinámico', capex: 150000000, opex: 48000000, savings: 280000000, otifGain: 11.2 },
    'p5': { name: 'P5: Ergonomía D-Bulky', capex: 70000000, opex: 18000000, savings: 63097000, otifGain: 3.0 },
    'p6': { name: 'P6: Flota Robots AMR', capex: 420000000, opex: 65000000, savings: 180000000, otifGain: 4.0 },
    'p7': { name: 'P7: Planta Solar CD', capex: 180000000, opex: 8000000, savings: 55000000, otifGain: 0.5 }
};

function initSandboxSimulator() {
    const checkboxes = document.querySelectorAll('.p-item-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const parent = cb.closest('.project-item-2d');
            if (cb.checked) {
                if (parent) parent.classList.add('checked');
            } else {
                if (parent) parent.classList.remove('checked');
            }
            recalculate2DSandbox();
        });
    });
    recalculate2DSandbox();
}

function recalculate2DSandbox() {
    const checkedCheckboxes = document.querySelectorAll('.p-item-checkbox:checked');
    const selectedIds = Array.from(checkedCheckboxes).map(cb => cb.getAttribute('data-proj'));

    // Si AndesHomeStore está disponible, usamos su motor de cálculo canónico
    if (typeof AndesHomeStore !== 'undefined' && AndesHomeStore.calculatePortfolio) {
        const result = AndesHomeStore.calculatePortfolio(selectedIds);
        renderSandboxResults({
            capexTotal: result.totalCapex,
            maxBudget: result.budgetCeiling,
            finalOtif: result.projectedOtif,
            ebitda: result.netAnnualEbitda,
            van: result.npv,
            payback: result.paybackMonths
        });
        return;
    }

    // Cálculo fallback local
    let totalCapex = 0;
    let totalOpex = 0;
    let totalSavings = 0;
    let otifAccum = 43.5;

    selectedIds.forEach(id => {
        const proj = projectData2D[id];
        if (proj) {
            totalCapex += proj.capex;
            totalOpex += proj.opex;
            totalSavings += proj.savings;
            otifAccum += proj.otifGain;
        }
    });

    const capexTotal = totalCapex * 1.08; // 8% contingencia
    const maxBudget = 850000000;
    const ebitda = totalSavings - totalOpex;
    const finalOtif = Math.min(96.8, otifAccum);

    let van = -capexTotal;
    for (let t = 1; t <= 3; t++) {
        van += ebitda / Math.pow(1.12, t);
    }
    const payback = ebitda > 0 ? (capexTotal / ebitda) * 12 : 99;

    renderSandboxResults({
        capexTotal,
        maxBudget,
        finalOtif,
        ebitda,
        van,
        payback
    });
}

function renderSandboxResults({ capexTotal, maxBudget, finalOtif, ebitda, van, payback }) {
    const capexValEl = document.getElementById('sand-capex-2d');
    const capexBarEl = document.getElementById('sand-capex-bar-2d');
    const otifValEl = document.getElementById('sand-otif-2d');
    const otifBarEl = document.getElementById('sand-otif-bar-2d');
    const ebitdaValEl = document.getElementById('sand-ebitda-2d');
    const vanValEl = document.getElementById('sand-van-2d');
    const paybackValEl = document.getElementById('sand-payback-2d');

    if (capexValEl) {
        capexValEl.innerText = '$' + Math.round(capexTotal / 1000000) + 'M CLP';
        if (capexTotal > maxBudget) {
            capexValEl.style.color = '#f43f5e';
            if (capexBarEl) capexBarEl.style.backgroundColor = '#f43f5e';
        } else {
            capexValEl.style.color = '#fff';
            if (capexBarEl) capexBarEl.style.backgroundColor = '#10b981';
        }
    }

    if (capexBarEl) {
        capexBarEl.style.width = Math.min(100, (capexTotal / maxBudget) * 100) + '%';
    }

    if (otifValEl) otifValEl.innerText = finalOtif.toFixed(1) + '%';
    if (otifBarEl) {
        otifBarEl.style.width = Math.min(100, finalOtif) + '%';
        otifBarEl.style.backgroundColor = finalOtif >= 96 ? '#10b981' : (finalOtif >= 80 ? '#38bdf8' : '#f43f5e');
    }

    if (ebitdaValEl) ebitdaValEl.innerText = '$' + Math.round(ebitda / 1000000) + 'M/año';
    if (vanValEl) vanValEl.innerText = '$' + Math.round(van / 1000000) + 'M';
    if (paybackValEl) paybackValEl.innerText = payback < 90 ? payback.toFixed(1) + ' meses' : '> 5 años';
}

/* ==========================================================================
   11. ATAJOS DE TECLADO GLOBALES
   ========================================================================== */
function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        const keynoteModal = document.getElementById('keynote-2d-modal');
        const isKeynoteActive = keynoteModal && keynoteModal.classList.contains('active');

        // Si el usuario está escribiendo en el buscador de SKU, no interceptamos flechas o letras
        if (e.target && e.target.id === 'sku-search-input') {
            if (e.key === 'Escape') {
                window.clearSkuSearch();
                e.target.blur();
            }
            return;
        }

        // Si la presentación Keynote está activa, Keynote maneja las teclas
        if (isKeynoteActive) return;

        if (e.key === '1') {
            window.setMasterPhase(1);
        } else if (e.key === '2') {
            window.setMasterPhase(2);
        } else if (e.key === '3') {
            window.setMasterPhase(3);
        } else if (e.key === 'ArrowRight') {
            window.nextMasterPhase();
        } else if (e.key === 'ArrowLeft') {
            window.prevMasterPhase();
        } else if (e.key.toLowerCase() === 'c') {
            setMode2D('crisis');
        } else if (e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'o') {
            setMode2D('optimized');
        } else if (e.key.toLowerCase() === 'f') {
            const input = document.getElementById('sku-search-input');
            if (input) {
                e.preventDefault();
                input.focus();
            }
        }
    });
}

/* ==========================================================================
   12. PRESENTACIÓN KEYNOTE 2D INTERACTIVA
   ========================================================================== */
let keynoteSlideIndex = 1;
const keynoteTotal = 5;

const slideZoneDirectives = {
    1: { zone: 'all', mode: 'crisis', tab: 'view-layout' },
    2: { zone: 'ZONE-C', mode: 'crisis', tab: 'view-layout' },
    3: { zone: 'INBOUND', mode: 'optimized', tab: 'view-inbound' },
    4: { zone: 'OUTBOUND', mode: 'optimized', tab: 'view-apqc' },
    5: { zone: 'all', mode: 'optimized', tab: 'view-priorizacion' }
};

function initKeynoteModal2D() {
    window.openKeynote2D = function(index = 1) {
        const modal = document.getElementById('keynote-2d-modal');
        if (modal) {
            modal.classList.add('active');
            keynoteSlideIndex = index;
            renderKeynoteSlide2D();
        }
    };

    window.closeKeynote2D = function() {
        const modal = document.getElementById('keynote-2d-modal');
        if (modal) modal.classList.remove('active');
    };

    window.changeKeynote2D = function(step) {
        keynoteSlideIndex += step;
        if (keynoteSlideIndex < 1) keynoteSlideIndex = 1;
        if (keynoteSlideIndex > keynoteTotal) keynoteSlideIndex = keynoteTotal;
        renderKeynoteSlide2D();
    };

    window.addEventListener('keydown', (e) => {
        const modal = document.getElementById('keynote-2d-modal');
        if (!modal || !modal.classList.contains('active')) return;

        if (e.key === 'ArrowRight' || e.key === ' ') {
            window.changeKeynote2D(1);
        } else if (e.key === 'ArrowLeft') {
            window.changeKeynote2D(-1);
        } else if (e.key === 'Escape') {
            window.closeKeynote2D();
        }
    });
}

function renderKeynoteSlide2D() {
    for (let i = 1; i <= keynoteTotal; i++) {
        const slide = document.getElementById(`kn2d-slide-${i}`);
        if (slide) slide.classList.remove('active');
    }
    const active = document.getElementById(`kn2d-slide-${keynoteSlideIndex}`);
    if (active) active.classList.add('active');

    const ind = document.getElementById('kn2d-ind');
    if (ind) ind.innerText = `Diapositiva ${keynoteSlideIndex} de ${keynoteTotal}`;

    // Sincronizar plano 2D y tabs
    const directive = slideZoneDirectives[keynoteSlideIndex];
    if (directive) {
        if (directive.tab) {
            const tabBtn = document.querySelector(`.diag-tab-btn[data-view="${directive.tab}"]`);
            if (tabBtn) tabBtn.click();
        }
        setMode2D(directive.mode);
        if (directive.zone !== 'all') {
            select2DZone(directive.zone);
        }
    }
}

/* ==========================================================================
   13. NUEVAS HERRAMIENTAS DIDÁCTICAS E INTERACTIVAS (FASES 1, 2 Y 3)
   ========================================================================== */

function initDidacticTools() {
    // Inicializar sliders didácticos si existen en DOM
    if (document.getElementById('apqc-slider-ot')) {
        window.calculateLiveApqc();
    }
    if (document.getElementById('mismatch-range-slider')) {
        window.onMismatchSliderChange(document.getElementById('mismatch-range-slider').value);
    }
}

/* --- FASE 1: Selector Didáctico de Turnos Operacionales --- */
window.setOperationalShift = function(shift) {
    const morningBtn = document.getElementById('shift-btn-morning');
    const afternoonBtn = document.getElementById('shift-btn-afternoon');
    const nightBtn = document.getElementById('shift-btn-night');
    const descEl = document.getElementById('shift-status-desc');
    const svgEl = document.getElementById('warehouse-2d-svg');

    [morningBtn, afternoonBtn, nightBtn].forEach(b => { if (b) b.classList.remove('active'); });

    if (svgEl) {
        if (shift === 'night') {
            svgEl.classList.add('night-shift-mode');
        } else {
            svgEl.classList.remove('night-shift-mode');
        }
    }

    if (shift === 'morning') {
        if (morningBtn) morningBtn.classList.add('active');
        if (descEl) descEl.innerHTML = '<strong>🌅 Turno Mañana (07:00 - 15:00):</strong> Alta demanda de recepción en Inbound (120 camiones/semana). Pick Express en Zona A a máxima velocidad (46,8 lín/HH). Dotación al 100% (personal propio).';
        if (typeof select2DZone === 'function') select2DZone('INBOUND');
    } else if (shift === 'afternoon') {
        if (afternoonBtn) afternoonBtn.classList.add('active');
        if (descEl) descEl.innerHTML = '<strong>☀️ Turno Tarde (15:00 - 23:00):</strong> Ola principal de picking masivo en Zonas A y B. Preparación y consolidación de despachos para carriers. Personal mixto (propio + 42 temporales).';
        if (typeof select2DZone === 'function') select2DZone('ZONE-A');
    } else if (shift === 'night') {
        if (nightBtn) nightBtn.classList.add('active');
        if (descEl) descEl.innerHTML = '<strong>🌙 Turno Noche (23:00 - 07:00):</strong> Putaway en altura y reposición pesada en Zona C y D. Fatiga física crítica: 14 km caminados por operario hacia Zona C por slotting mismatch y mayor riesgo de incidentes SST.';
        if (typeof select2DZone === 'function') select2DZone('ZONE-C');
    }
};

/* --- FASE 1: Simulador Causa-Efecto de Desbalance de Pasillos --- */
window.onMismatchSliderChange = function(val) {
    const intVal = parseInt(val, 10);
    const countEl = document.getElementById('mismatch-slider-count');
    const kmEl = document.getElementById('ce-metric-km');
    const hhEl = document.getElementById('ce-metric-hh');
    const costEl = document.getElementById('ce-metric-cost');

    if (countEl) countEl.innerText = intVal;

    // Proporción de 0 a 114
    const ratio = Math.max(0, Math.min(1, intVal / 114));

    // Base To-Be: 14.2 km / 4.9 HH / $0M costo sobreestadía/extra
    // Crisis As-Is: 67.6 km / 23.5 HH / $54.8M
    const km = (14.2 + ratio * (67.6 - 14.2)).toFixed(1);
    const hh = (4.9 + ratio * (23.5 - 4.9)).toFixed(1);
    const cost = Math.round(ratio * 54.8);

    if (kmEl) kmEl.innerText = km + ' km';
    if (hhEl) hhEl.innerText = hh + ' HH';
    if (costEl) costEl.innerText = '$' + cost + 'M';

    // Dinamizar el plano SVG si existe el espagueti
    const spaghetti = document.getElementById('svg-path-spaghetti');
    if (spaghetti) {
        spaghetti.style.opacity = (0.15 + ratio * 0.85).toString();
        spaghetti.style.strokeWidth = (2 + ratio * 3).toString();
    }
};

window.setMismatchSliderValue = function(val) {
    const slider = document.getElementById('mismatch-range-slider');
    if (slider) {
        slider.value = val;
        window.onMismatchSliderChange(val);
    }
};

/* --- FASE 1: Calculadora Didáctica Interactiva del Pedido Perfecto (APQC) --- */
window.calculateLiveApqc = function() {
    const sOt = document.getElementById('apqc-slider-ot');
    const sIf = document.getElementById('apqc-slider-if');
    const sDf = document.getElementById('apqc-slider-df');
    const sIa = document.getElementById('apqc-slider-ia');

    const vOt = sOt ? parseFloat(sOt.value) : 63.8;
    const vIf = sIf ? parseFloat(sIf.value) : 78.4;
    const vDf = sDf ? parseFloat(sDf.value) : 91.2;
    const vIa = sIa ? parseFloat(sIa.value) : 91.8;

    const elOt = document.getElementById('apqc-val-ot');
    const elIf = document.getElementById('apqc-val-if');
    const elDf = document.getElementById('apqc-val-df');
    const elIa = document.getElementById('apqc-val-ia');

    if (elOt) elOt.innerText = vOt.toFixed(1) + '%';
    if (elIf) elIf.innerText = vIf.toFixed(1) + '%';
    if (elDf) elDf.innerText = vDf.toFixed(1) + '%';
    if (elIa) elIa.innerText = vIa.toFixed(1) + '%';

    // Pedido Perfecto APQC = (OT/100 * IF/100 * DF/100 * IA/100) * 100
    const perfectScore = (vOt / 100) * (vIf / 100) * (vDf / 100) * (vIa / 100) * 100;

    const scoreEl = document.getElementById('apqc-live-score');
    const badgeEl = document.getElementById('apqc-score-badge');
    const textEl = document.getElementById('apqc-interpret-text');

    if (scoreEl) scoreEl.innerText = perfectScore.toFixed(1) + '%';

    if (badgeEl && textEl) {
        if (perfectScore < 60) {
            badgeEl.innerText = '🔴 Colapso Crítico (Nivel CyberDay)';
            badgeEl.style.background = 'rgba(244, 63, 94, 0.2)';
            badgeEl.style.color = '#f43f5e';
            badgeEl.style.borderColor = 'rgba(244, 63, 94, 0.4)';
            textEl.innerText = 'El efecto multiplicador de fallas derrumba la experiencia del cliente: menos de la mitad de los pedidos llegan a tiempo, completos, sin daño y bien facturados.';
        } else if (perfectScore < 85) {
            badgeEl.innerText = '🟡 Rendimiento Medio / Operación Típica';
            badgeEl.style.background = 'rgba(245, 158, 11, 0.2)';
            badgeEl.style.color = '#fbbf24';
            badgeEl.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            textEl.innerText = 'Operación funcional pero con fricciones constantes que aumentan reclamos al call center y costos de reenvío.';
        } else {
            badgeEl.innerText = '🟢 Clase Mundial (Benchmark APQC)';
            badgeEl.style.background = 'rgba(16, 185, 129, 0.2)';
            badgeEl.style.color = '#34d399';
            badgeEl.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            textEl.innerText = 'Nivel de excelencia logística de clase mundial. Fidelización de clientes omnicanal, cero retrabajo y rentabilidad máxima.';
        }
    }
};

window.setApqcPreset = function(ot, inFull, df, ia) {
    const sOt = document.getElementById('apqc-slider-ot');
    const sIf = document.getElementById('apqc-slider-if');
    const sDf = document.getElementById('apqc-slider-df');
    const sIa = document.getElementById('apqc-slider-ia');

    if (sOt) sOt.value = ot;
    if (sIf) sIf.value = inFull;
    if (sDf) sDf.value = df;
    if (sIa) sIa.value = ia;

    window.calculateLiveApqc();
};

/* --- FASE 2: Presets Rápidos para el Sandbox Financiero --- */
window.applyPortfolioPreset = function(preset) {
    const p1 = document.getElementById('chk-p1');
    const p2 = document.getElementById('chk-p2');
    const p3 = document.getElementById('chk-p3');
    const p4 = document.getElementById('chk-p4');
    const p5 = document.getElementById('chk-p5');
    const p6 = document.getElementById('chk-p6');

    const btnOpt = document.getElementById('preset-pill-optimal');
    const btnQw = document.getElementById('preset-pill-quickwins');
    const btnOb = document.getElementById('preset-pill-overbudget');

    [btnOpt, btnQw, btnOb].forEach(b => { if (b) b.classList.remove('active'); });

    if (preset === 'optimal') {
        if (btnOpt) btnOpt.classList.add('active');
        if (p1) p1.checked = true;
        if (p2) p2.checked = true;
        if (p3) p3.checked = true;
        if (p4) p4.checked = true;
        if (p5) p5.checked = true;
        if (p6) p6.checked = false;
    } else if (preset === 'quickwins') {
        if (btnQw) btnQw.classList.add('active');
        if (p1) p1.checked = true;
        if (p2) p2.checked = false;
        if (p3) p3.checked = false;
        if (p4) p4.checked = false;
        if (p5) p5.checked = true;
        if (p6) p6.checked = false;
    } else if (preset === 'overbudget') {
        if (btnOb) btnOb.classList.add('active');
        if (p1) p1.checked = true;
        if (p2) p2.checked = true;
        if (p3) p3.checked = true;
        if (p4) p4.checked = true;
        if (p5) p5.checked = true;
        if (p6) p6.checked = true;
    }

    if (typeof calculateCustomPortfolio === 'function') {
        calculateCustomPortfolio();
    }
};

/* --- FASE 2: WBS Interactivo con Resaltado en Plano 2D --- */
const wbsPhasesData = {
    1: {
        title: 'Fase 1: Preparación, Re-slotting ABC & Quick Wins (Semanas 01 a 04)',
        desc: 'Extracción física de los 12 SKU de alta demanda de Zona C a Zona A. Limpieza de maestras de artículos y reconfiguración de perfiles ergonómicos en racks.',
        zone: 'ZONE-A',
        badge: 'CAPEX: $35M | Impacto Inmediato: -35% Recorridos',
        risk: 'Bajo riesgo operacional. Ejecución nocturna sin detener la operación diaria.'
    },
    2: {
        title: 'Fase 2: Infraestructura, Portal ASN & Ergonomía SST (Semanas 05 a 12)',
        desc: 'Despliegue del Portal ASN para proveedores y citas de andén YMS. Instalación de las 4 mesas hidráulicas en Zona D y transpaletas eléctricas.',
        zone: 'INBOUND',
        badge: 'CAPEX: $240M | Eliminación Sobrecargos Demurrage & Ley 20.949',
        risk: 'Medio. Requiere coordinación estrecha con los 30 proveedores principales.'
    },
    3: {
        title: 'Fase 3: Voice Picking WMS, TMS Ruteo & Integraciones (Semanas 13 a 20)',
        desc: 'Puesta en marcha de auriculares Voice Picking Honeywell y algoritmo TMS con cubicaje 3D dinámico. Pruebas de integración con ERP SAP.',
        zone: 'ZONE-B',
        badge: 'CAPEX: $445M | Productividad +18% y Entregas Fallidas <3%',
        risk: 'Crítico. Requiere modelo de gestión de cambio ADKAR con los 18 superusuarios.'
    },
    4: {
        title: 'Fase 4: Estabilización, Certificación & IT FREEZE (Semanas 21 a 24)',
        desc: 'Congelamiento estricto de cambios (IT Freeze) 4 semanas antes del CyberDay Noviembre 2026. Auditoría integral de procesos y simulacros de estrés a 4.000 pedidos/día.',
        zone: 'OUTBOUND',
        badge: 'ESTABILIZACIÓN | Garantía 96,2% OTIF',
        risk: '🛑 PROHIBIDO realizar despliegues de software o cambios de layout durante esta fase.'
    }
};

window.highlightWbsPhase = function(phaseNum) {
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`wbs-step-${i}`);
        if (stepEl) {
            if (i === phaseNum) stepEl.classList.add('active');
            else stepEl.classList.remove('active');
        }
    }

    const detailBox = document.getElementById('wbs-phase-detail-box');
    const phaseInfo = wbsPhasesData[phaseNum];
    if (detailBox && phaseInfo) {
        detailBox.style.display = 'block';
        detailBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;">
                <div>
                    <span style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">WBS GANTT INTERACTIVO &bull; FASE ${phaseNum}</span>
                    <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin: 4px 0;">${phaseInfo.title}</h4>
                </div>
                <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 0.72rem; padding: 4px 10px; border-radius: 6px; font-weight: 700;">
                    ${phaseInfo.badge}
                </span>
            </div>
            <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 8px;">${phaseInfo.desc}</p>
            <div style="font-size: 0.76rem; color: #fbbf24; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); padding: 6px 10px; border-radius: 6px;">
                <strong>Nota de Gestión:</strong> ${phaseInfo.risk}
            </div>
        `;
        if (phaseInfo.zone && typeof select2DZone === 'function') {
            select2DZone(phaseInfo.zone);
        }
    }
};

/* --- FASE 3: Selector Didáctico de Transformación Before / After --- */
window.toggleTransformationView = function(state) {
    const btnBefore = document.getElementById('transf-btn-before');
    const btnAfter = document.getElementById('transf-btn-after');

    const kpiOtif = document.getElementById('transf-kpi-otif');
    const subOtif = document.getElementById('transf-sub-otif');

    const kpiBacklog = document.getElementById('transf-kpi-backlog');
    const subBacklog = document.getElementById('transf-sub-backlog');

    const kpiVan = document.getElementById('transf-kpi-van');
    const subVan = document.getElementById('transf-sub-van');

    const kpiKm = document.getElementById('transf-kpi-km');
    const subKm = document.getElementById('transf-sub-km');

    if (state === 'before') {
        if (btnBefore) btnBefore.classList.add('active');
        if (btnAfter) btnAfter.classList.remove('active');

        if (kpiOtif) { kpiOtif.innerText = '43,5%'; kpiOtif.style.color = '#f43f5e'; }
        if (subOtif) { subOtif.innerText = 'Colapso de entregas (Click & Collect 11,5%)'; subOtif.style.color = '#fda4af'; }

        if (kpiBacklog) { kpiBacklog.innerText = '15.387 Pedidos'; kpiBacklog.style.color = '#f43f5e'; }
        if (subBacklog) { subBacklog.innerText = '4,32 días de demanda represada'; subBacklog.style.color = '#fda4af'; }

        if (kpiVan) { kpiVan.innerText = '-$458M'; kpiVan.style.color = '#f43f5e'; }
        if (subVan) { subVan.innerText = 'Pérdidas operacionales y multas SERNAC'; subVan.style.color = '#fda4af'; }

        if (kpiKm) { kpiKm.innerText = '67,6 km'; kpiKm.style.color = '#f43f5e'; }
        if (subKm) { subKm.innerText = 'Fatiga extrema y 53 días de licencias SST'; subKm.style.color = '#fda4af'; }

        if (typeof setMode2D === 'function') setMode2D('crisis');
    } else {
        if (btnAfter) btnAfter.classList.add('active');
        if (btnBefore) btnBefore.classList.remove('active');

        if (kpiOtif) { kpiOtif.innerText = '96,2%'; kpiOtif.style.color = '#34d399'; }
        if (subOtif) { subOtif.innerText = '+52,7 pp vs Crisis (Base: 43,5%)'; subOtif.style.color = '#a7f3d0'; }

        if (kpiBacklog) { kpiBacklog.innerText = '0 Pedidos'; kpiBacklog.style.color = '#38bdf8'; }
        if (subBacklog) { subBacklog.innerText = '15.387 pedidos represados erradicados'; subBacklog.style.color = '#bae6fd'; }

        if (kpiVan) { kpiVan.innerText = '$1.289M'; kpiVan.style.color = '#c084fc'; }
        if (subVan) { subVan.innerText = 'Payback 10,7 meses • TIR 98,4%'; subVan.style.color = '#e9d5ff'; }

        if (kpiKm) { kpiKm.innerText = '14,2 km'; kpiKm.style.color = '#fbbf24'; }
        if (subKm) { subKm.innerText = '-79% fatiga física (Base: 67,6 km)'; subKm.style.color = '#fde68a'; }

        if (typeof setMode2D === 'function') setMode2D('optimized');
    }
};

/* ==========================================================================
   10. CALCULADORA DE RACKS & LAYOUT 2D (SKU MASTER OFICIAL 450 SKUS)
   ========================================================================== */

const rackCalcState = {
    scenario: 'tobe',         // 'asis' | 'tobe'
    levels: 5,                // 3, 4, 5, 6 niveles
    palletsPerBeam: 2,        // 2 o 3 pallets por viga
    targetOccupancy: 85,      // 70% a 95%
    filterMismatch: 'all',    // 'all' | 'mismatches' | 'rescued'
    filterZone: 'all',        // 'all' | 'A-Rápida' | 'B-Media' | 'C-Lenta' | 'D-Bulky'
    filterAbc: 'all',         // 'all' | 'A' | 'B' | 'C'
    filterFam: 'all',         // 'all' | Familia
    searchQuery: '',
    page: 1,
    pageSize: 15,
    selectedAisle: null
};

// Datos base de zonas de planta AndesHome Pudahuel
const RACK_ZONES_CONFIG = {
    'A-Rápida': {
        name: 'Zona A-Rápida',
        func: 'Picking Express (Alta Rotación)',
        aisles: ['A01', 'A02', 'A03', 'A04', 'A05', 'A06'],
        area: 5200,
        dist: 35,
        cap_pos: 3900,
        asis_pos: 3720,
        tobe_pos: 3120,
        asis_skus: 84,
        tobe_skus: 105,
        color_asis: '#ef4444',
        color_tobe: '#10b981',
        diag_asis: '❌ Colapso al 95,4%: Pasillos A03-A05 bloqueados por carros; operarios esperando turno para poder pasar.',
        diag_tobe: '✅ Flujo ágil al 80,0%: 105 productos estrella al lado del despacho (a 35 m); pedidos armados en minutos.'
    },
    'B-Media': {
        name: 'Zona B-Media',
        func: 'Picking Estándar (Media Rotación)',
        aisles: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12'],
        area: 6100,
        dist: 72,
        cap_pos: 4700,
        asis_pos: 4380,
        tobe_pos: 3850,
        asis_skus: 125,
        tobe_skus: 120,
        color_asis: '#f59e0b',
        color_tobe: '#06b6d4',
        diag_asis: '⚠️ Tensión al 93,2%: Reabastecimiento tarde y constante freno de pedidos por falta de stock a mano.',
        diag_tobe: '✅ Ritmo estable al 81,9%: Reposición programada en olas (Wave Picking) con 850 espacios de holgura.'
    },
    'C-Lenta': {
        name: 'Zona C-Lenta',
        func: 'Almacenamiento Lenta Rotación',
        aisles: ['C01', 'C02', 'C03', 'C04', 'C05', 'C06'],
        area: 7200,
        dist: 118,
        cap_pos: 5800,
        asis_pos: 5260,
        tobe_pos: 4450,
        asis_skus: 154,
        tobe_skus: 147,
        color_asis: '#eab308',
        color_tobe: '#10b981',
        diag_asis: '❌ Ineficiencia al 90,7%: 12 productos súper vendidos estaban atrapados al fondo (118 m), agotando a los pickers.',
        diag_tobe: '✅ Alivio al 76,7%: Los 12 productos clave fueron rescatados a Zona A; la zona C queda para stock de baja rotación.'
    },
    'D-Bulky': {
        name: 'Zona D-Bulky',
        func: 'Cargas Pesadas y Voluminosas',
        aisles: ['D01', 'D02', 'D03'],
        area: 4900,
        dist: 154,
        cap_pos: 2500,
        asis_pos: 2360,
        tobe_pos: 2060,
        asis_skus: 87,
        tobe_skus: 78,
        color_asis: '#ef4444',
        color_tobe: '#34d399',
        diag_asis: '🚨 Peligro al 94,4%: Muebles y línea blanca pesada en altura; alto riesgo de caídas y sobreesfuerzo físico.',
        diag_tobe: '✅ Seguridad total al 82,4%: Todo producto pesado (>15 kg) estibado a nivel de suelo/nivel 1 cumpliendo Ley 20.949.'
    }
};

/* Inicializador Global del Calculador de Racks */
function initRackCalculator() {
    if (typeof ANDES_SKU_MASTER === 'undefined' || typeof ANDES_LAYOUT_CAPACITY === 'undefined') {
        console.warn('Advertencia: Base de datos maestra SKU no detectada.');
        return;
    }

    calculateRackMetrics();
    renderRackFloorplan();
    renderRackElevation();
    renderRackMatrixTable();
    renderSkuMasterTable();

    // Re-renderizar si la pestaña de racks se vuelve visible
    const racksTabBtn = document.getElementById('tab-btn-racks');
    if (racksTabBtn) {
        racksTabBtn.addEventListener('click', () => {
            setTimeout(() => {
                renderRackFloorplan();
                renderRackElevation();
            }, 50);
        });
    }
}

/* 1. Cálculo de Métricas y KPIs de Racks */
function calculateRackMetrics() {
    const modCap = rackCalcState.levels * rackCalcState.palletsPerBeam;
    const beamLen = rackCalcState.palletsPerBeam === 2 ? 2.70 : 3.30;
    const totalInstalledPos = 16900;
    const installedRacks = Math.round(totalInstalledPos / modCap);

    let occupiedPositions = 0;
    let occupiedRacks = 0;
    let utilizationPct = 0;
    let bufferRacks = 0;

    if (rackCalcState.scenario === 'asis') {
        occupiedPositions = 15720;
        occupiedRacks = Math.ceil(occupiedPositions / modCap);
        utilizationPct = ((occupiedPositions / totalInstalledPos) * 100).toFixed(1);
        bufferRacks = installedRacks - occupiedRacks;
    } else {
        const factor = rackCalcState.targetOccupancy / 85.0;
        occupiedPositions = Math.round(13480 * factor);
        occupiedRacks = Math.ceil(occupiedPositions / modCap);
        utilizationPct = ((occupiedPositions / totalInstalledPos) * 100).toFixed(1);
        bufferRacks = installedRacks - occupiedRacks;
    }

    const linearMeters = Math.round(occupiedRacks * beamLen);

    // Actualizar Insignia de Fórmula
    const badge = document.getElementById('rack-formula-badge');
    if (badge) {
        badge.innerHTML = `Capacidad por Estantería: <strong>${modCap} Posiciones Pallet</strong> (${rackCalcState.levels} pisos &times; ${rackCalcState.palletsPerBeam} pallets por piso)`;
    }

    // Actualizar KPIs de la barra
    const kpiNeeded = document.getElementById('kpi-racks-needed');
    const kpiNeededSub = document.getElementById('kpi-racks-needed-sub');
    if (kpiNeeded) {
        kpiNeeded.innerText = `${occupiedRacks.toLocaleString('es-CL')} Estanterías`;
        kpiNeeded.style.color = rackCalcState.scenario === 'asis' ? '#f43f5e' : '#38bdf8';
    }
    if (kpiNeededSub) {
        kpiNeededSub.innerText = rackCalcState.scenario === 'asis'
            ? `${occupiedPositions.toLocaleString('es-CL')} pallets ocupados (93% del almacén saturado)`
            : `${occupiedPositions.toLocaleString('es-CL')} pallets equilibrados con Re-Slotting P1`;
    }

    const kpiInstalled = document.getElementById('kpi-racks-installed');
    if (kpiInstalled) {
        kpiInstalled.innerText = `${installedRacks.toLocaleString('es-CL')} Estanterías`;
    }

    const kpiUtil = document.getElementById('kpi-racks-util');
    const kpiUtilSub = document.getElementById('kpi-racks-util-sub');
    if (kpiUtil) {
        kpiUtil.innerText = `${utilizationPct.replace('.', ',')}%`;
        kpiUtil.style.color = parseFloat(utilizationPct) >= 90 ? '#f43f5e' : parseFloat(utilizationPct) > 85 ? '#fbbf24' : '#34d399';
    }
    if (kpiUtilSub) {
        const freePct = (100 - parseFloat(utilizationPct)).toFixed(1).replace('.', ',');
        kpiUtilSub.innerText = rackCalcState.scenario === 'asis'
            ? `Solo ${bufferRacks.toLocaleString('es-CL')} racks libres (Crítico: pasillos trancados)`
            : `Holgura de ${bufferRacks.toLocaleString('es-CL')} racks libres (${freePct}% de colchón amortiguador)`;
    }

    const kpiMeters = document.getElementById('kpi-racks-meters');
    if (kpiMeters) {
        kpiMeters.innerText = `${linearMeters.toLocaleString('es-CL')} m`;
    }
}

/* 2. Renderizado del Plano Cenital SVG (Pasillos A01-D03) */
function renderRackFloorplan() {
    const isAsIs = rackCalcState.scenario === 'asis';
    const tag = document.getElementById('rack-scene-tag');
    if (tag) {
        if (isAsIs) {
            tag.innerText = 'LÍNEA BASE AS-IS (CRISIS)';
            tag.style.background = 'rgba(244, 63, 94, 0.2)';
            tag.style.color = '#f43f5e';
        } else {
            tag.innerText = 'PROPUESTA TO-BE (OPTIMIZADA)';
            tag.style.background = 'rgba(16, 185, 129, 0.2)';
            tag.style.color = '#34d399';
        }
    }

    // Render ZONA A (6 Pasillos A01-A06)
    const gA = document.getElementById('svg-aisles-a');
    if (gA) {
        const aisles = RACK_ZONES_CONFIG['A-Rápida'].aisles;
        const color = isAsIs ? '#ef4444' : '#06b6d4';
        const fill = isAsIs ? 'rgba(239, 68, 68, 0.35)' : 'rgba(6, 182, 212, 0.25)';
        let html = '';
        aisles.forEach((a, i) => {
            const x = 33 + i * 28;
            html += `
                <g class="svg-rack-aisle-block" onclick="selectFloorplanZone('A-Rápida', '${a}')" style="cursor: pointer;">
                    <title>${a} - Zona A-Rápida | Capacidad: 650 pos | Saturación: ${isAsIs ? '95,4%' : '80,0%'}</title>
                    <rect x="${x}" y="125" width="22" height="210" fill="${fill}" stroke="${color}" stroke-width="1.2" rx="3"/>
                    <line x1="${x}" y1="170" x2="${x+22}" y2="170" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="215" x2="${x+22}" y2="215" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="260" x2="${x+22}" y2="260" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="305" x2="${x+22}" y2="305" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <text x="${x+11}" y="142" fill="#ffffff" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle">${a}</text>
                    <text x="${x+11}" y="325" fill="${color}" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="800" text-anchor="middle">${isAsIs ? '95%' : '80%'}</text>
                </g>
            `;
        });
        gA.innerHTML = html;
    }

    // Render ZONA B (12 Pasillos B01-B12)
    const gB = document.getElementById('svg-aisles-b');
    if (gB) {
        const aisles = RACK_ZONES_CONFIG['B-Media'].aisles;
        const color = isAsIs ? '#f59e0b' : '#10b981';
        const fill = isAsIs ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.22)';
        let html = '';
        aisles.forEach((b, i) => {
            const x = 228 + i * 25;
            html += `
                <g class="svg-rack-aisle-block" onclick="selectFloorplanZone('B-Media', '${b}')" style="cursor: pointer;">
                    <title>${b} - Zona B-Media | Capacidad: 390 pos | Saturación: ${isAsIs ? '93,2%' : '81,9%'}</title>
                    <rect x="${x}" y="125" width="20" height="210" fill="${fill}" stroke="${color}" stroke-width="1.2" rx="3"/>
                    <line x1="${x}" y1="170" x2="${x+20}" y2="170" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="215" x2="${x+20}" y2="215" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="260" x2="${x+20}" y2="260" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <text x="${x+10}" y="142" fill="#ffffff" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle">${b}</text>
                    <text x="${x+10}" y="325" fill="${color}" font-size="7" font-family="'JetBrains Mono', monospace" font-weight="800" text-anchor="middle">${isAsIs ? '93%' : '82%'}</text>
                </g>
            `;
        });
        gB.innerHTML = html;
    }

    // Render ZONA C (6 Pasillos C01-C06)
    const gC = document.getElementById('svg-aisles-c');
    if (gC) {
        const aisles = RACK_ZONES_CONFIG['C-Lenta'].aisles;
        const color = isAsIs ? '#eab308' : '#34d399';
        const fill = isAsIs ? 'rgba(234, 179, 8, 0.28)' : 'rgba(52, 211, 153, 0.22)';
        let html = '';
        aisles.forEach((c, i) => {
            const x = 553 + i * 25.5;
            html += `
                <g class="svg-rack-aisle-block" onclick="selectFloorplanZone('C-Lenta', '${c}')" style="cursor: pointer;">
                    <title>${c} - Zona C-Lenta | Capacidad: 960 pos | Saturación: ${isAsIs ? '90,7%' : '76,7%'}</title>
                    <rect x="${x}" y="125" width="20" height="210" fill="${fill}" stroke="${color}" stroke-width="1.2" rx="3"/>
                    <line x1="${x}" y1="170" x2="${x+20}" y2="170" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="215" x2="${x+20}" y2="215" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="260" x2="${x+20}" y2="260" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <text x="${x+10}" y="142" fill="#ffffff" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle">${c}</text>
                    <text x="${x+10}" y="325" fill="${color}" font-size="7" font-family="'JetBrains Mono', monospace" font-weight="800" text-anchor="middle">${isAsIs ? '91%' : '77%'}</text>
                </g>
            `;
        });
        gC.innerHTML = html;
    }

    // Render ZONA D (3 Pasillos D01-D03)
    const gD = document.getElementById('svg-aisles-d');
    if (gD) {
        const aisles = RACK_ZONES_CONFIG['D-Bulky'].aisles;
        const color = isAsIs ? '#ef4444' : '#38bdf8';
        const fill = isAsIs ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.22)';
        let html = '';
        aisles.forEach((d, i) => {
            const x = 728 + i * 31;
            html += `
                <g class="svg-rack-aisle-block" onclick="selectFloorplanZone('D-Bulky', '${d}')" style="cursor: pointer;">
                    <title>${d} - Zona D-Bulky | Capacidad: 830 pos | Saturación: ${isAsIs ? '94,4%' : '82,4%'}</title>
                    <rect x="${x}" y="125" width="26" height="210" fill="${fill}" stroke="${color}" stroke-width="1.2" rx="3"/>
                    <line x1="${x}" y1="175" x2="${x+26}" y2="175" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="225" x2="${x+26}" y2="225" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <line x1="${x}" y1="275" x2="${x+26}" y2="275" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
                    <text x="${x+13}" y="142" fill="#ffffff" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle">${d}</text>
                    <text x="${x+13}" y="325" fill="${color}" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="800" text-anchor="middle">${isAsIs ? '94%' : '82%'}</text>
                </g>
            `;
        });
        gD.innerHTML = html;
    }
}

/* Selección interactiva de pasillo en el plano cenital */
function selectFloorplanZone(zoneKey, aisleCode) {
    rackCalcState.selectedAisle = aisleCode;
    rackCalcState.filterZone = zoneKey;
    rackCalcState.page = 1;

    const selectEl = document.getElementById('sku-filter-zone');
    if (selectEl) selectEl.value = zoneKey;

    const labelEl = document.getElementById('floorplan-active-selection');
    if (labelEl) {
        labelEl.innerText = `Filtrado: Pasillo ${aisleCode} (${RACK_ZONES_CONFIG[zoneKey].name})`;
    }

    renderSkuMasterTable();
}

/* 3. Renderizado del Alzado Frontal del Módulo de Rack (Elevación 2D) */
function renderRackElevation() {
    const svg = document.getElementById('rack-elevation-svg');
    if (!svg) return;

    const lvls = rackCalcState.levels;
    const ppb = rackCalcState.palletsPerBeam;
    const isAsIs = rackCalcState.scenario === 'asis';

    // Ficha y especificaciones
    const specBadge = document.getElementById('rack-spec-badge');
    if (specBadge) {
        specBadge.innerText = `${lvls} Pisos • ${lvls * ppb} Pallets por Estantería`;
    }
    const specLevelsTxt = document.getElementById('spec-levels-txt');
    if (specLevelsTxt) {
        specLevelsTxt.innerText = `${lvls - 1}`;
    }

    const floorY = 415;
    const lvlH = Math.floor(340 / lvls);
    const rackWidth = ppb === 2 ? 260 : 310;
    const leftX = 55;
    const rightX = leftX + rackWidth;

    let svgHtml = `
        <!-- Suelo con Franja de Advertencia Operacional -->
        <rect x="15" y="${floorY}" width="390" height="25" fill="#1e293b" rx="2"/>
        <line x1="15" y1="${floorY}" x2="405" y2="${floorY}" stroke="#e2e8f0" stroke-width="2"/>
        <line x1="25" y1="${floorY+6}" x2="395" y2="${floorY+6}" stroke="#fbbf24" stroke-width="3" stroke-dasharray="10 8"/>

        <!-- Cota Total de Altura (Izquierda) -->
        <line x1="30" y1="${floorY}" x2="30" y2="${floorY - lvls * lvlH}" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="24" y1="${floorY}" x2="36" y2="${floorY}" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="24" y1="${floorY - lvls * lvlH}" x2="36" y2="${floorY - lvls * lvlH}" stroke="#94a3b8" stroke-width="1.2"/>
        <text x="22" y="${floorY - (lvls * lvlH)/2}" fill="#38bdf8" font-size="10" font-family="'JetBrains Mono', monospace" font-weight="800" text-anchor="middle" transform="rotate(-90 22 ${floorY - (lvls * lvlH)/2})">
            ${(lvls * 2.1).toFixed(1)} m
        </text>

        <!-- Bastidor Izquierdo (Puntal de Acero Perfilado) -->
        <rect x="${leftX}" y="${floorY - lvls * lvlH - 12}" width="16" height="${lvls * lvlH + 12}" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" rx="2"/>
        <!-- Bastidor Derecho -->
        <rect x="${rightX - 16}" y="${floorY - lvls * lvlH - 12}" width="16" height="${lvls * lvlH + 12}" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" rx="2"/>
    `;

    // Celosías y arriostramientos diagonales
    for (let i = 0; i < lvls; i++) {
        const yTop = floorY - (i + 1) * lvlH;
        const yBot = floorY - i * lvlH;
        svgHtml += `
            <line x1="${leftX + 8}" y1="${yTop}" x2="${rightX - 8}" y2="${yBot}" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.2"/>
            <line x1="${leftX + 8}" y1="${yBot}" x2="${rightX - 8}" y2="${yTop}" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.2"/>
        `;
    }

    // Vigas horizontales de carga y estiba de pallets
    const palW = Math.floor((rackWidth - 40) / ppb);

    for (let l = 0; l < lvls; l++) {
        const beamY = floorY - (l + 1) * lvlH;
        const loadY = beamY + 8; // base del pallet

        // Par de Vigas Naranjas
        svgHtml += `
            <rect x="${leftX - 4}" y="${beamY}" width="${rackWidth + 8}" height="8" fill="#f97316" stroke="#c2410c" stroke-width="1.2" rx="1"/>
            <!-- Pasadores de seguridad -->
            <circle cx="${leftX + 2}" cy="${beamY + 4}" r="2" fill="#ffffff"/>
            <circle cx="${rightX - 2}" cy="${beamY + 4}" r="2" fill="#ffffff"/>
        `;

        // Pallets en este nivel
        for (let p = 0; p < ppb; p++) {
            const px = leftX + 18 + p * (palW + 6);
            const boxH = Math.min(lvlH - 18, 44);
            const py = beamY - boxH - 6;

            // Pallet base (Madera industrial 1,20x1,00m)
            svgHtml += `
                <rect x="${px}" y="${beamY - 6}" width="${palW}" height="6" fill="#b45309" stroke="#78350f" stroke-width="0.8" rx="1"/>
                <rect x="${px + 2}" y="${beamY - 4}" width="${Math.floor(palW/4)}" height="4" fill="#78350f"/>
                <rect x="${px + Math.floor(palW*0.4)}" y="${beamY - 4}" width="${Math.floor(palW/4)}" height="4" fill="#78350f"/>
                <rect x="${px + Math.floor(palW*0.75)}" y="${beamY - 4}" width="${Math.floor(palW/4)}" height="4" fill="#78350f"/>
            `;

            // Carga estibada (Cajas / Bultos)
            if (isAsIs) {
                // Crisis: Cajas desordenadas, sin estandarizar, alerta en altura
                const boxColor = (l >= 3 && p === 0) ? '#f43f5e' : (l % 2 === 0 ? '#d97706' : '#ca8a04');
                svgHtml += `
                    <rect x="${px + 2}" y="${py}" width="${palW - 4}" height="${boxH}" fill="${boxColor}" stroke="#92400e" stroke-width="1" rx="2" opacity="0.9"/>
                    <line x1="${px + 4}" y1="${py + boxH/2}" x2="${px + palW - 6}" y2="${py + boxH/2}" stroke="#78350f" stroke-width="0.8"/>
                    ${l >= 3 ? `<text x="${px + palW/2}" y="${py + boxH/2 + 3}" fill="#ffffff" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="900" text-anchor="middle">⚠️</text>` : ''}
                `;
            } else {
                // To-Be: Estiba estandarizada, film stretch, etiqueta barcode verde
                svgHtml += `
                    <rect x="${px + 2}" y="${py}" width="${palW - 4}" height="${boxH}" fill="#eab308" stroke="#ca8a04" stroke-width="1" rx="2"/>
                    <!-- Film stretch transparente -->
                    <rect x="${px + 1}" y="${py - 1}" width="${palW - 2}" height="${boxH + 2}" fill="rgba(147, 197, 253, 0.22)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="0.8" rx="2"/>
                    <!-- Etiqueta de Picking RFID/QR -->
                    <rect x="${px + palW - 14}" y="${py + boxH - 12}" width="10" height="8" fill="#ffffff" rx="1"/>
                    <rect x="${px + palW - 12}" y="${py + boxH - 10}" width="6" height="4" fill="#10b981"/>
                `;
            }
        }

        // Cota y etiqueta de altura del nivel (Derecha)
        const lvlHNum = ((l + 1) * 2.1).toFixed(1);
        const lvlName = l === 0 ? 'Piso 0: Mano / Picking (0,0 m)' : `Piso ${l}: Reserva Aérea (+${lvlHNum} m)`;
        svgHtml += `
            <text x="${rightX + 8}" y="${beamY + 5}" fill="${l === 0 ? '#38bdf8' : '#94a3b8'}" font-size="8.5" font-family="'JetBrains Mono', monospace" font-weight="${l === 0 ? '800' : '600'}">
                ${lvlName}
            </text>
        `;
    }

    // Cota horizontal inferior de viga
    svgHtml += `
        <line x1="${leftX}" y1="${floorY + 16}" x2="${rightX}" y2="${floorY + 16}" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="${leftX}" y1="${floorY + 12}" x2="${leftX}" y2="${floorY + 20}" stroke="#94a3b8" stroke-width="1.2"/>
        <line x1="${rightX}" y1="${floorY + 12}" x2="${rightX}" y2="${floorY + 20}" stroke="#94a3b8" stroke-width="1.2"/>
        <text x="${leftX + rackWidth/2}" y="${floorY + 28}" fill="#fbbf24" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle">
            Luz de Viga: ${ppb === 2 ? '2,70 m' : '3,30 m'} (${ppb} Pallets / Nivel)
        </text>
    `;

    svg.innerHTML = svgHtml;
}

/* 4. Renderizado de la Matriz Comparativa por Zonas */
function renderRackMatrixTable() {
    const tbody = document.getElementById('rack-matrix-tbody');
    if (!tbody) return;

    const modCap = rackCalcState.levels * rackCalcState.palletsPerBeam;
    const isAsIs = rackCalcState.scenario === 'asis';
    const factor = rackCalcState.targetOccupancy / 85.0;

    const zones = ['A-Rápida', 'B-Media', 'C-Lenta', 'D-Bulky'];
    let totalCap = 0;
    let totalArea = 0;
    let totalPallets = 0;
    let totalRacksOccupied = 0;
    let totalRacksInstalled = 0;

    let html = '';

    zones.forEach(zKey => {
        const z = RACK_ZONES_CONFIG[zKey];
        const racksInstalled = Math.round(z.cap_pos / modCap);
        const reqPallets = isAsIs ? z.asis_pos : Math.round(z.tobe_pos * factor);
        const racksOccupied = Math.ceil(reqPallets / modCap);
        const util = ((reqPallets / z.cap_pos) * 100).toFixed(1);

        totalCap += z.cap_pos;
        totalArea += z.area;
        totalPallets += reqPallets;
        totalRacksOccupied += racksOccupied;
        totalRacksInstalled += racksInstalled;

        const utilBadgeClass = parseFloat(util) >= 92 ? 'status-critical' : parseFloat(util) > 85 ? 'status-warning' : 'status-optimal';
        const diagText = isAsIs ? z.diag_asis : z.diag_tobe;
        const skuTransition = `${z.asis_skus} &rarr; <strong style="color: ${isAsIs ? '#94a3b8' : '#34d399'}">${z.tobe_skus}</strong>`;

        html += `
            <tr>
                <td>
                    <span style="font-weight: 800; color: ${isAsIs ? z.color_asis : z.color_tobe}; display: flex; align-items: center; gap: 6px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isAsIs ? z.color_asis : z.color_tobe};"></span>
                        ${z.name}
                    </span>
                </td>
                <td>${z.func} (${z.aisles[0]}-${z.aisles[z.aisles.length - 1]})</td>
                <td>${z.area.toLocaleString('es-CL')} m²</td>
                <td>${z.dist} m</td>
                <td>${skuTransition}</td>
                <td><strong style="color: #ffffff;">${reqPallets.toLocaleString('es-CL')}</strong> pos</td>
                <td><strong style="color: ${isAsIs ? '#f43f5e' : '#38bdf8'}">${racksOccupied.toLocaleString('es-CL')}</strong> racks</td>
                <td>${racksInstalled.toLocaleString('es-CL')} racks</td>
                <td>
                    <span class="sku-util-badge ${utilBadgeClass}">
                        ${util.replace('.', ',')}%
                    </span>
                </td>
                <td style="font-size: 0.76rem; color: ${isAsIs ? '#fda4af' : '#cbd5e1'};">
                    ${diagText}
                </td>
            </tr>
        `;
    });

    const totalUtil = ((totalPallets / totalCap) * 100).toFixed(1);
    const totalBadgeClass = parseFloat(totalUtil) >= 90 ? 'status-critical' : parseFloat(totalUtil) > 85 ? 'status-warning' : 'status-optimal';

    html += `
        <tr style="background: rgba(56, 189, 248, 0.08); font-weight: 800; border-top: 2px solid rgba(56, 189, 248, 0.3);">
            <td colspan="2" style="color: #ffffff;">TOTAL CENTRO DE DISTRIBUCIÓN</td>
            <td>${totalArea.toLocaleString('es-CL')} m²</td>
            <td>—</td>
            <td>450 SKUs</td>
            <td style="color: #38bdf8;">${totalPallets.toLocaleString('es-CL')} pos</td>
            <td style="color: ${isAsIs ? '#f43f5e' : '#38bdf8'}; font-size: 0.92rem;">${totalRacksOccupied.toLocaleString('es-CL')} racks</td>
            <td style="color: #ffffff;">${totalRacksInstalled.toLocaleString('es-CL')} racks</td>
            <td>
                <span class="sku-util-badge ${totalBadgeClass}">
                    ${totalUtil.replace('.', ',')}%
                </span>
            </td>
            <td style="font-size: 0.78rem; color: ${isAsIs ? '#fda4af' : '#a7f3d0'};">
                ${isAsIs ? '🚨 Crisis CyberDay: 93,0% saturación global (15.720 pallets). Grúas y carros bloqueados, demoras críticas.' : '✨ Almacén Equilibrado: 79,8% de ocupación. 342 estanterías libres (20,2% de colchón) para absorber picos sin estrés.'}
            </td>
        </tr>
    `;

    tbody.innerHTML = html;
}

/* 5. Renderizado del Explorador y Tabla Maestra de SKUs (450 SKUs) */
function renderSkuMasterTable() {
    const tbody = document.getElementById('sku-master-tbody');
    if (!tbody || typeof ANDES_SKU_MASTER === 'undefined') return;

    const modCap = rackCalcState.levels * rackCalcState.palletsPerBeam;

    // Filtrado de la Base de Datos
    let filtered = ANDES_SKU_MASTER.filter(s => {
        // Filtro por mismatch predeterminado
        if (rackCalcState.filterMismatch === 'mismatches' && !s.mis) return false;
        if (rackCalcState.filterMismatch === 'rescued' && !(s.z_act === 'C-Lenta' && s.z_ide === 'A-Rápida')) return false;

        // Filtro por Zona
        if (rackCalcState.filterZone !== 'all') {
            const currentZone = rackCalcState.scenario === 'asis' ? s.z_act : s.z_ide;
            if (currentZone !== rackCalcState.filterZone) return false;
        }

        // Filtro por ABC
        if (rackCalcState.filterAbc !== 'all' && s.abc !== rackCalcState.filterAbc) return false;

        // Filtro por Familia
        if (rackCalcState.filterFam !== 'all' && s.fam !== rackCalcState.filterFam) return false;

        // Búsqueda de texto
        if (rackCalcState.searchQuery.trim() !== '') {
            const q = rackCalcState.searchQuery.toLowerCase();
            const matchId = s.id.toLowerCase().includes(q);
            const matchFam = s.fam.toLowerCase().includes(q);
            if (!matchId && !matchFam) return false;
        }

        return true;
    });

    // Contadores
    const countEl = document.getElementById('sku-filtered-count');
    const palEl = document.getElementById('sku-pallets-count');
    const totalPals = filtered.reduce((acc, cur) => acc + cur.pal, 0);

    if (countEl) countEl.innerText = filtered.length.toLocaleString('es-CL');
    if (palEl) palEl.innerText = totalPals.toLocaleString('es-CL');

    // Paginación
    const totalPages = Math.ceil(filtered.length / rackCalcState.pageSize) || 1;
    if (rackCalcState.page > totalPages) rackCalcState.page = totalPages;
    if (rackCalcState.page < 1) rackCalcState.page = 1;

    const startIndex = (rackCalcState.page - 1) * rackCalcState.pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + rackCalcState.pageSize);

    // Renderizar Filas
    let html = '';
    if (pageItems.length === 0) {
        html = `<tr><td colspan="11" style="text-align: center; padding: 24px; color: #94a3b8;">No se encontraron SKUs que coincidan con los filtros aplicados.</td></tr>`;
    } else {
        pageItems.forEach(s => {
            const rackEq = (s.pal / modCap).toFixed(2);
            const abcClass = s.abc === 'A' ? 'sku-abc-a' : s.abc === 'B' ? 'sku-abc-b' : 'sku-abc-c';
            
            // Acción recomendada por Re-Slotting
            let actionHtml = '';
            if (s.mis) {
                if (s.z_act === 'C-Lenta' && s.z_ide === 'A-Rápida') {
                    actionHtml = `<span style="color: #38bdf8; font-weight: 700;">🚀 Mover a Zona A (Ahorra 83 m hacia despacho)</span>`;
                } else if (s.z_act === 'B-Media' && s.z_ide === 'A-Rápida') {
                    actionHtml = `<span style="color: #38bdf8; font-weight: 700;">⚡ Mover a Zona A (Ahorra 37 m hacia despacho)</span>`;
                } else if (s.z_ide === 'D-Bulky') {
                    actionHtml = `<span style="color: #f87171; font-weight: 700;">🏗️ Bajar a Suelo/Nivel 1 (Ergonomía Ley 20.949)</span>`;
                } else if (s.z_act === 'A-Rápida') {
                    actionHtml = `<span style="color: #fbbf24; font-weight: 700;">🔄 Trasladar a ${s.z_ide} (Descongestiona Zona A)</span>`;
                } else {
                    actionHtml = `<span style="color: #a7f3d0; font-weight: 700;">📦 Reubicar en ${s.z_ide} (Lugar Ideal)</span>`;
                }
            } else {
                actionHtml = `<span style="color: #94a3b8;">✅ Ubicación Correcta (Óptima en ${s.z_act})</span>`;
            }

            const zoneCell = s.mis 
                ? `<span class="sku-badge-mismatch">${s.z_act} &rarr; ${s.z_ide}</span>`
                : `<span style="color: #cbd5e1;">${s.z_act}</span>`;

            html += `
                <tr>
                    <td><strong style="color: #ffffff; font-family: var(--font-mono);">${s.id}</strong></td>
                    <td>${s.fam}</td>
                    <td><span class="sku-abc-badge ${abcClass}">Clase ${s.abc}</span></td>
                    <td style="font-family: var(--font-mono); font-size: 0.74rem;">${s.l}&times;${s.w}&times;${s.h} cm</td>
                    <td style="font-family: var(--font-mono); font-size: 0.74rem;">${s.kg} kg</td>
                    <td style="font-family: var(--font-mono);">${s.stock.toLocaleString('es-CL')}</td>
                    <td style="font-family: var(--font-mono);">${s.u_pal} u</td>
                    <td><strong style="color: #38bdf8; font-family: var(--font-mono);">${s.pal.toLocaleString('es-CL')}</strong> pal</td>
                    <td style="font-family: var(--font-mono); color: #fbbf24;">${rackEq}</td>
                    <td>${zoneCell}</td>
                    <td>${actionHtml}</td>
                </tr>
            `;
        });
    }

    tbody.innerHTML = html;

    // Actualizar Paginador
    const pageInfo = document.getElementById('sku-page-info');
    if (pageInfo) {
        pageInfo.innerText = `Página ${rackCalcState.page} de ${totalPages} (${rackCalcState.pageSize} por página • Total: ${filtered.length})`;
    }
    const prevBtn = document.getElementById('sku-prev-btn');
    const nextBtn = document.getElementById('sku-next-btn');
    if (prevBtn) prevBtn.disabled = (rackCalcState.page <= 1);
    if (nextBtn) nextBtn.disabled = (rackCalcState.page >= totalPages);
}

/* 6. Handlers de Eventos y Controles Interoceánicos */
function setRackScenario(scene) {
    rackCalcState.scenario = scene;

    const btnAsis = document.getElementById('rack-scene-asis');
    const btnTobe = document.getElementById('rack-scene-tobe');

    if (scene === 'asis') {
        if (btnAsis) btnAsis.classList.add('active');
        if (btnTobe) btnTobe.classList.remove('active');
    } else {
        if (btnTobe) btnTobe.classList.add('active');
        if (btnAsis) btnAsis.classList.remove('active');
    }

    calculateRackMetrics();
    renderRackFloorplan();
    renderRackElevation();
    renderRackMatrixTable();
    renderSkuMasterTable();
}

function setRackLevels(lvls) {
    rackCalcState.levels = lvls;
    [3, 4, 5, 6].forEach(n => {
        const btn = document.getElementById(`rack-lvl-${n}`);
        if (btn) {
            if (n === lvls) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });

    calculateRackMetrics();
    renderRackElevation();
    renderRackMatrixTable();
    renderSkuMasterTable();
}

function setRackPalletsPerBeam(ppb) {
    rackCalcState.palletsPerBeam = ppb;
    [2, 3].forEach(n => {
        const btn = document.getElementById(`rack-ppb-${n}`);
        if (btn) {
            if (n === ppb) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });

    calculateRackMetrics();
    renderRackElevation();
    renderRackMatrixTable();
    renderSkuMasterTable();
}

function onRackTargetOccupancyChange(val) {
    rackCalcState.targetOccupancy = parseInt(val, 10);
    const disp = document.getElementById('rack-occupancy-display');
    if (disp) disp.innerText = `${val}%`;

    if (rackCalcState.scenario === 'tobe') {
        calculateRackMetrics();
        renderRackMatrixTable();
    }
}

function setSkuMismatchFilter(type) {
    rackCalcState.filterMismatch = type;
    rackCalcState.page = 1;

    const bAll = document.getElementById('filter-sku-all');
    const bMis = document.getElementById('filter-sku-mismatches');
    const bRes = document.getElementById('filter-sku-zone-a-rescued');

    if (bAll) bAll.classList.toggle('active', type === 'all');
    if (bMis) bMis.classList.toggle('active', type === 'mismatches');
    if (bRes) bRes.classList.toggle('active', type === 'rescued');

    renderSkuMasterTable();
}

function onSkuSearchInput(val) {
    rackCalcState.searchQuery = val;
    rackCalcState.page = 1;
    renderSkuMasterTable();
}

function onSkuZoneFilterChange(val) {
    rackCalcState.filterZone = val;
    rackCalcState.page = 1;
    renderSkuMasterTable();
}

function onSkuAbcFilterChange(val) {
    rackCalcState.filterAbc = val;
    rackCalcState.page = 1;
    renderSkuMasterTable();
}

function onSkuFamFilterChange(val) {
    rackCalcState.filterFam = val;
    rackCalcState.page = 1;
    renderSkuMasterTable();
}

function changeSkuPage(delta) {
    rackCalcState.page += delta;
    renderSkuMasterTable();
}

/* Exposición a entorno Global / Window para eventos Inline HTML */
window.setRackScenario = setRackScenario;
window.setRackLevels = setRackLevels;
window.setRackPalletsPerBeam = setRackPalletsPerBeam;
window.onRackTargetOccupancyChange = onRackTargetOccupancyChange;
window.setSkuMismatchFilter = setSkuMismatchFilter;
window.onSkuSearchInput = onSkuSearchInput;
window.onSkuZoneFilterChange = onSkuZoneFilterChange;
window.onSkuAbcFilterChange = onSkuAbcFilterChange;
window.onSkuFamFilterChange = onSkuFamFilterChange;
window.changeSkuPage = changeSkuPage;
window.selectFloorplanZone = selectFloorplanZone;
window.initRackCalculator = initRackCalculator;

