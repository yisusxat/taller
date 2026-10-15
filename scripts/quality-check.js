const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'landing.html', 'excelente.html'];
const failures = [];

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
    if (!condition) failures.push(message);
}

for (const page of pages) {
    const html = read(page);
    assert(/<html\s+lang="es"/i.test(html), `${page}: falta lang="es"`);
    assert(/name="viewport"/i.test(html), `${page}: falta viewport responsive`);
    assert(/class="skip-link"/.test(html), `${page}: falta enlace de salto accesible`);
    assert(/id="main-content"/.test(html), `${page}: falta landmark main-content`);
    assert(!/<script[^>]+src=["'](?:\.\/)?andeshome-store\.js["'][^>]*>.*<\/script>[\s\S]*<script[^>]+src=["'](?:\.\/)?andeshome-store\.js/i.test(html), `${page}: store cargado más de una vez`);
}

const landing = read('landing.html');
assert((landing.match(/andeshome-store\.js/g) || []).length === 1, 'landing.html: se esperaba una sola carga del store');
assert(fs.existsSync(path.join(root, 'excellent-scenarios.js')), 'falta excellent-scenarios.js');
assert(fs.existsSync(path.join(root, 'tests', 'core.test.js')), 'falta la suite principal de pruebas');

const auth = read('auth-gate.js');
assert(!/localStorage\.clear\(|sessionStorage\.clear\(|caches\.delete\(|indexedDB\.deleteDatabase\(|\.unregister\(\)/.test(auth), 'auth-gate.js: contiene limpieza destructiva');
assert(/STORAGE_KEYS_OWNED_BY_GATE/.test(auth), 'auth-gate.js: no declara claves de almacenamiento propias');
assert(/aria-selected/.test(read('app.js')), 'app.js: falta sincronización ARIA de tabs');
assert(/aria-selected/.test(read('landing-2d.js')), 'landing-2d.js: falta sincronización ARIA de tabs');

if (failures.length) {
    console.error(failures.map((failure) => `✖ ${failure}`).join('\n'));
    process.exitCode = 1;
} else {
    console.log(`✔ quality-check: ${pages.length} páginas, accesibilidad base, scripts y seguridad verificados`);
}
