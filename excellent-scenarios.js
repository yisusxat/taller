/*
 * AndesHome | Escenarios estratégicos comparables
 * Fuente única para la vista simultánea To-Be vs. Excelente.
 * Los valores corresponden a proyecciones del caso, no a mediciones operativas.
 */
const AndesHomeScenarios = Object.freeze({
    tobe: Object.freeze({
        label: 'To-Be convencional · P1–P5',
        capex: '$766,8M',
        capacity: '30.420 pos.',
        otif: '96,2%',
        ebitda: '$856,1M',
        payback: '10,7 meses',
        npv: '$1.289,4M',
        roi: {
            capex: '$766,8M',
            ebitda: '$856,1M',
            npv: '$1.289,4M',
            payback: '10,7 meses',
            label: 'To-Be convencional · P1–P5',
            rows: [
                ['Pesimista (-25%)', 'Captura del 75% por adopción gradual de RF.', '$597,8M', '$619,3M', '16,4 meses'],
                ['Base (100% Target)', 'Cumplimiento de ahorros proyectados en P1–P5.', '$856,1M', '$1.289,4M', '10,7 meses'],
                ['Optimista (+15%)', 'Sinergias con carriers y captura incremental.', '$1.011,1M', '$1.661,6M', '9,1 meses']
            ]
        },
        morph: {
            badge: '● MODO ACTIVO: TO-BE CONVENCIONAL (P1 A P5 ESTÁNDAR)',
            detail: 'Límite 24 Semanas con IT Freeze • 5 Iniciativas • Grúas Reach',
            capex: ['$766.800.000', '#38bdf8', 'Bajo presupuesto techo ($850M) • Aprobado Directorio'],
            capacity: ['30.420 Pos', '#94a3b8', '1.690 racks con 27 pasillos de 3m • 44,3% ocupación actual'],
            speed: ['68,4 lín/HH', '#94a3b8', 'Voice Picking manual por pasillos • 14,2 km/día caminata'],
            cost: ['CLP $5.420', '#cbd5e1', 'Fallido: CLP $8.532 • Margen regular'],
            otif: ['96,2%', '#38bdf8', 'Cyber 95,4% • Cumplimiento de estándar base'],
            ebitda: ['$856.097.000/a', '#94a3b8', 'Base ahorro consolidado 5 proyectos'],
            payback: ['10,7 Meses', '#94a3b8', 'VAN 3a: $1.289M CLP'],
            esg: ['0% Solar (Red Fósil)', '#f87171', 'Gasto $130M/año eléctrico • Trabajo en altura persiste'],
            note: '⚠️ <strong>Diagnóstico Modo To-Be:</strong> Cumple con el presupuesto techo de $850M y resuelve la crisis operativa inmediata en 24 semanas. Sin embargo, no captura el +50% de posiciones adicionales, mantiene pasillos de 3m para grúas reach y pierde $370M CLP/año en ahorros que la robotización Shuttle y la planta solar sí ofrecen.',
            noteBorder: 'rgba(56, 189, 248, 0.4)',
            noteBackground: 'rgba(2, 132, 199, 0.12)'
        }
    }),
    excelente: Object.freeze({
        label: 'Excelente · automatizado',
        capex: '$1.420M',
        capacity: '102.060 pos.',
        otif: '98,7%',
        ebitda: '$1.226,1M',
        payback: '13,9 meses',
        npv: '$1.842,3M',
        roi: {
            capex: '$1.420M',
            ebitda: '$1.226,1M',
            npv: '$1.842,3M',
            payback: '13,9 meses',
            label: 'Excelente · P1–P8 robotizado',
            rows: [
                ['Pesimista (-25%)', 'Adopción gradual y monetización 3PL diferida.', '$919,6M', '$1.006,7M', '18,5 meses'],
                ['Base (100% Target)', 'Captura integral de automatización, energía y Hub 3PL.', '$1.226,1M', '$1.842,3M', '13,9 meses'],
                ['Optimista (+15%)', 'Sinergias completas y monetización acelerada del Hub 3PL.', '$1.410,0M', '$2.227,6M', '11,9 meses']
            ]
        },
        morph: {
            badge: '● MODO ACTIVO: ESCENARIO DE EXCELENCIA (P1 A P8 ROBOTIZADO)',
            detail: 'Sin Límite de Tiempo • 8 Iniciativas Integradas • Shuttle AS/RS',
            capex: ['$1.420.000.000', '#f43f5e', '+$570M sobre techo ($850M) • Amortizado en 5,6m'],
            capacity: ['102.060 Pos', '#38bdf8', '1.428 túneles racks + 30 calles piso • 13,6% ocupación AndesHome'],
            speed: ['220 lín/h', '#34d399', '+221,6% vs To-Be • Shuttle + Cobots AMR GTP'],
            cost: ['CLP $3.850', '#fbbf24', '-29,0% vs To-Be ($5.420) • Fallido baja a $4.820'],
            otif: ['98,7%', '#34d399', 'World-Class Superior • Click & Collect 99,2%'],
            ebitda: ['$1.226.097.000/a', '#38bdf8', '+$370M/año extra sobre To-Be ($856M/a)'],
            payback: ['13,9 Meses', '#a78bfa', 'Recuperación total • VAN 3a: $1.842M CLP'],
            esg: ['65% Solar (ESG)', '#34d399', 'Cero trabajo en altura • -85,5% caminatas operarios'],
            note: '💡 <strong>Visión de Dirección de Operaciones:</strong> Este escenario consolida un sistema logístico predecible y seguro. Al dotar a cada zona de racks 100% dedicados e independientes (1.428 túneles en racks a 6 niveles más 30 calles a piso exclusivo), se alcanzan 102.060 posiciones físicas reales. AndesHome opera con total serenidad al 13,6% de ocupación (13.860 pallets), liberando 88.200 posiciones directas para operar como Hub 3PL multicliente ($600M-$900M CLP/año extras) y reduciendo el costo por pedido a solo $3.850 CLP.',
            noteBorder: 'rgba(52, 211, 153, 0.4)',
            noteBackground: 'rgba(16, 185, 129, 0.12)'
        }
    }),
    delta: Object.freeze({
        label: 'Mejora obtenida',
        capex: '+$653,2M',
        capacity: '+71.640 pos.',
        otif: '+2,5 pp',
        ebitda: '+$370M/año',
        payback: '+3,2 meses',
        npv: '+$552,9M'
    })
});

if (typeof window !== 'undefined') {
    window.AndesHomeScenarios = AndesHomeScenarios;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AndesHomeScenarios;
}
