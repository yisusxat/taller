/**
 * ANDESHOME CHILE S.A. - AUTH SECURITY GATE
 * - Bloqueo de acceso por PIN de 4 dígitos (4444).
 * - Detección de inactividad: 10 minutos (600.000 ms).
 * - Limpieza únicamente de las claves propias de la demo al expirar la sesión.
 * - Sincronización multi-pestaña, soporte bfcache, visibilidad móvil y protección Anti-FOUC.
 */

(function () {
    'use strict';

    const CORRECT_PIN = '4444';
    const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutos (600 segundos)
    // Este bloqueo es una protección visual para la demo, no autenticación de producción.
    const STORAGE_KEY_AUTH = 'ah_pin_auth_token';
    const STORAGE_KEY_ACTIVITY = 'ah_last_activity_ts';
    const STORAGE_KEYS_OWNED_BY_GATE = [STORAGE_KEY_AUTH, STORAGE_KEY_ACTIVITY];
    const SESSION_TOKEN = 'authorized_4444';

    // 1. EVALUAR ESTADO INICIAL INMEDIATAMENTE (ANTES DEL RENDER)
    function isSessionValid() {
        try {
            const isAuth = localStorage.getItem(STORAGE_KEY_AUTH) === SESSION_TOKEN;
            const lastActive = parseInt(localStorage.getItem(STORAGE_KEY_ACTIVITY) || '0', 10);
            const now = Date.now();

            if (!isAuth) return false;
            if (lastActive === 0 || (now - lastActive) >= INACTIVITY_LIMIT_MS) {
                // Expiró por inactividad de 10 minutos: limpiar solo la sesión de esta demo.
                clearDemoSessionData();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // 2. LIMPIEZA ACOTADA DE LA SESIÓN DE ESTA DEMO
    function clearDemoSessionData() {
        try {
            STORAGE_KEYS_OWNED_BY_GATE.forEach(function (key) {
                localStorage.removeItem(key);
            });
        } catch (e) {}
        try {
            STORAGE_KEYS_OWNED_BY_GATE.forEach(function (key) {
                sessionStorage.removeItem(key);
            });
        } catch (e) {}
    }

    // 3. INYECCIÓN INMEDIATA DE CLASE Y ESTILOS ANTI-FOUC
    const initialValid = isSessionValid();
    if (document.documentElement && !initialValid) {
        document.documentElement.classList.add('ah-gate-locked');
    }

    const styleEl = document.createElement('style');
    styleEl.id = 'ah-gate-core-styles';
    styleEl.innerHTML = `
        /* Ocultar contenido mientras esté bloqueado */
        html.ah-gate-locked body > *:not(#ahSecurityGateOverlay) {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            user-select: none !important;
        }
        html.ah-gate-locked body {
            overflow: hidden !important;
            background: #040817 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* El overlay SOLO se muestra cuando el documento tiene la clase ah-gate-locked */
        #ahSecurityGateOverlay {
            display: none !important;
            position: fixed !important;
            inset: 0 !important;
            z-index: 2147483647 !important;
            background: radial-gradient(circle at 50% 25%, #0f1c3f 0%, #070d1e 50%, #03060f 100%) !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 16px !important;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            color: #ffffff !important;
            box-sizing: border-box !important;
            overflow-y: auto !important;
            transition: opacity 0.25s ease-out !important;
        }
        html.ah-gate-locked #ahSecurityGateOverlay {
            display: flex !important;
        }
        #ahSecurityGateOverlay.ah-hidden {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        .ah-gate-card {
            background: rgba(13, 21, 39, 0.95) !important;
            border: 1px solid rgba(56, 189, 248, 0.35) !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(2, 132, 199, 0.3) !important;
            border-radius: 20px !important;
            width: 100% !important;
            max-width: 420px !important;
            padding: 28px 22px !important;
            text-align: center !important;
            box-sizing: border-box !important;
            backdrop-filter: blur(16px) !important;
            animation: ahGateFadeIn 0.3s ease-out !important;
        }
        @keyframes ahGateFadeIn {
            from { opacity: 0; transform: scale(0.96) translateY(12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ahGateShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
        }
        .ah-gate-shake {
            animation: ahGateShake 0.4s ease-in-out !important;
        }
        .ah-gate-badge {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            background: rgba(56, 189, 248, 0.12) !important;
            border: 1px solid rgba(56, 189, 248, 0.35) !important;
            color: #38bdf8 !important;
            padding: 5px 12px !important;
            border-radius: 999px !important;
            font-size: 0.72rem !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            margin-bottom: 12px !important;
        }
        .ah-gate-title {
            margin: 0 0 6px 0 !important;
            font-size: 1.25rem !important;
            font-weight: 800 !important;
            color: #ffffff !important;
            letter-spacing: -0.3px !important;
        }
        .ah-gate-sub {
            margin: 0 0 20px 0 !important;
            font-size: 0.82rem !important;
            color: #94a3b8 !important;
            line-height: 1.45 !important;
        }
        .ah-gate-pin-boxes {
            display: flex !important;
            justify-content: center !important;
            gap: 12px !important;
            margin-bottom: 16px !important;
        }
        .ah-gate-pin-digit {
            width: 52px !important;
            height: 58px !important;
            border-radius: 12px !important;
            background: #060b18 !important;
            border: 2px solid rgba(255, 255, 255, 0.14) !important;
            color: #38bdf8 !important;
            font-size: 1.6rem !important;
            font-weight: 900 !important;
            font-family: 'JetBrains Mono', monospace !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }
        .ah-gate-pin-digit.filled {
            border-color: #38bdf8 !important;
            background: rgba(2, 132, 199, 0.18) !important;
            box-shadow: 0 0 12px rgba(56, 189, 248, 0.4) !important;
        }
        .ah-gate-pin-digit.success {
            border-color: #10b981 !important;
            color: #34d399 !important;
            background: rgba(16, 185, 129, 0.25) !important;
            box-shadow: 0 0 16px rgba(16, 185, 129, 0.55) !important;
        }
        .ah-gate-pin-digit.error {
            border-color: #f43f5e !important;
            color: #fca5a5 !important;
            background: rgba(244, 63, 94, 0.25) !important;
            box-shadow: 0 0 16px rgba(244, 63, 94, 0.45) !important;
        }
        .ah-gate-keypad {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
            max-width: 280px !important;
            margin: 0 auto 16px auto !important;
        }
        .ah-gate-btn {
            background: #091226 !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            color: #ffffff !important;
            border-radius: 12px !important;
            padding: 13px 0 !important;
            font-size: 1.25rem !important;
            font-weight: 800 !important;
            font-family: 'JetBrains Mono', monospace !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
            user-select: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        .ah-gate-btn:hover {
            background: rgba(56, 189, 248, 0.18) !important;
            border-color: #38bdf8 !important;
            color: #38bdf8 !important;
            transform: translateY(-2px) !important;
        }
        .ah-gate-btn:active {
            transform: scale(0.96) !important;
            background: #38bdf8 !important;
            color: #060b18 !important;
        }
        .ah-gate-btn.action {
            font-size: 0.78rem !important;
            color: #94a3b8 !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 700 !important;
        }
        .ah-gate-btn.action:hover {
            color: #f87171 !important;
            border-color: #f87171 !important;
        }
        .ah-gate-status-msg {
            min-height: 22px !important;
            font-size: 0.8rem !important;
            font-family: 'JetBrains Mono', monospace !important;
            margin-bottom: 14px !important;
            font-weight: 700 !important;
        }
        .ah-gate-status-msg.error {
            color: #f87171 !important;
        }
        .ah-gate-status-msg.success {
            color: #34d399 !important;
        }
        .ah-gate-status-msg.info {
            color: #94a3b8 !important;
        }
        .ah-gate-policy-box {
            background: rgba(15, 23, 42, 0.7) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 10px !important;
            padding: 10px 12px !important;
            font-size: 0.72rem !important;
            color: #64748b !important;
            line-height: 1.45 !important;
            text-align: left !important;
        }
        .ah-gate-policy-box strong {
            color: #cbd5e1 !important;
        }
        /* Barra de estado flotante cuando está autenticado */
        #ahSessionFloatingPill {
            position: fixed !important;
            bottom: 14px !important;
            right: 14px !important;
            z-index: 99999 !important;
            background: rgba(13, 21, 39, 0.92) !important;
            border: 1px solid rgba(56, 189, 248, 0.35) !important;
            border-radius: 999px !important;
            padding: 6px 14px !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-size: 0.72rem !important;
            color: #94a3b8 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(8px) !important;
            user-select: none !important;
            transition: all 0.25s ease !important;
        }
        #ahSessionFloatingPill:hover {
            border-color: #38bdf8 !important;
            color: #ffffff !important;
        }
        #ahSessionFloatingPill button {
            background: transparent !important;
            border: none !important;
            color: #f87171 !important;
            cursor: pointer !important;
            font-size: 0.72rem !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-weight: 800 !important;
            padding: 0 0 0 6px !important;
            border-left: 1px solid rgba(255, 255, 255, 0.15) !important;
            line-height: 1 !important;
        }
        #ahSessionFloatingPill button:hover {
            color: #fca5a5 !important;
            text-decoration: underline !important;
        }
        @media (max-width: 480px) {
            .ah-gate-card {
                padding: 20px 14px !important;
                max-width: 340px !important;
                margin: 0 auto !important;
            }
            .ah-gate-pin-digit {
                width: 44px !important;
                height: 50px !important;
                font-size: 1.3rem !important;
            }
            .ah-gate-pin-boxes {
                gap: 8px !important;
            }
            .ah-gate-btn {
                padding: 10px 0 !important;
                font-size: 1.1rem !important;
            }
            #ahSessionFloatingPill {
                bottom: 8px !important;
                right: 8px !important;
                font-size: 0.65rem !important;
                padding: 4px 10px !important;
            }
        }
    `;
    (document.head || document.documentElement).appendChild(styleEl);

    // Estado del PIN en memoria
    let currentInput = '';
    let inactivityTimerInterval = null;

    // 4. CREAR E INYECTAR OVERLAY DEL PIN GATE
    function renderGateOverlay(customMessage) {
        let overlay = document.getElementById('ahSecurityGateOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ahSecurityGateOverlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.innerHTML = `
                <div class="ah-gate-card" id="ahGateCard">
                    <div class="ah-gate-badge">
                        <span>🔒 ACCESO RESTRINGIDO</span>
                    </div>
                    <h2 class="ah-gate-title">ANDESHOME CHILE S.A.</h2>
                    <p class="ah-gate-sub">Portal Logístico Confidencial &bull; CD Pudahuel<br>Introduzca su <strong>PIN de 4 dígitos</strong> para continuar</p>

                    <div class="ah-gate-pin-boxes" id="ahPinBoxes" aria-label="Casillas de PIN">
                        <div class="ah-gate-pin-digit" id="ahPin0">&bull;</div>
                        <div class="ah-gate-pin-digit" id="ahPin1">&bull;</div>
                        <div class="ah-gate-pin-digit" id="ahPin2">&bull;</div>
                        <div class="ah-gate-pin-digit" id="ahPin3">&bull;</div>
                    </div>

                    <div class="ah-gate-status-msg info" id="ahGateStatusMsg">
                        ${customMessage || 'Ingrese el PIN de 4 dígitos (4444)'}
                    </div>

                    <!-- Teclado Numérico Táctil -->
                    <div class="ah-gate-keypad">
                        <button type="button" class="ah-gate-btn" data-key="1">1</button>
                        <button type="button" class="ah-gate-btn" data-key="2">2</button>
                        <button type="button" class="ah-gate-btn" data-key="3">3</button>
                        <button type="button" class="ah-gate-btn" data-key="4">4</button>
                        <button type="button" class="ah-gate-btn" data-key="5">5</button>
                        <button type="button" class="ah-gate-btn" data-key="6">6</button>
                        <button type="button" class="ah-gate-btn" data-key="7">7</button>
                        <button type="button" class="ah-gate-btn" data-key="8">8</button>
                        <button type="button" class="ah-gate-btn" data-key="9">9</button>
                        <button type="button" class="ah-gate-btn action" data-key="clear">LIMPIAR</button>
                        <button type="button" class="ah-gate-btn" data-key="0">0</button>
                        <button type="button" class="ah-gate-btn action" data-key="backspace">⌫</button>
                    </div>

                    <div class="ah-gate-policy-box">
                        <strong>🛡️ Política de Seguridad:</strong> Sesión con <strong>tiempo de inactividad de 10 minutos</strong>. Al transcurrir dicho tiempo sin interacción, el sistema bloqueará la pantalla y <strong>eliminará únicamente las claves propias de esta demo</strong>.
                    </div>
                </div>
            `;
            if (document.body) {
                document.body.appendChild(overlay);
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    document.body.appendChild(overlay);
                });
            }

            // Eventos del teclado táctil
            overlay.querySelectorAll('.ah-gate-btn').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const key = btn.getAttribute('data-key');
                    handleKeyInput(key);
                });
            });
        } else {
            overlay.classList.remove('ah-hidden');
            overlay.style.removeProperty('display');
            if (customMessage) {
                setStatusMessage(customMessage, 'error');
            }
        }
        updatePinDisplay();
    }

    // 5. MANEJO DE ENTRADA (TECLADO FÍSICO Y VIRTUAL)
    function handleKeyInput(key) {
        if (key === 'clear') {
            currentInput = '';
            updatePinDisplay();
            setStatusMessage('Ingrese el PIN de 4 dígitos', 'info');
            return;
        }
        if (key === 'backspace') {
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                updatePinDisplay();
            }
            return;
        }
        if (/^[0-9]$/.test(key)) {
            if (currentInput.length < 4) {
                currentInput += key;
                updatePinDisplay();
                if (currentInput.length === 4) {
                    validatePin(currentInput);
                }
            }
        }
    }

    function updatePinDisplay() {
        for (let i = 0; i < 4; i++) {
            const el = document.getElementById('ahPin' + i);
            if (!el) continue;
            if (i < currentInput.length) {
                el.innerText = '●';
                el.classList.add('filled');
                el.classList.remove('error', 'success');
            } else {
                el.innerText = '·';
                el.classList.remove('filled', 'error', 'success');
            }
        }
    }

    function setStatusMessage(msg, type) {
        const el = document.getElementById('ahGateStatusMsg');
        if (el) {
            el.innerText = msg;
            el.className = 'ah-gate-status-msg ' + (type || 'info');
        }
    }

    // 6. VALIDACIÓN DEL PIN
    function validatePin(pinAttempt) {
        const card = document.getElementById('ahGateCard');
        if (pinAttempt === CORRECT_PIN) {
            // PIN CORRECTO (4444)
            for (let i = 0; i < 4; i++) {
                const el = document.getElementById('ahPin' + i);
                if (el) el.classList.add('success');
            }
            setStatusMessage('✅ PIN correcto. Acceso concedido...', 'success');

            // Guardar autorización y marca temporal actual
            try {
                localStorage.setItem(STORAGE_KEY_AUTH, SESSION_TOKEN);
                localStorage.setItem(STORAGE_KEY_ACTIVITY, Date.now().toString());
            } catch (e) {}

            // Transición suave: ocultar overlay y entrar al sitio
            setTimeout(function () {
                const overlay = document.getElementById('ahSecurityGateOverlay');
                if (overlay) {
                    overlay.classList.add('ah-hidden');
                }
                unlockGate();
                // Recargar para entrar de forma limpia con todos los componentes y gráficos inicializados
                window.location.reload();
            }, 350);
        } else {
            // PIN INCORRECTO
            for (let i = 0; i < 4; i++) {
                const el = document.getElementById('ahPin' + i);
                if (el) el.classList.add('error');
            }
            if (card) {
                card.classList.add('ah-gate-shake');
                setTimeout(function () {
                    card.classList.remove('ah-gate-shake');
                }, 450);
            }
            setStatusMessage('❌ PIN incorrecto. Acceso denegado.', 'error');
            setTimeout(function () {
                currentInput = '';
                updatePinDisplay();
                setStatusMessage('Reintente con el PIN autorizado (4 dígitos)', 'info');
            }, 800);
        }
    }

    // 7. DESBLOQUEO DEL SITIO
    function unlockGate() {
        document.documentElement.classList.remove('ah-gate-locked');
        const overlay = document.getElementById('ahSecurityGateOverlay');
        if (overlay) {
            overlay.classList.add('ah-hidden');
            overlay.style.setProperty('display', 'none', 'important');
            try {
                overlay.remove();
            } catch (e) {}
        }
        currentInput = '';
        startInactivityWatcher();
        renderFloatingSessionPill();
        try {
            window.dispatchEvent(new Event('resize'));
        } catch (e) {}
    }

    // 8. BLOQUEO DEL SITIO POR EXPIRACIÓN O CIERRE MANUAL
    function lockGate(reasonMessage) {
        clearDemoSessionData();
        document.documentElement.classList.add('ah-gate-locked');
        stopInactivityWatcher();
        removeFloatingSessionPill();
        currentInput = '';
        renderGateOverlay(reasonMessage || '⏱️ Sesión expirada por 10 minutos de inactividad. Sesión demo limpiada.');
    }

    // 9. MONITOR DE INACTIVIDAD (10 MINUTOS)
    let lastActivityRecorded = Date.now();
    let throttleTimeout = null;

    function recordUserActivity() {
        const now = Date.now();
        // Throttling a 1.5 segundos para fluidez y ahorro de escritura
        if (!throttleTimeout) {
            throttleTimeout = setTimeout(function () {
                throttleTimeout = null;
            }, 1500);

            // Verificar si ya pasaron los 10 minutos antes de refrescar
            const lastStored = parseInt(localStorage.getItem(STORAGE_KEY_ACTIVITY) || '0', 10);
            if (lastStored > 0 && (now - lastStored) >= INACTIVITY_LIMIT_MS) {
                lockGate('⏱️ Sesión expirada por inactividad de 10 minutos. Sesión demo limpiada.');
                return;
            }

            lastActivityRecorded = now;
            try {
                localStorage.setItem(STORAGE_KEY_ACTIVITY, now.toString());
            } catch (e) {}
            updateFloatingTimer();
        }
    }

    function startInactivityWatcher() {
        stopInactivityWatcher();

        // Preservar la última actividad si ya estaba activa dentro de los 10 min
        const stored = parseInt(localStorage.getItem(STORAGE_KEY_ACTIVITY) || '0', 10);
        const now = Date.now();
        if (stored > 0 && (now - stored) < INACTIVITY_LIMIT_MS) {
            lastActivityRecorded = stored;
        } else {
            lastActivityRecorded = now;
            try {
                localStorage.setItem(STORAGE_KEY_ACTIVITY, lastActivityRecorded.toString());
            } catch (e) {}
        }

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
        events.forEach(function (evt) {
            window.addEventListener(evt, recordUserActivity, { passive: true });
        });

        // Verificación periódica cada 1 segundo para visualización exacta
        inactivityTimerInterval = setInterval(function () {
            const currentNow = Date.now();
            const lastStored = parseInt(localStorage.getItem(STORAGE_KEY_ACTIVITY) || lastActivityRecorded.toString(), 10);
            const elapsed = currentNow - lastStored;

            if (elapsed >= INACTIVITY_LIMIT_MS) {
                lockGate('⏱️ Sesión expirada por inactividad de 10 minutos. Sesión demo limpiada.');
            } else {
                updateFloatingTimer();
            }
        }, 1000);
    }

    function stopInactivityWatcher() {
        if (inactivityTimerInterval) {
            clearInterval(inactivityTimerInterval);
            inactivityTimerInterval = null;
        }
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
        events.forEach(function (evt) {
            window.removeEventListener(evt, recordUserActivity);
        });
    }

    // 10. PÍLDORA FLOTANTE DE SESIÓN CON CONTADOR DE INACTIVIDAD
    function renderFloatingSessionPill() {
        let pill = document.getElementById('ahSessionFloatingPill');
        if (!pill && document.body) {
            pill = document.createElement('div');
            pill.id = 'ahSessionFloatingPill';
            pill.innerHTML = `
                <span style="color: #34d399;">●</span>
                <span id="ahSessionTimeLeft">Inactividad: 10:00</span>
                <button type="button" id="ahBtnLockNow" title="Cerrar sesión demo">Bloquear</button>
            `;
            document.body.appendChild(pill);

            const lockBtn = document.getElementById('ahBtnLockNow');
            if (lockBtn) {
                lockBtn.addEventListener('click', function () {
                    if (confirm('¿Desea bloquear el acceso y eliminar solo las claves locales de esta sesión?')) {
                        lockGate('🔒 Sesión cerrada manualmente por el usuario. Claves propias eliminadas.');
                        window.location.reload();
                    }
                });
            }
        }
        updateFloatingTimer();
    }

    function removeFloatingSessionPill() {
        const pill = document.getElementById('ahSessionFloatingPill');
        if (pill) pill.remove();
    }

    function updateFloatingTimer() {
        const timeEl = document.getElementById('ahSessionTimeLeft');
        if (!timeEl) return;
        const lastStored = parseInt(localStorage.getItem(STORAGE_KEY_ACTIVITY) || lastActivityRecorded.toString(), 10);
        const remainingMs = Math.max(0, INACTIVITY_LIMIT_MS - (Date.now() - lastStored));
        const totalSecs = Math.floor(remainingMs / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        timeEl.innerText = `Inactividad: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 11. CAPTURA DE TECLADO FÍSICO GLOBAL (0-9, Backspace, Escape, Enter)
    window.addEventListener('keydown', function (e) {
        if (document.documentElement.classList.contains('ah-gate-locked')) {
            if (e.key >= '0' && e.key <= '9') {
                handleKeyInput(e.key);
            } else if (e.key === 'Backspace') {
                handleKeyInput('backspace');
            } else if (e.key === 'Escape' || e.key === 'Delete') {
                handleKeyInput('clear');
            } else if (e.key === 'Enter') {
                if (currentInput.length === 4) {
                    validatePin(currentInput);
                }
            }
        }
    });

    // 12. SINCRONIZACIÓN ENTRE PESTAÑAS (STORAGE EVENT)
    window.addEventListener('storage', function (e) {
        if (!e.key || e.key === STORAGE_KEY_AUTH || e.key === STORAGE_KEY_ACTIVITY) {
            if (!isSessionValid()) {
                lockGate('⏱️ Sesión expirada o cerrada desde otra pestaña.');
            } else {
                unlockGate();
            }
        }
    });

    // 13. DETECCIÓN DE CAMBIO DE VISIBILIDAD Y BFCACHE (MÓVIL / PESTAÑAS)
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            if (!isSessionValid()) {
                lockGate('⏱️ Sesión expirada por inactividad de 10 minutos. Sesión demo limpiada.');
            } else {
                updateFloatingTimer();
            }
        }
    });

    window.addEventListener('pageshow', function () {
        if (!isSessionValid()) {
            lockGate();
        } else {
            unlockGate();
        }
    });

    // 14. INICIALIZACIÓN AL CARGAR EL DOM
    function initGate() {
        if (isSessionValid()) {
            unlockGate();
        } else {
            document.documentElement.classList.add('ah-gate-locked');
            renderGateOverlay();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGate);
    } else {
        initGate();
    }
})();
