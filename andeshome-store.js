/* ==========================================================================
   AndesHome Chile S.A. | Single Source of Truth & Data Store (GLA1104 / EA1-EA3)
   Central Data Store: Métricas, Entidades Canónicas, Algoritmos y Motor Financiero
   ========================================================================== */

const AndesHomeStore = (() => {
    // 1. Metadatos Maestros del CD Pudahuel
    const CD_METRICS = {
        name: 'Centro de Distribución Pudahuel',
        company: 'AndesHome Chile S.A.',
        totalAreaM2: 31500,
        totalPalletPositions: 20400,
        inboundDocks: 24,
        outboundDocks: 12,
        activeProviders: 30,
        activeCarriers: 3,
        totalSkus: 450,
        normalDailyDemand: 3560,
        cyberDailyDemandPeak: 14200,
        capexBudgetCeiling: 850000000, // $850M CLP
        discountRateAnnual: 0.12,      // 12%
        projectWbsWeeksCeiling: 36
    };

    // 2. Comparativa Global Crisis (As-Is) vs Optimizado (To-Be)
    const GLOBAL_KPIS = {
        crisis: {
            otifMonth: '80,9%',
            otifCyber: '43,5%',
            otifClickCollect: '11,5%',
            backlogOrders: 15387,
            backlogDemandDays: 4.32,
            unitCostDelivered: '$7.920 CLP',
            failedOrderCost: '$29.628 CLP',
            dockToStockHours: 22.6,
            dockWaitMinutes: 65.2,
            accumulatedDemurrage: '$146.319.000 CLP',
            walkingKmPerDay: 67.6,
            walkingHoursLostPerDay: 23.5,
            mismatchedSkus: 114,
            mismatchedSkusPct: '25,3%',
            pickingErrorRate: '2,44%',
            inventoryAccuracyIRA: '97,74%',
            inventoryDiscrepancyValued: '$388.900.000 CLP',
            sstAccidentRatePer100kHH: 83.8,
            annualLostDaysSST: 53,
            co2PerOrderKg: 2.22,
            customerNps: 5.06,
            customerDetractorsPct: '68,0%'
        },
        optimized: {
            otifMonth: '96,2%',
            otifCyber: '95,4%',
            otifClickCollect: '96,8%',
            backlogOrders: 0,
            backlogDemandDays: 0,
            unitCostDelivered: '$5.675 CLP',
            failedOrderCost: '$8.532 CLP',
            dockToStockHours: 4.5,
            dockWaitMinutes: 12.0,
            accumulatedDemurrage: '$0 CLP',
            walkingKmPerDay: 7.2,
            walkingHoursLostPerDay: 2.5,
            mismatchedSkus: 0,
            mismatchedSkusPct: '0,0%',
            pickingErrorRate: '0,28%',
            inventoryAccuracyIRA: '99,50%',
            inventoryDiscrepancyValued: '< $15.000.000 CLP',
            sstAccidentRatePer100kHH: 4.2,
            annualLostDaysSST: 0,
            co2PerOrderKg: 1.54,
            customerNps: 48.5,
            customerDetractorsPct: '< 5,0%'
        }
    };

    // 3. Zonas del Centro de Distribución y Dimensión Humana
    const ZONES = {
        'ZONE-A': {
            id: 'ZONE-A',
            title: 'Zona A — Rápida Rotación (Pick Express)',
            badge: 'PASILLOS A01 A A06 | DISTANCIA: 35M',
            role: 'Operario de Picking Express',
            color: '#0284c7',
            distanceMeters: 35,
            currentSkus: 84,
            optimalSkus: 105,
            visitasPct: '30,9%',
            prodLinHH: '46,8 lin/HH',
            travelTimePct: '22,7%',
            crisisText: '⚠️ Saturación en CyberDay: Congestión masiva de operarios en pasillos A01-A03 por falta de capacidad y retrasos en picking con papel.',
            optText: '✨ Capacidad ampliada a 105 SKU (+25%). Voice Picking WMS elimina detenciones y eleva productividad a 55,2 lin/HH (+18%).',
            humanCrisis: 'En pasillos de 2,4m de ancho, hasta 6 operarios con transpaletas manuales y listas de papel arrugadas chocan intentando cruzar. El estrés por la hora de corte provoca discusiones, fatiga y errores en cascada.',
            humanOpt: 'Flujo unidireccional despejado y picking manos libres por comando de voz (Voice Picking). El operario trabaja sereno, sin papeles ni distracciones, reduciendo su fatiga y terminando su turno a tiempo.',
            action: 'Re-slotting P1 + Voice Picking P2',
            aisles: ['PASILLO A-01', 'PASILLO A-02', 'PASILLO A-03', 'PASILLO A-04', 'PASILLO A-05', 'PASILLO A-06']
        },
        'ZONE-B': {
            id: 'ZONE-B',
            title: 'Zona B — Media Rotación (Standard)',
            badge: 'PASILLOS B01 A B12 | DISTANCIA: 72M',
            role: 'Preparador de Pedidos Estándar',
            color: '#6366f1',
            distanceMeters: 72,
            currentSkus: 125,
            optimalSkus: 120,
            visitasPct: '38,2%',
            prodLinHH: '37,6 lin/HH',
            travelTimePct: '31,7%',
            crisisText: 'Operación balanceada pero afectada por retrasos en putaway desde staging inbound, generando quiebres en picking nocturno.',
            optText: '✨ Reposición preventiva sincronizada por WMS NextGen y terminales RF.',
            humanCrisis: 'El operario llega al rack y la ubicación está vacía (quiebre de stock en picking). Debe esperar 25 minutos de brazos cruzados a que una grúa baje un pallet desde altura, sintiendo la impotencia de no poder cumplir su meta.',
            humanOpt: 'Reposición preventiva automática: cuando quedan 2 cajas, el sistema ya envió al grullero para reponer. El operario jamás encuentra una posición desabastecida.',
            action: 'Estandarización de Olas',
            aisles: ['PASILLO B-01/02', 'PASILLO B-03/04', 'PASILLO B-05/06', 'PASILLO B-07/08', 'PASILLO B-09/10', 'PASILLO B-11/12']
        },
        'ZONE-C': {
            id: 'ZONE-C',
            title: 'Zona C — Lenta Rotación (Pasillos Profundos)',
            badge: 'PASILLOS C01 A C06 | DISTANCIA: 118M',
            role: 'Operario de Turno Noche',
            color: '#f59e0b',
            distanceMeters: 118,
            currentSkus: 154,
            optimalSkus: 147,
            visitasPct: '18,5%',
            prodLinHH: '27,8 lin/HH',
            travelTimePct: '42,9%',
            crisisText: '🚨 Slotting Mismatch Crítico: 12 SKU de Alta Venta (ej. Cocina A) ubicados al fondo del CD obligan a caminar 28,4 km adicionales al día.',
            optText: '✨ Los 12 SKU Clase A fueron extraídos hacia la Zona A. El tiempo de viaje se reduce en un 64%.',
            humanCrisis: 'Juan debe caminar hasta el fondo de la bodega (118 metros) solo para buscar una Cocina o Sartén mal clasificado. Camina 14 km por noche solo por 12 productos extraviados. Al final del turno sufre dolores lumbares y pies hinchados.',
            humanOpt: 'Los 12 productos estrella fueron trasladados a la entrada (Zona A). La caminata diaria cae de 67 km a solo 7 km distribuidos. Menos desgaste físico y una jornada laboral digna y eficiente.',
            action: 'Extracción Prioritaria P1',
            aisles: ['PASILLO C-01', 'PASILLO C-02', 'PASILLO C-03', 'PASILLO C-04', 'PASILLO C-05', 'PASILLO C-06']
        },
        'ZONE-D': {
            id: 'ZONE-D',
            title: 'Zona D — Carga Pesada & Voluminosa (Bulky)',
            badge: 'PASILLOS D01 A D03 | DISTANCIA: 154M',
            role: 'Operador de Carga Pesada (SST)',
            color: '#f43f5e',
            distanceMeters: 154,
            currentSkus: 87,
            optimalSkus: 78,
            visitasPct: '12,4%',
            prodLinHH: '17,3 lin/HH',
            travelTimePct: '39,1%',
            crisisText: '⚠️ Alerta de Seguridad SST: 38 SKU >25 kg se manipulan a pulso sin ayuda mecánica. Tasa de accidentabilidad 83,8/100k HH (Fiscalización DT).',
            optText: '✨ 4 mesas elevadoras hidráulicas y transpaletas eléctricas operativas. Cero manipulación manual sobre 25 kg.',
            humanCrisis: 'Pedro y un compañero levantan hornos y estufas de 42 kg a pulso sobre una transpaleta porque las mesas elevadoras están rotas. Existe miedo constante a una hernia o lumbago (17 sobreesfuerzos y 53 días perdidos al año).',
            humanOpt: '4 mesas hidráulicas que ajustan la carga a la altura del pecho y transpaletas eléctricas. Cero levantamiento manual sobre 25 kg. Tranquilidad total para el trabajador y su familia.',
            action: 'Right-Sizing & Ergonomía P5',
            aisles: ['RACK BULKY D-01', 'RACK BULKY D-02', 'RACK BULKY D-03']
        },
        'INBOUND': {
            id: 'INBOUND',
            title: 'Andenes Inbound & Área de Recepción',
            badge: '24 ANDENES DE DESCARGA | STAGING Y QC',
            role: 'Chofer de Camión & Recepcionista',
            color: '#38bdf8',
            distanceMeters: 0,
            currentSkus: 450,
            optimalSkus: 450,
            visitasPct: '120 camiones/semana',
            prodLinHH: 'Dock-to-Stock: 22,6h',
            travelTimePct: 'Espera camión: 65,2 min',
            crisisText: '🛑 Colapso de andenes: Solo 43% de citas y ASN. Camiones en cola generando $146,3M en cobros de sobreestadía (demurrage).',
            optText: '✨ Portal ASN y YMS de citas operando con ventanas de 2 horas. Dock-to-Stock reducido a 4,5 horas.',
            humanCrisis: 'Marcelo, transportista que viajó de noche desde San Antonio, espera más de 65 minutos estacionado afuera de la bodega con frío y sin baño. Cada hora perdida es dinero que no lleva a su hogar, mientras AndesHome acumula $146M en multas.',
            humanOpt: 'Marcelo reserva su cita en una ventana de 2 horas desde su celular. Llega a Pudahuel, el andén lo espera despejado, descarga en 45 minutos y sigue su ruta sin esperas humillantes.',
            action: 'Portal ASN & YMS P3',
            aisles: ['AND-01 a AND-12', 'Área de Staging QC']
        },
        'OUTBOUND': {
            id: 'OUTBOUND',
            title: 'Andenes Despacho & Flota Última Milla',
            badge: 'EXPEDICIÓN, CONSOLIDACIÓN & TMS',
            role: 'Cliente Final & Repartidor',
            color: '#10b981',
            distanceMeters: 0,
            currentSkus: 450,
            optimalSkus: 450,
            visitasPct: '3.560 pedidos/día',
            prodLinHH: '11,5% entregas fallidas',
            travelTimePct: 'Costo falla: $29.628',
            crisisText: '🚨 11,5% de envíos fallidos por datos erróneos de cubicaje y falta de prueba de entrega móvil (POD). Sobrecosto masivo en reintentos.',
            optText: '✨ TMS con ruteo dinámico por cubicaje y aplicación móvil chofer (POD digital). Tasa de falla cae a ≤2,8%.',
            humanCrisis: 'Camila compró el regalo de cumpleaños de su hijo en CyberDay con promesa de 48 horas. Pasan 12 días, el chofer se pierde por falta de app con GPS y la caja llega rota. Camila llama frustrada a servicio al cliente jurando nunca más comprar.',
            humanOpt: 'El repartidor recibe la ruta óptima en su celular con foto y firma digital. La caja viaja con embalaje a medida. Camila recibe su producto a tiempo, intacto y califica el servicio con 5 estrellas.',
            action: 'TMS Ruteo Dinámico P4',
            aisles: ['E-COM RM', 'CLICK & COLLECT', 'REPOSICIÓN TIENDAS', 'BULKY DOMICILIO']
        }
    };

    // 4. Canales de Distribución y Modelo APQC
    const CHANNELS = {
        'ALL': { id: 'ALL', name: 'Todos los Canales', badge: 'RED OMNICANAL' },
        'ECOM_RM': {
            id: 'ECOM_RM',
            name: 'E-commerce RM',
            badge: '1.784 ÓRDENES',
            onTime: 88.6,
            complete: 95.5,
            damageFree: 99.2,
            docCorrect: 99.6,
            otif: 85.1,
            perfectOrder: 84.0,
            unitCostNormal: 11419,
            unitCostPeak: 21107,
            leadTimePromised: 48,
            leadTimeCyber: 78.2,
            pillClass: 'ecom',
            story: 'Familias de Santiago que compraron con promesa de 48h sufrieron un retraso medio a 78,2h por colas en packing.'
        },
        'CLICK_COLLECT': {
            id: 'CLICK_COLLECT',
            name: 'Click & Collect',
            badge: '570 ÓRDENES',
            onTime: 78.4,
            complete: 95.3,
            damageFree: 99.1,
            docCorrect: 99.3,
            otif: 75.1,
            perfectOrder: 73.7,
            unitCostNormal: 12227,
            unitCostPeak: 23450,
            leadTimePromised: 24,
            leadTimeCyber: 46.5,
            pillClass: 'cc',
            story: 'El canal más vulnerable: en CyberDay el cumplimiento cayó al 11,5%. Clientes viajaron a la tienda en vano.'
        },
        'STORES': {
            id: 'STORES',
            name: 'Reposición Tiendas',
            badge: '415 ÓRDENES',
            onTime: 81.9,
            complete: 94.2,
            damageFree: 99.3,
            docCorrect: 99.6,
            otif: 77.8,
            perfectOrder: 77.6,
            unitCostNormal: 16647,
            unitCostPeak: 26800,
            leadTimePromised: 30,
            leadTimeCyber: 36.2,
            pillClass: 'tiendas',
            story: '58 tiendas físicas en todo Chile sufrieron quiebres de góndola por retrasos en putaway y picking paletizado.'
        },
        'BULKY': {
            id: 'BULKY',
            name: 'Bulky Domicilio',
            badge: '350 ÓRDENES',
            onTime: 91.8,
            complete: 94.8,
            damageFree: 99.6,
            docCorrect: 99.6,
            otif: 86.6,
            perfectOrder: 86.1,
            unitCostNormal: 11031,
            unitCostPeak: 19800,
            leadTimePromised: 72,
            leadTimeCyber: 96.0,
            pillClass: 'bulky',
            story: 'Productos pesados (>25 kg) que generaron alto riesgo SST para el equipo y daños de empaque por falta de esquineros.'
        }
    };

    // 5. Catálogo de Búsqueda de SKU con Radar y Diagnóstico de Mismatch
    const SKU_CATALOG = [
        {
            sku: 'SKU-0005',
            name: 'Cocina A Gas 4 Platos Premium',
            category: 'Línea Blanca / Cocina',
            weightKg: 38.5,
            currentZone: 'ZONE-C',
            currentLocation: 'Pasillo C-03 (118 metros)',
            optimalZone: 'ZONE-A',
            optimalLocation: 'Pasillo A-02 (35 metros)',
            isMismatch: true,
            excessWalkPerDay: 9977,
            rotacion: 'Clase A (Alta Venta)',
            impact: 'Obliga a caminar 9,9 km extras diarios por estar al fondo del almacén. Violación de MMC >25 kg en movimiento.'
        },
        {
            sku: 'SKU-0003',
            name: 'Set Taladro Percutor + Maletín Herramientas',
            category: 'Ferretería Profesional',
            weightKg: 8.2,
            currentZone: 'ZONE-D',
            currentLocation: 'Rack Bulky D-02 (154 metros)',
            optimalZone: 'ZONE-A',
            optimalLocation: 'Pasillo A-04 (35 metros)',
            isMismatch: true,
            excessWalkPerDay: 14256,
            rotacion: 'Clase A (Alta Venta)',
            impact: 'Almacenado erróneamente en zona pesada a 154 metros. Genera 14,2 km de caminata vacía diaria.'
        },
        {
            sku: 'SKU-0118',
            name: 'Juego de Sábanas 300 Hilos Queen',
            category: 'Dormitorio & Textil',
            weightKg: 1.8,
            currentZone: 'ZONE-B',
            currentLocation: 'Pasillo B-05 (72 metros)',
            optimalZone: 'ZONE-A',
            optimalLocation: 'Pasillo A-01 (35 metros)',
            isMismatch: true,
            excessWalkPerDay: 4200,
            rotacion: 'Clase A (Alta Venta)',
            impact: 'Carece de código EAN-13 estándar (DQ-02). Causa 25% más errores de picking en turno noche.'
        },
        {
            sku: 'SKU-0023',
            name: 'Refrigerador No Frost 380L Inox',
            category: 'Electrohogar Mayor',
            weightKg: 64.0,
            currentZone: 'ZONE-D',
            currentLocation: 'Rack Bulky D-01 (154 metros)',
            optimalZone: 'ZONE-D',
            optimalLocation: 'Rack Bulky D-01 (154 metros)',
            isMismatch: false,
            excessWalkPerDay: 0,
            rotacion: 'Clase B (Voluminoso)',
            impact: 'Correcto en zona pesada, pero manipulado manualmente sin mesa tijera. Presenta discrepancia de stock >15% (DQ-03).'
        },
        {
            sku: 'SKU-0010',
            name: 'Hervidor Eléctrico Acero 1.7L',
            category: 'Pequeño Electrodoméstico',
            weightKg: 1.2,
            currentZone: 'ZONE-C',
            currentLocation: 'Pasillo C-01 (118 metros)',
            optimalZone: 'ZONE-A',
            optimalLocation: 'Pasillo A-03 (35 metros)',
            isMismatch: true,
            excessWalkPerDay: 7850,
            rotacion: 'Clase A (Alta Venta)',
            impact: 'Producto liviano de alta venta oculto en pasillos profundos. Mover prioritario a Pick Express P1.'
        },
        {
            sku: 'SKU-0044',
            name: 'Sofá Seccional 3 Cuerpos Felpa',
            category: 'Living & Muebles',
            weightKg: 52.0,
            currentZone: 'ZONE-D',
            currentLocation: 'Rack Bulky D-03 (154 metros)',
            optimalZone: 'ZONE-D',
            optimalLocation: 'Rack Bulky D-03 (154 metros)',
            isMismatch: false,
            excessWalkPerDay: 0,
            rotacion: 'Clase C (Bulky Pesado)',
            impact: 'Volumen mayor. Requiere mesa elevadora hidráulica P5 y packaging homologado contra daños en ruta.'
        }
    ];

    // 6. Proyectos del Portafolio y Parámetros Financieros (P1 a P7)
    const PROJECTS = {
        p1: {
            id: 'p1',
            name: 'P1: Re-slotting ABC + 5S + Conteos Cíclicos',
            tag: 'Re-slotting ABC',
            capex: 85000000,
            opex: 12000000,
            otifGain: 12.0,
            errorReductionPct: 35,
            wbsWeeks: 6,
            paybackMonths: 3.2,
            type: 'selected',
            desc: 'Reubica 114 SKU desalineados. Elimina 67,6 km/día de caminata y ahorra $585M en traslados inútiles.',
            humanBenefit: 'Devuelve las piernas al operario: camina 64% menos en bodega.'
        },
        p2: {
            id: 'p2',
            name: 'P2: Upgrade WMS NextGen + Voice Picking / RF',
            tag: 'WMS Voice Picking',
            capex: 310000000,
            opex: 75000000,
            otifGain: 18.5,
            errorReductionPct: 75,
            wbsWeeks: 18,
            paybackMonths: 11.4,
            type: 'selected',
            desc: 'Elimina papel y lápiz. Voice picking con manos libres eleva productividad +18% y baja errores a ≤0,3%.',
            humanBenefit: 'Ojos y manos libres: trabajo sereno sin papeles ni estrés de equivocarse.'
        },
        p3: {
            id: 'p3',
            name: 'P3: Portal ASN & YMS de Citas Proveedores',
            tag: 'Portal ASN & YMS',
            capex: 95000000,
            opex: 24000000,
            otifGain: 8.0,
            errorReductionPct: 20,
            wbsWeeks: 12,
            paybackMonths: 4.8,
            type: 'selected',
            desc: 'Agendamiento digital en ventanas de 2h. Reduce Dock-to-Stock de 22,6h a 4,5h y erradica $146M en demurrage.',
            humanBenefit: 'Dignidad para el chofer: descarga en 45 minutos sin esperas humillantes en la berma.'
        },
        p4: {
            id: 'p4',
            name: 'P4: TMS Ruteo Dinámico + POD Chofer Móvil',
            tag: 'TMS Ruteo Dinámico',
            capex: 150000000,
            opex: 48000000,
            otifGain: 11.2,
            errorReductionPct: 60,
            wbsWeeks: 14,
            paybackMonths: 8.6,
            type: 'selected',
            desc: 'Algoritmo de cubicaje dinámico y app chofer con firma y foto digital. Reduce fallas de 11,5% a ≤2,8%.',
            humanBenefit: 'Certeza para el cliente y el repartidor: rutas seguras y entregas a la primera.'
        },
        p5: {
            id: 'p5',
            name: 'P5: Right-Sizing y Ergonomía D-Bulky',
            tag: 'Ergonomía & Mesas',
            capex: 70000000,
            opex: 18000000,
            otifGain: 3.0,
            errorReductionPct: 40,
            wbsWeeks: 8,
            paybackMonths: 6.1,
            type: 'selected',
            desc: '4 mesas elevadoras hidráulicas en D-Bulky + 6 cajas homologadas. Cero levantamiento >25 kg a pulso.',
            humanBenefit: 'Protección a la columna y la vida del trabajador: 100% de cumplimiento ley laboral.'
        },
        p6: {
            id: 'p6',
            name: 'P6: Flota Robots AMR / Cobots AGV (Descartado)',
            tag: 'Robots AMR (Excede)',
            capex: 420000000,
            opex: 65000000,
            otifGain: 6.5,
            errorReductionPct: 50,
            wbsWeeks: 42,
            paybackMonths: 38.0,
            type: 'discarded',
            desc: 'Robots autónomos de picking. DESCARTADO por exceder el techo de $850M ($1.130M total) y tomar 42 semanas.',
            humanBenefit: 'Riesgo de rechazo por el equipo y desbordamiento presupuestario.'
        },
        p7: {
            id: 'p7',
            name: 'P7: Planta Solar Fotovoltaica CD (Postergado)',
            tag: 'Planta Solar (Fase 2)',
            capex: 180000000,
            opex: 8000000,
            otifGain: 0.5,
            errorReductionPct: 0,
            wbsWeeks: 20,
            paybackMonths: 48.0,
            type: 'postponed',
            desc: 'Paneles solares en techo del CD. POSTERGADO a Fase 2: no resuelve la crisis operativa de CyberDay.',
            humanBenefit: 'Sostenibilidad diferida sin impacto en el servicio inmediato.'
        }
    };

    // 7. Motor de Cálculo Financiero y Portafolio Reactivo
    function calculatePortfolio(activeProjectKeys) {
        let rawCapex = 0;
        let annualOpex = 0;
        let cumulativeOtifGain = 0;

        activeProjectKeys.forEach(key => {
            const p = PROJECTS[key];
            if (p) {
                rawCapex += p.capex;
                annualOpex += p.opex;
                cumulativeOtifGain += p.otifGain;
            }
        });

        // 8% reserva de contingencia recomendada por Directorio
        const contingencyBuffer = rawCapex * 0.08;
        const totalCapex = rawCapex + contingencyBuffer;

        // Ahorros brutos anuales estimados según sinergias
        let grossAnnualSavings = 0;
        if (activeProjectKeys.includes('p1')) grossAnnualSavings += 285000000; // Viajes y horas hombre
        if (activeProjectKeys.includes('p2')) grossAnnualSavings += 348000000; // Errores y papel
        if (activeProjectKeys.includes('p3')) grossAnnualSavings += 146300000; // Demurrage
        if (activeProjectKeys.includes('p4')) grossAnnualSavings += 184500000; // Entregas fallidas y fletes
        if (activeProjectKeys.includes('p5')) grossAnnualSavings += 69297000;  // Daños y licencias SST

        const netAnnualEbitda = Math.max(0, grossAnnualSavings - annualOpex);

        // VAN a 3 años con tasa de descuento r = 12%
        const r = CD_METRICS.discountRateAnnual;
        let npv = -totalCapex;
        for (let t = 1; t <= 3; t++) {
            npv += netAnnualEbitda / Math.pow(1 + r, t);
        }

        // Payback simple en meses
        const paybackMonths = netAnnualEbitda > 0 ? (totalCapex / netAnnualEbitda) * 12 : 999;

        // OTIF proyectado acotado al 97.5%
        const baseOtif = 43.5;
        const projectedOtif = Math.min(97.5, baseOtif + cumulativeOtifGain);

        const isExceededCapex = totalCapex > CD_METRICS.capexBudgetCeiling;

        return {
            rawCapex,
            contingencyBuffer,
            totalCapex,
            annualOpex,
            grossAnnualSavings,
            netAnnualEbitda,
            npv,
            paybackMonths,
            projectedOtif,
            isExceededCapex,
            budgetCeiling: CD_METRICS.capexBudgetCeiling,
            budgetRemaining: CD_METRICS.capexBudgetCeiling - totalCapex
        };
    }

    // 8. Lead Time Ladder (Valor Agregado vs Desperdicio)
    const LEAD_TIME_LADDER = {
        valueAddedHours: 8.9,      // Descarga, picking, empaque, tránsito
        nonValueAddedHours: 69.3,  // Colas en staging, cola de 28h en packing, espera de carriers
        totalCycleHours: 78.2,
        valueAddedPct: 11.4,
        nonValueAddedPct: 88.6
    };

    // 9. Roadmap WBS Maestro (24 Semanas)
    const WBS_PHASES = [
        { phase: 1, name: 'Fase 1: Saneamiento & Quick Wins', weeks: 'Sem 1 a 6', deliverables: 'Re-slotting 114 SKU (P1), 5S, corrección EAN-13 (DQ-02), mesas D-Bulky (P5)' },
        { phase: 2, name: 'Fase 2: WMS Core & Radiofrecuencia', weeks: 'Sem 7 a 14', deliverables: 'Configuración Voice Picking, RF en pasillos A y B, congelamiento de TI (Sem 10 a 13)' },
        { phase: 3, name: 'Fase 3: Integración ASN & TMS', weeks: 'Sem 15 a 20', deliverables: 'Portal YMS proveedores (P3), algoritmo TMS cubicaje y app móvil chofer (P4)' },
        { phase: 4, name: 'Fase 4: Go-Live & Estabilización', weeks: 'Sem 21 a 24', deliverables: 'Pruebas de estrés volumen Cyber, simulacro omnicanal, estabilizado 12 sem antes de Cyber 2027' }
    ];

    // 10. Trazado Canónico de las 3 Fases Maestras (EA1 -> EA2 -> EA3)
    const PHASE_STORYLINE = {
        1: {
            phaseNumber: 1,
            code: 'EA1',
            title: 'Fase 1: Diagnóstico Integral',
            subtitle: 'Línea Base CyberDay, Causas Raíz & Layout 2D',
            badge: 'AS-IS • CRISIS OPERACIONAL',
            color: '#f43f5e',
            kpiHighlight: 'OTIF 43,5% | Backlog 15.387 | 67,6 km/día',
            targetTab: 'view-layout',
            mode: 'crisis',
            description: 'Evidencia analítica del colapso del CD Pudahuel. Saturación al 96,4%, desalineación de 114 SKUs, 88,6% de muda en VSM y cola de 28h en packing.'
        },
        2: {
            phaseNumber: 2,
            code: 'EA2',
            title: 'Fase 2: Propuesta y Soluciones',
            subtitle: 'Portafolio P1-P5, Arquitectura & WBS 24 Semanas',
            badge: 'TO-BE • SOLUCIÓN SINÉRGICA',
            color: '#38bdf8',
            kpiHighlight: 'CAPEX $766,8M (8% res) | AHP 9,25/10 | WBS 24 sem',
            targetTab: 'view-propuesta',
            mode: 'optimized',
            description: 'Rediseño integral mediante 5 iniciativas sinérgicas respetando el techo directivo de $850M CLP, evaluación multicriterio AHP y cronograma con IT Freeze.'
        },
        3: {
            phaseNumber: 3,
            code: 'EA3',
            title: 'Fase 3: Resultados Obtenidos y Beneficios',
            subtitle: 'Recuperación de Servicio, Retorno VAN & Dignificación Humana',
            badge: 'IMPACTO • RETORNO & ESG',
            color: '#10b981',
            kpiHighlight: 'OTIF 96,2% | VAN $1.289M | Payback 10,7m',
            targetTab: 'view-resultados',
            mode: 'optimized',
            description: 'Retorno sobre la inversión de $1.289M CLP, erradicación del backlog, 0 levantamiento >25 kg a pulso y estabilización 12 semanas antes de Cyber 2027.'
        }
    };

    // API Pública
    return {
        CD_METRICS,
        GLOBAL_KPIS,
        ZONES,
        CHANNELS,
        SKU_CATALOG,
        PROJECTS,
        calculatePortfolio,
        LEAD_TIME_LADDER,
        WBS_PHASES,
        PHASE_STORYLINE
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AndesHomeStore;
}
