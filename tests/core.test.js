const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const store = require('../andeshome-store.js');
const scenarios = require('../excellent-scenarios.js');

test('el portafolio P1-P5 conserva el caso financiero oficial', () => {
    const result = store.calculatePortfolio(['p1', 'p2', 'p3', 'p4', 'p5']);

    assert.equal(result.totalCapex, 766800000);
    assert.equal(result.netAnnualEbitda, 856097000);
    assert.equal(Math.round(result.npv), 1289400543);
    assert.equal(Number(result.paybackMonths.toFixed(1)), 10.7);
    assert.equal(result.projectedOtif, 96.2);
    assert.equal(result.isExceededCapex, false);
});

test('P8 combinado con P1-P5 queda correctamente fuera de presupuesto', () => {
    const result = store.calculatePortfolio(['p1', 'p2', 'p3', 'p4', 'p5', 'p8']);

    assert.equal(result.totalCapex, 885600000);
    assert.equal(result.isExceededCapex, true);
    assert.equal(result.budgetRemaining, -35600000);
});

test('el sandbox 2D y el store comparten los ahorros de proyectos', () => {
    for (const id of ['p1', 'p2', 'p3', 'p4', 'p5', 'p8']) {
        assert.equal(typeof store.PROJECTS[id].annualGrossSavings, 'number');
    }
});

test('landing.html carga el store una sola vez', () => {
    const landing = fs.readFileSync(path.join(__dirname, '..', 'landing.html'), 'utf8');
    const references = landing.match(/andeshome-store\.js/g) || [];
    assert.equal(references.length, 1);
});

test('la comparación simultánea mantiene To-Be, Excelente y diferencial', () => {
    assert.equal(scenarios.tobe.capex, '$766,8M');
    assert.equal(scenarios.excelente.capacity, '102.060 pos.');
    assert.equal(scenarios.delta.otif, '+2,5 pp');
    assert.equal(scenarios.delta.ebitda, '+$370M/año');
});

test('el resumen departamental compara ROI To-Be y Excelente en el mismo panel', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'excelente.html'), 'utf8');
    assert.match(html, /id="deptTabPane3"/);
    assert.match(html, /To-Be convencional · P1–P5/);
    assert.match(html, /Excelente automatizado · P1–P8/);
    assert.match(html, /Sensibilidad ROI: comparación directa To-Be vs\. Excelente/);
    assert.match(html, /\+\$370M\/a/);
    assert.match(html, /\+\$552,9M/);
});

test('el bloqueo de demo no borra almacenamiento ajeno', () => {
    const authGate = fs.readFileSync(path.join(__dirname, '..', 'auth-gate.js'), 'utf8');

    assert.equal(authGate.includes('localStorage.clear()'), false);
    assert.equal(authGate.includes('sessionStorage.clear()'), false);
    assert.equal(authGate.includes('indexedDB.deleteDatabase'), false);
    assert.equal(authGate.includes('caches.delete'), false);
    assert.equal(authGate.includes('STORAGE_KEYS_OWNED_BY_GATE'), true);
});

test('el recorrido 3D mantiene controles profesionales y datos financieros consistentes', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'excelente.html'), 'utf8');
    assert.match(html, /Recorrido 3D Interactivo/);
    assert.match(html, /role="slider"/);
    assert.match(html, /handleVideoTimelineKey/);
    assert.match(html, /toggleExecutiveMode/);
    assert.match(html, /v3dFpsBadge/);
    assert.match(html, /video3d-compare-strip/);
    assert.match(html, /addWarehouseEnvelope/);
    assert.match(html, /addOperationalWayfinding/);
    assert.match(html, /addProcessFlowArrows/);
    assert.match(html, /P1 \+ P6 \+ P8: Shuttle AS\/RS/);
    assert.match(html, /P4: TMS de Ruteo Dinámico GPS/);
    assert.match(html, /v3dVoiceEnabled = false/);
    assert.doesNotMatch(html, /EBITDA \+\$412M/);
    assert.doesNotMatch(html, /Payback 1,8a/);
});
