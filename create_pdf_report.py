import os
import subprocess
import base64

def get_base64_image(filename):
    if os.path.exists(filename):
        with open(filename, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            ext = os.path.splitext(filename)[1].lower().replace(".", "")
            if ext == "jpg": ext = "jpeg"
            return f"data:image/{ext};base64,{encoded}"
    return ""

print("Encoding blueprint images...")
img_layout = get_base64_image("layout_cd_pudahuel_2d_4k.jpg")
img_volumetric = get_base64_image("planimetria_interna_balance_volumetrico_4k.jpg")

print("Generating full executive HTML report...")

html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Informe Maestro: Escenario de Excelente - CD Pudahuel - AndesHome Chile S.A.</title>
<style>
    @page {{
        size: letter;
        margin: 14mm 14mm 14mm 14mm;
        @bottom-right {{
            content: "Página " counter(page);
        }}
    }}

    *, *:before, *:after {{
        box-sizing: border-box;
    }}

    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        background: #ffffff;
        line-height: 1.5;
        font-size: 9.5pt;
        margin: 0;
        padding: 0;
    }}

    .page-break {{
        page-break-before: always;
        break-before: page;
    }}

    .avoid-break {{
        page-break-inside: avoid;
        break-inside: avoid;
    }}

    /* PORTADA */
    .cover-page {{
        height: 100%;
        min-height: 960px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 40px 30px;
        background: linear-gradient(145deg, #070e1c 0%, #0f1f38 100%);
        color: #ffffff;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
    }}

    .cover-top {{
        border-bottom: 2px solid #0284c7;
        padding-bottom: 25px;
    }}

    .cover-brand {{
        font-size: 14pt;
        font-weight: 800;
        letter-spacing: 2px;
        color: #38bdf8;
        text-transform: uppercase;
    }}

    .cover-company {{
        font-size: 9pt;
        color: #94a3b8;
        letter-spacing: 1px;
        margin-top: 4px;
    }}

    .cover-main {{
        margin: 60px 0;
    }}

    .cover-badge {{
        display: inline-block;
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.5);
        font-size: 8pt;
        font-weight: 800;
        padding: 4px 12px;
        border-radius: 999px;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 15px;
    }}

    .cover-title {{
        font-size: 26pt;
        font-weight: 900;
        line-height: 1.15;
        color: #ffffff;
        margin: 0 0 15px 0;
    }}

    .cover-subtitle {{
        font-size: 13pt;
        font-weight: 400;
        line-height: 1.4;
        color: #cbd5e1;
        max-width: 650px;
    }}

    .cover-grid {{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-top: 40px;
    }}

    .cover-stat-box {{
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 12px 14px;
    }}

    .cover-stat-num {{
        font-size: 15pt;
        font-weight: 800;
        color: #38bdf8;
        font-family: 'JetBrains Mono', Consolas, monospace;
    }}

    .cover-stat-lbl {{
        font-size: 7.5pt;
        color: #94a3b8;
        text-transform: uppercase;
        margin-top: 4px;
        font-weight: 700;
    }}

    .cover-footer {{
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 8pt;
        color: #94a3b8;
    }}

    /* HEADERS & TYPOGRAPHY */
    .doc-header {{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 6px;
        margin-bottom: 16px;
        font-size: 7.5pt;
        color: #64748b;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }}

    .doc-header strong {{
        color: #0284c7;
        font-weight: 700;
    }}

    h1.sec-title {{
        font-size: 15pt;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 6px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 2px solid #0284c7;
        padding-bottom: 4px;
    }}

    h2.subsec-title {{
        font-size: 11pt;
        font-weight: 800;
        color: #0369a1;
        margin: 14px 0 6px 0;
    }}

    p {{
        margin: 0 0 9px 0;
        text-align: justify;
    }}

    .lead-paragraph {{
        font-size: 10pt;
        font-weight: 500;
        color: #1e293b;
        line-height: 1.6;
        margin-bottom: 12px;
    }}

    /* HIGHLIGHT CARDS */
    .kpi-row {{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin: 12px 0 16px 0;
    }}

    .kpi-card {{
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-left: 4px solid #0284c7;
        border-radius: 6px;
        padding: 9px 12px;
    }}

    .kpi-card.emerald {{
        border-left-color: #10b981;
        background: #f0fdf4;
    }}

    .kpi-card.amber {{
        border-left-color: #f59e0b;
        background: #fffbeb;
    }}

    .kpi-card.rose {{
        border-left-color: #f43f5e;
        background: #fff1f2;
    }}

    .kpi-card-lbl {{
        font-size: 7.2pt;
        text-transform: uppercase;
        font-weight: 700;
        color: #64748b;
    }}

    .kpi-card-val {{
        font-size: 13.5pt;
        font-weight: 900;
        color: #0f172a;
        font-family: 'JetBrains Mono', Consolas, monospace;
        margin: 2px 0 1px 0;
    }}

    .kpi-card-sub {{
        font-size: 7pt;
        color: #64748b;
    }}

    /* TABLES */
    table.rep-table {{
        width: 100%;
        border-collapse: collapse;
        font-size: 8.2pt;
        margin: 10px 0 14px 0;
    }}

    table.rep-table th {{
        background: #0f172a;
        color: #ffffff;
        font-weight: 700;
        padding: 7px 9px;
        text-align: left;
        border: 1px solid #1e293b;
        font-size: 7.5pt;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }}

    table.rep-table td {{
        padding: 6px 9px;
        border: 1px solid #cbd5e1;
        color: #334155;
        vertical-align: middle;
    }}

    table.rep-table tr:nth-child(even) td {{
        background: #f8fafc;
    }}

    table.rep-table td.num {{
        text-align: right;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-weight: 700;
    }}

    table.rep-table td.danger {{
        color: #be123c;
    }}

    table.rep-table td.success {{
        color: #047857;
    }}

    /* CALLOUT BOXES */
    .callout {{
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-left: 4px solid #0284c7;
        border-radius: 6px;
        padding: 9px 12px;
        margin: 11px 0;
        font-size: 8.8pt;
        line-height: 1.5;
    }}

    .callout.warning {{
        background: #fffbeb;
        border-color: #fde68a;
        border-left-color: #f59e0b;
    }}

    .callout.success {{
        background: #ecfdf5;
        border-color: #a7f3d0;
        border-left-color: #10b981;
    }}

    .callout-title {{
        font-weight: 800;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        gap: 6px;
        color: #0369a1;
    }}

    .callout.warning .callout-title {{
        color: #b45309;
    }}

    .callout.success .callout-title {{
        color: #047857;
    }}

    /* IMAGE CONTAINER */
    .img-box {{
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 6px;
        background: #f8fafc;
        margin: 12px 0;
        text-align: center;
    }}

    .img-box img {{
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        display: block;
        margin: 0 auto;
    }}

    .img-caption {{
        font-size: 7.5pt;
        color: #64748b;
        margin-top: 5px;
        font-style: italic;
    }}

    .badge-chip {{
        display: inline-block;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 7pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }}

    .badge-chip.blue {{ background: #e0f2fe; color: #0369a1; }}
    .badge-chip.emerald {{ background: #d1fae5; color: #065f46; }}
    .badge-chip.amber {{ background: #fef3c7; color: #92400e; }}
    .badge-chip.rose {{ background: #ffe4e6; color: #9f1239; }}
</style>
</head>
<body>

    <!-- ================================================================= -->
    <!-- PORTADA DEL INFORME EJECUTIVO                                      -->
    <!-- ================================================================= -->
    <div class="cover-page">
        <div class="cover-top">
            <div class="cover-brand">AndesHome Chile S.A.</div>
            <div class="cover-company">Dirección de Logística, Cadena de Suministro y Operaciones Omnicanal</div>
        </div>

        <div class="cover-main">
            <span class="cover-badge">★ PROYECTO ESTRATÉGICO DE TRANSFORMACIÓN LOGÍSTICA</span>
            <h1 class="cover-title">INFORME INTEGRAL DE PROYECTO:<br>ESCENARIO DE EXCELENTE</h1>
            <div class="cover-subtitle">
                Arquitectura de Desacople Central (102.060 Posiciones Físicas), Automatización AS/RS con Pallet Shuttle, Robótica Móvil AMR y Modelo Operacional World-Class para el Centro de Distribución Pudahuel
            </div>

            <div class="cover-grid">
                <div class="cover-stat-box">
                    <div class="cover-stat-num">102.060</div>
                    <div class="cover-stat-lbl">Posiciones Físicas Seguras</div>
                </div>
                <div class="cover-stat-box">
                    <div class="cover-stat-num">98,7%</div>
                    <div class="cover-stat-lbl">Nivel de Servicio OTIF</div>
                </div>
                <div class="cover-stat-box">
                    <div class="cover-stat-num">$3.850</div>
                    <div class="cover-stat-lbl">Costo por Pedido (-51,4%)</div>
                </div>
                <div class="cover-stat-box">
                    <div class="cover-stat-num">1,8 Años</div>
                    <div class="cover-stat-lbl">Payback Consolidado</div>
                </div>
            </div>
        </div>

        <div class="cover-footer">
            <div>
                <strong>Instalación:</strong> CD Pudahuel (150m × 210m = 31.500 m²)<br>
                <strong>Región:</strong> Metropolitana de Santiago, Chile &bull; Eje Américo Vespucio
            </div>
            <div style="text-align: right;">
                <strong>Destinatario:</strong> Directorio Ejecutivo &amp; Comité de Operaciones<br>
                <strong>Fecha:</strong> Octubre 2026 &bull; Versión Oficial 2.0 (Aprobación)
            </div>
        </div>
    </div>

    <!-- ================================================================= -->
    <!-- PÁGINA 2: CARTA AL DIRECTORIO Y RESUMEN HUMANIZADO                -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 1: Carta Ejecutiva &amp; Visión Estratégica</span>
    </div>

    <h1 class="sec-title">1. Carta al Directorio: La Transformación desde la Realidad Operativa</h1>

    <p class="lead-paragraph">
        <strong>Estimados miembros del Directorio Ejecutivo y Comité de Operaciones:</strong><br>
        Durante la primera semana de junio de 2026, la contingencia del evento CyberDay expuso con crudeza los límites físicos y emocionales de nuestra operación en el Centro de Distribución Pudahuel. La cifra del 43,5% de cumplimiento de servicio (OTIF) y los 15.387 pedidos atrapados en backlog no fueron simples desvíos estadísticos en una hoja de cálculo: fueron el reflejo de turnos de noche asfixiantes, de operarios recorriendo a pie más de 67 kilómetros diarios con planillas arrugadas entre pasillos congestionados, y de cientos de familias llamando angustiadas al servicio al cliente porque la compra de su hogar no llegaba a tiempo.
    </p>

    <p>
        El análisis riguroso de terreno demostró una verdad categórica: <strong>el CD Pudahuel no carecía de espacio físico total</strong>. Los 31.500 m² de nave representaban una base patrimonial formidable; lo que había colapsado era la capacidad de flujo, la ergonomía laboral y la arquitectura de almacenamiento. Mantener el diseño convencional significaba condenar a la compañía a un gasto destructivo de más de <strong>CLP $3.919 Millones anuales en sobrecostos</strong> por horas extras ineficientes, personal externo de emergencia sin capacitación, fletes urgentes y multas por demoras.
    </p>

    <div class="callout success avoid-break">
        <div class="callout-title">🎯 El Mandato del Escenario de Excelente</div>
        El presente proyecto no es una mejora marginal ni un parche transitorio. Es el rediseño integral de AndesHome bajo estándares mundiales (World-Class Logistics), cimentado en la <strong>Arquitectura de Desacople Central de 102.060 posiciones físicas 100% independientes</strong>. Combina carros satélite Pallet Shuttle, elevadores verticales Lifters, 32 cobots móviles AMR y estaciones de picking ergonómico a piso. No solo erradica el colapso y blinda la promesa al cliente al 98,7% OTIF; convierte a AndesHome en el operador logístico más eficiente y tecnológicamente avanzado del país, liberando 88.200 posiciones de excedente para monetizar como Hub 3PL de alta rentabilidad.
    </div>

    <h2 class="subsec-title">1.1. Comparativa Estratégica de los Tres Escenarios</h2>
    <p>
        Para fundamentar la decisión de inversión, se contrastó la situación de partida con la solución estándar básica ("To-Be") y el modelo definitivo de "Excelente":
    </p>

    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th style="width: 25%;">Dimensión Estratégica</th>
                <th style="width: 25%;">1. Crisis As-Is (Jun 2026)</th>
                <th style="width: 25%;">2. To-Be Base (P1 a P5)</th>
                <th style="width: 25%;">3. Escenario Excelente (P1 a P8)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Capacidad Físicamente Segura</strong></td>
                <td class="danger"><strong>16.900 Posiciones</strong> (80% saturada)</td>
                <td>30.420 Pos (Racks convencionales)</td>
                <td class="success"><strong>102.060 Posiciones</strong> (Desacople Central)</td>
            </tr>
            <tr>
                <td><strong>Nivel de Servicio (OTIF Global)</strong></td>
                <td class="danger"><strong>43,5% en Cyber</strong> (80,9% mes)</td>
                <td>96,2% (Meta corporativa base)</td>
                <td class="success"><strong>98,7% OTIF</strong> (Benchmark Retail Mundial)</td>
            </tr>
            <tr>
                <td><strong>Velocidad Dock-to-Stock</strong></td>
                <td class="danger">22,6 horas (Colas en Vespucio)</td>
                <td>14,0 horas (Agenda manual)</td>
                <td class="success"><strong>3,2 horas</strong> (Portal ASN + Citas 2h)</td>
            </tr>
            <tr>
                <td><strong>Cadencia de Picking</strong></td>
                <td class="danger">46,8 líneas/HH (67 km caminata)</td>
                <td>68,4 líneas/HH (Voice Picking)</td>
                <td class="success"><strong>220 líneas/hora</strong> (Goods-to-Person + AMRs)</td>
            </tr>
            <tr>
                <td><strong>Costo Unitario por Pedido</strong></td>
                <td class="danger">CLP $7.920 ($29.628 en fallidos)</td>
                <td>CLP $5.420 (-31,6%)</td>
                <td class="success"><strong>CLP $3.850</strong> (-51,4% vs Crisis As-Is)</td>
            </tr>
            <tr>
                <td><strong>Salud Ocupacional &amp; SST</strong></td>
                <td class="danger">120 accidentes / Cargas >25kg manual</td>
                <td>Mesas hidráulicas reguladas</td>
                <td class="success"><strong>Cero Trabajo en Altura</strong> &bull; Ergonomía a piso</td>
            </tr>
            <tr>
                <td><strong>Sostenibilidad Ambiental</strong></td>
                <td class="danger">0% Solar / $130M gasto eléctrico red</td>
                <td>0% Solar / Tarifa convencional</td>
                <td class="success"><strong>65% Solar</strong> (250 kWp / -18,5 ton CO2e)</td>
            </tr>
            <tr>
                <td><strong>Monetización de Capacidad</strong></td>
                <td class="danger">0 pos libres (Bodegas arriendo)</td>
                <td>16.940 pos excedentes</td>
                <td class="success"><strong>88.200 Pos Libres para Hub 3PL</strong></td>
            </tr>
        </tbody>
    </table>

    <!-- ================================================================= -->
    <!-- PÁGINA 3: RADIOGRAFÍA DE LA CRISIS Y AUDITORÍA DEL DESPILFARRO    -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 2: Diagnóstico Operacional &amp; Auditoría de Sobrecostos</span>
    </div>

    <h1 class="sec-title">2. Diagnóstico Operacional y la Radiografía del Despilfarro As-Is</h1>

    <p class="lead-paragraph">
        El colapso de junio de 2026 no fue un fenómeno aislado: fue la consecuencia predecible de un sistema manual superado por el crecimiento omnicanal. Durante 12 meses, la operación intentó compensar las fallas de diseño mediante la inyección descontrolada de recursos de emergencia, acumulando un sobrecosto evitable de <strong>CLP $3.919.205.000</strong>.
    </p>

    <div class="kpi-row avoid-break">
        <div class="kpi-card rose">
            <div class="kpi-card-lbl">Despilfarro Total Anual</div>
            <div class="kpi-card-val">$3.919 M</div>
            <div class="kpi-card-sub">Sobrecosto directo documentado</div>
        </div>
        <div class="kpi-card rose">
            <div class="kpi-card-lbl">Horas Extras Desbordadas</div>
            <div class="kpi-card-val">$613,8 M</div>
            <div class="kpi-card-sub">+29,6% sobre presupuesto en Peak</div>
        </div>
        <div class="kpi-card amber">
            <div class="kpi-card-lbl">Personal Temporal EST</div>
            <div class="kpi-card-val">$338,2 M</div>
            <div class="kpi-card-sub">Cuadrillas externas de emergencia</div>
        </div>
        <div class="kpi-card rose">
            <div class="kpi-card-lbl">Costo por Pedido Fallido</div>
            <div class="kpi-card-val">$29.628</div>
            <div class="kpi-card-sub">+247% de recargo sobre cumplido</div>
        </div>
    </div>

    <h2 class="subsec-title">2.1. Las Cuatro Sangrías Financieras de la Crisis</h2>

    <p>
        <strong>1. El Círculo Vicioso de las Horas Extras (CLP $613.817.389 al año):</strong><br>
        Durante el CyberDay, se pagaron más de $67 millones en un solo mes por jornadas extendidas. Sin embargo, la auditoría demostró que en pasillos saturados las horas extras tenían un rendimiento marginal negativo: la fatiga física y el estrés multiplicaron los errores de picking al 2,44% (vs 0,69% normal). Los operarios estaban exhaustos y los pedidos seguían retrasándose.
    </p>

    <p>
        <strong>2. Personal Externo Contratado de Urgencia (CLP $338.240.264 al año):</strong><br>
        Para intentar frenar el backlog de 15.387 órdenes, se contrataron cuadrillas temporales a través de Empresas de Servicios Transitorios (EST). Sin inducción en el WMS legado ni conocimiento del catálogo, estos trabajadores no lograron acelerar la preparación y generaron mermas por manipulación inadecuada y extravíos de mercadería.
    </p>

    <p>
        <strong>3. Redespachos, Pedidos Fallidos y Fletes Urgentes (CLP $753.764.029 + $287,6M en transporte):</strong><br>
        El 11,5% de los pedidos no se entregó en el primer intento por errores de rotulación o atrasos en la salida. Cada pedido fallido tuvo un costo promedio de <strong>CLP $29.628</strong> (frente a CLP $8.532 de una orden entregada a tiempo), al requerir fletes dobles, llamadas de coordinación, reembalaje y custodia temporal. Para cumplir con fechas límites, se contrataron camiones a tarifa spot con un sobrecosto del 33,4% en fletes de última milla.
    </p>

    <p>
        <strong>4. Demurrage en Andenes y Multas SERNAC (CLP $330.819.000):</strong><br>
        La ausencia de citas obligatorias generaba filas de camiones de más de 6 horas en la berma de Américo Vespucio, acumulando <strong>$146,3 millones en multas por sobreestadía</strong> a 19 recepciones de importados. En el frente comercial, los retrasos de hasta 14 días en entregas provocaron 842 reclamos formalizados ante el SERNAC, obligando a indemnizaciones y cupones por <strong>$184,5 millones</strong>.
    </p>

    <div class="callout warning avoid-break">
        <div class="callout-title">⚠️ Lección Aprendida de la Gestión de Operaciones</div>
        La crisis demostró que no se puede resolver una falla estructural inyectando horas extras y contratando personal temporal. Cuando el método de almacenamiento y picking está colapsado, más personas solo generan más congestión en pasillos. La solución requería un salto tecnológico hacia la automatización guiada.
    </div>

    <!-- ================================================================= -->
    <!-- PÁGINA 4: ARQUITECTURA DE DESACOPLE CENTRAL 102.060 POSICIONES     -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 3: Arquitectura de Desacople Central (102.060 Posiciones)</span>
    </div>

    <h1 class="sec-title">3. Arquitectura de Desacople Central: 102.060 Posiciones Físicas Seguras</h1>

    <p class="lead-paragraph">
        El corazón de la transformación es el nuevo diseño estructural del Centro de Distribución Pudahuel (150 m × 210 m = 31.500 m²). Frente al riesgo de colisiones y pasillos atochados, se desarrolló la <strong>Arquitectura de Desacople Central a Piso</strong>, garantizando 102.060 posiciones físicas 100% independientes, seguras y sin combinación riesgosa de niveles.
    </p>

    <div class="kpi-row avoid-break">
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Capacidad Físicamente Segura</div>
            <div class="kpi-card-val">102.060</div>
            <div class="kpi-card-sub">1.428 túneles + 30 calles a piso</div>
        </div>
        <div class="kpi-card blue">
            <div class="kpi-card-lbl">Pasillo de Desacople</div>
            <div class="kpi-card-val">3,50 m</div>
            <div class="kpi-card-sub">Separación física Oeste - Este</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Ocupación AndesHome</div>
            <div class="kpi-card-val">13,6%</div>
            <div class="kpi-card-sub">13.860 pallets de stock propio</div>
        </div>
        <div class="kpi-card amber">
            <div class="kpi-card-lbl">Capacidad Libre Hub 3PL</div>
            <div class="kpi-card-val">88.200</div>
            <div class="kpi-card-sub">Pallets monetizables a terceros</div>
        </div>
    </div>

    <h2 class="subsec-title">3.1. Principios de Ingeniería del Desacople Central</h2>
    <p>
        <strong>1. División en Dos Bloques Compactos Independientes:</strong><br>
        La nave se organiza longitudinalmente en dos grandes macro-bloques: Bloque Oeste y Bloque Este. Cada bloque alberga baterías de racks de alta densidad con <strong>70 pallets de profundidad</strong> en canales continuos, servidos por carros satélite autónomos Pallet Shuttle a lo largo de <strong>6 niveles verticales (hasta 12 metros de altura)</strong>, blindados sísmicamente bajo la norma chilena NCh2369.
    </p>

    <p>
        <strong>2. Pasillo Central de Maniobras de 3,50 Metros:</strong><br>
        Ambos bloques están físicamente separados por una autopista logística central de 3,50 m de ancho libre. Esta avenida central cumple una función crítica de desacople: permite que las grúas horquilla y los robots móviles AMR transiten de forma bidireccional con radios de giro amplios, despeje visual completo y <strong>cero interferencia mutua</strong>. Las grúas reach de cabecera solo alimentan los elevadores Lifters, sin ingresar jamás al pasillo compartido con peatones o cobots.
    </p>

    <p>
        <strong>3. Distribución Modular por Zonas de Rotación (100% Propias e Independientes):</strong>
    </p>
    <ul style="padding-left: 20px; margin-top: 4px; line-height: 1.6;">
        <li><strong style="color: #047857;">Zona A (Alta Rotación):</strong> 140 túneles dedicados exclusivamente en los niveles 1 y 2 de cabecera (9.800 posiciones). Proximidad máxima al pasillo central para salida inmediata.</li>
        <li><strong style="color: #0284c7;">Zona B (Media Rotación):</strong> 420 túneles en niveles intermedios (29.400 posiciones). Flujo continuo con elevadores verticales Lifters.</li>
        <li><strong style="color: #7c3aed;">Zona C (Baja Rotación &amp; Hub 3PL):</strong> 868 túneles en altura y zonas posteriores (60.760 posiciones). Almacenamiento profundo y seguro de alta densidad.</li>
        <li><strong style="color: #b45309;">Zona D (Línea Blanca y Carga Pesada a Piso):</strong> 30 calles a piso 100% dedicadas en el extremo Sur de la nave (2.100 m²). Erradica por completo el almacenamiento de carga de más de 25 kg en altura, asegurando cumplimiento irrestricto de la Ley 20.949 y eliminando el riesgo de accidentes graves.</li>
    </ul>

    <h2 class="subsec-title">3.2. La Oportunidad Comercial: El Gran Hub 3PL de la RM</h2>
    <p>
        La demanda de almacenamiento de AndesHome proyectada para los próximos 3 años alcanza los <strong>13.860 pallets</strong>. En el diseño de 102.060 posiciones, esto representa apenas un <strong>13,6% de ocupación</strong>. Lejos de ser una sobrecapacidad ociosa, este colchón representa la transformación del modelo de negocios de AndesHome:
    </p>
    <div class="callout success avoid-break">
        <div class="callout-title">💼 Monetización de 88.200 Pallets Libres (Servicio 3PL)</div>
        AndesHome dispone de <strong>88.200 posiciones de pallet de alta tecnología</strong> listas para ser comercializadas a terceros (proveedores del retail, importadores y cadenas de e-commerce). A una tarifa de mercado conservadora de $8.500 CLP/pallet/mes con una colocación gradual del 35%, el CD Pudahuel genera ingresos operacionales adicionales de más de <strong>CLP $2.500 Millones al año</strong>, convirtiendo la logística en una unidad generadora de EBITDA positivo para el grupo.
    </div>

    <!-- ================================================================= -->
    <!-- PÁGINA 5: PLANIMETRÍA TÉCNICA Y BLUEPRINT ARQUITECTÓNICO          -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 4: Planimetría Técnica &amp; Blueprint 2D</span>
    </div>

    <h1 class="sec-title">4. Planimetría Técnica y Blueprint Arquitectónico (CD Pudahuel)</h1>

    <p class="lead-paragraph">
        El plano arquitectónico 2D del CD Pudahuel refleja la zonificación ortogonal de la nave de 150 m de ancho por 210 m de largo. Los 24 andenes se distribuyen estratégicamente: 12 andenes de entrada (Inbound) en el frente Oeste y 12 andenes de despacho (Outbound) en el frente Este, garantizando un flujo unidireccional sin cruces de carga.
    </p>

    <div class="img-box avoid-break">
        {f'<img src="{img_layout}" alt="Planimetría Técnica CD Pudahuel 2D">' if img_layout else '<div style="padding: 40px; color: #64748b;">[Imagen de Layout 2D en Archivo layout_cd_pudahuel_2d_4k.jpg]</div>'}
        <div class="img-caption">Figura 4.1: Blueprint Técnico del CD Pudahuel (150m × 210m). Visualización del Desacople Central de 3,50m, bloques de racks de 70 pallets, 4 torres Lifter, 8 puestos GTP y andenes 1 al 24.</div>
    </div>

    <h2 class="subsec-title">4.1. Resumen de Áreas y Asignación de Superficie</h2>
    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th>Zona / Componente Funcional</th>
                <th>Dimensiones Físicas</th>
                <th>Superficie (m²)</th>
                <th>Equipamiento y Tecnología Desplegada</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Andenes Inbound (1 al 12)</strong></td>
                <td>12 andenes × 4,5m frente</td>
                <td>1.620 m²</td>
                <td>Abrigos inflables, niveladores hidráulicos, portal ASN y YMS.</td>
            </tr>
            <tr>
                <td><strong>Bloque Racks Oeste (Alta/Media)</strong></td>
                <td>58m ancho × 170m largo</td>
                <td>9.860 m²</td>
                <td>714 túneles Pallet Shuttle (6 niveles), 2 Torres Lifter.</td>
            </tr>
            <tr>
                <td><strong>Pasillo Central de Desacople</strong></td>
                <td>3,50m ancho × 170m largo</td>
                <td>595 m²</td>
                <td>Piso epóxico pulido, autopista bidireccional para 32 cobots AMR.</td>
            </tr>
            <tr>
                <td><strong>Bloque Racks Este (3PL/Media)</strong></td>
                <td>58m ancho × 170m largo</td>
                <td>9.860 m²</td>
                <td>714 túneles Pallet Shuttle (6 niveles), 2 Torres Lifter.</td>
            </tr>
            <tr>
                <td><strong>Zona D (Calles a Piso Bulky)</strong></td>
                <td>70m ancho × 30m largo</td>
                <td>2.100 m²</td>
                <td>30 calles a piso delimitadas, transpaletas con pesaje integrado.</td>
            </tr>
            <tr>
                <td><strong>Estaciones Goods-to-Person</strong></td>
                <td>8 puestos ergonómicos</td>
                <td>680 m²</td>
                <td>Mesas a la cintura, Pick-to-Light, pantallas táctiles WMS.</td>
            </tr>
            <tr>
                <td><strong>Sorter Shoe &amp; Túnel Cubitaje</strong></td>
                <td>Línea central 72m largo</td>
                <td>1.250 m²</td>
                <td>Clasificador continuo 4.500 bultos/h, 12 ramales de salida.</td>
            </tr>
            <tr>
                <td><strong>Andenes Outbound (13 al 24)</strong></td>
                <td>12 andenes × 4,5m frente</td>
                <td>1.620 m²</td>
                <td>Staging preclasificado por rutas dinámicas TMS y app chofer.</td>
            </tr>
        </tbody>
    </table>

    <!-- ================================================================= -->
    <!-- PÁGINA 6: INGENIERÍA DE HARDWARE Y ROBÓTICA P1 A P8               -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 5: Ingeniería de Hardware &amp; Automatización (P1 a P8)</span>
    </div>

    <h1 class="sec-title">5. Ingeniería de Hardware y Automatización Integral (P1 a P8)</h1>

    <p class="lead-paragraph">
        El Escenario de Excelente integra ocho iniciativas de inversión tecnológica sincronizadas en tiempo real. A continuación se detallan las especificaciones técnicas, operativas y de seguridad de los cuatro pilares de automatización:
    </p>

    <div class="avoid-break" style="margin-bottom: 14px;">
        <h2 class="subsec-title" style="margin-top: 6px;">5.1. Carros Robot Pallet Shuttle Autónomos (P1 + P6)</h2>
        <p>
            Plataformas robóticas ultracompactas que navegan sobre rieles de acero galvanizado dentro de los canales de almacenamiento de 70 pallets de fondo.
        </p>
        <table class="rep-table">
            <tr>
                <td style="width: 30%;"><strong>Velocidad de Traslación</strong></td>
                <td>1,5 m/s con carga completa (1.500 kg nominal) y aceleración suave de 0,8 m/s².</td>
            </tr>
            <tr>
                <td><strong>Sensores de Navegación</strong></td>
                <td>Doble sensor láser Time-of-Flight (ToF) + odometría óptica (precisión milimétrica &plusmn;1,5 mm).</td>
            </tr>
            <tr>
                <td><strong>Batería y Autonomía</strong></td>
                <td>Baterías de Litio Ferro-Fosfato (LiFePO4) 24V. Carga rápida en 25 minutos con 8 horas continuas de ciclo.</td>
            </tr>
            <tr>
                <td><strong>Comunicaciones WMS</strong></td>
                <td>Wi-Fi 6 Industrial (5 GHz) con roaming continuo (&lt;10 ms handover) enlazado con WMS 3D.</td>
            </tr>
        </table>
    </div>

    <div class="avoid-break" style="margin-bottom: 14px;">
        <h2 class="subsec-title">5.2. Elevadores Verticales Lifters de Cabecera (P6 + P8)</h2>
        <p>
            Cuatro torres electromecánicas ubicadas en las cabeceras de los bloques que conectan los 6 niveles de altura (12 m) con la losa de piso.
        </p>
        <table class="rep-table">
            <tr>
                <td style="width: 30%;"><strong>Velocidad Vertical</strong></td>
                <td>3,0 m/s con servomotores síncronos y variadores vectoriales de frecuencia.</td>
            </tr>
            <tr>
                <td><strong>Capacidad de Ciclo</strong></td>
                <td>65 transferencias de pallet por hora por torre (capacidad combinada: <strong>260 pallets/hora</strong>).</td>
            </tr>
            <tr>
                <td><strong>Eficiencia Energética</strong></td>
                <td>Frenado regenerativo que reinyecta hasta el 28% de la energía eléctrica durante el descenso de carga.</td>
            </tr>
            <tr>
                <td><strong>Seguridad Industrial</strong></td>
                <td>Paracaídas de seguridad certificado EN 528 y cortinas ópticas SIL-3 anti-atrapamiento.</td>
            </tr>
        </table>
    </div>

    <div class="avoid-break" style="margin-bottom: 14px;">
        <h2 class="subsec-title">5.3. Flota de 32 Cobots Móviles AMR (P6)</h2>
        <p>
            Robots móviles autónomos de piso que trasladan totes y pallets entre los elevadores Lifters y las estaciones Goods-to-Person.
        </p>
        <table class="rep-table">
            <tr>
                <td style="width: 30%;"><strong>Tecnología de Guiado</strong></td>
                <td>Navegación natural SLAM LiDAR 360° + cámaras 3D estereoscópicas (sin cables ni bandas magnéticas en piso).</td>
            </tr>
            <tr>
                <td><strong>Velocidad y Capacidad</strong></td>
                <td>Velocidad máxima 1,8 m/s en pasillos compartidos de forma segura con personal; carga útil de 1.000 kg.</td>
            </tr>
            <tr>
                <td><strong>Seguridad Colaborativa</strong></td>
                <td>Norma ISO 3691-4. Parada suave automática ante detección de peatones a 2,5 metros de distancia.</td>
            </tr>
        </table>
    </div>

    <div class="avoid-break">
        <h2 class="subsec-title">5.4. Estaciones Goods-to-Person Ergonómicas (P2 + P6)</h2>
        <p>
            Ocho puestos de trabajo diseñados bajo la norma de ergonomía ISO 11228-1 donde el producto viaja hacia el operario.
        </p>
        <table class="rep-table">
            <tr>
                <td style="width: 30%;"><strong>Productividad Sostenida</strong></td>
                <td><strong>220 líneas preparadas por hora</strong> por puesto (frente a 46,8 en crisis y 68,4 en To-Be).</td>
            </tr>
            <tr>
                <td><strong>Confirmación Visual</strong></td>
                <td>Pick-by-Light interactivo con display numérico y confirmación por haz óptico.</td>
            </tr>
            <tr>
                <td><strong>Control de Calidad</strong></td>
                <td>Báscula de pesaje dinámico en línea; detecta discrepancias de peso en tiempo real (cero errores de empaque).</td>
            </tr>
            <tr>
                <td><strong>Impacto en Salud Laboral</strong></td>
                <td>Tapete antifatiga a piso, altura regulable a la cintura. <strong>Erradica el 100% de caminatas y trabajo en altura</strong>.</td>
            </tr>
        </table>
    </div>

    <!-- ================================================================= -->
    <!-- PÁGINA 7: CLASIFICACIÓN SORTER SHOE Y DESPACHO TMS                -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 6: Empaque, Sorter Shoe &amp; Despacho Omnicanal TMS</span>
    </div>

    <h1 class="sec-title">6. Empaque Inteligente, Sorter Shoe y Transporte TMS</h1>

    <p class="lead-paragraph">
        Una vez preparado el pedido en las estaciones Goods-to-Person, el flujo continúa de manera automatizada hacia la línea de empaque inteligente, pesaje y clasificación por zapatas (Sorter Shoe) en dirección a los andenes de despacho 13 al 24.
    </p>

    <div class="kpi-row avoid-break">
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Capacidad de Clasificación</div>
            <div class="kpi-card-val">4.500 B/h</div>
            <div class="kpi-card-sub">Sorter Shoe de zapatas continuas</div>
        </div>
        <div class="kpi-card blue">
            <div class="kpi-card-lbl">Precisión de Despacho</div>
            <div class="kpi-card-val">&lt; 0,1% Error</div>
            <div class="kpi-card-sub">Cero roturas por empaque ciego</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Click &amp; Collect Tiendas</div>
            <div class="kpi-card-val">&lt; 2 Horas</div>
            <div class="kpi-card-sub">27 sucursales sincronizadas en vivo</div>
        </div>
        <div class="kpi-card amber">
            <div class="kpi-card-lbl">Entregas Fallidas</div>
            <div class="kpi-card-val">&le; 2,0%</div>
            <div class="kpi-card-sub">Caída de 11,5% a &le;2% con TMS</div>
        </div>
    </div>

    <h2 class="subsec-title">6.1. Sorter Shoe Automatizado: Clasificación Suave y sin Quiebres</h2>
    <p>
        El clasificador Sorter Shoe instalado sobre el pasillo central procesa hasta <strong>4.500 bultos por hora</strong>. A diferencia de los clasificadores de empuje brusco o brazos neumáticos convencionales, el sistema utiliza zapatas deslizantes extrusionadas de aluminio con recubrimiento de polímero que acompañan diagonalmente al paquete a lo largo de una cinta continua de 72 metros.
    </p>
    <ul style="padding-left: 20px; margin-top: 4px; line-height: 1.6;">
        <li><strong>Túnel de Escáner Omnidireccional y Cubitaje al Vuelo:</strong> Cada bulto es leído mediante escáneres láser 360° que capturan el código GS1-128 sin importar la orientación de la caja. En simultáneo, básculas dinámicas y cortinas ópticas calculan el volumen exacto y peso volumétrico del bulto en menos de 80 milisegundos.</li>
        <li><strong>12 Ramales de Desvío con Deslizamiento Suave:</strong> Las zapatas desvían cada paquete hacia el ramal asignado a su ruta de despacho según destino geográfico (RM Norte, RM Sur, Regiones o Tiendas Click &amp; Collect). Esto elimina al 100% las caídas y abolladuras que en la crisis destruían más de $18 millones en mercadería frágil.</li>
    </ul>

    <h2 class="subsec-title">6.2. TMS con Ruteo Dinámico y Despacho en Andenes 13 al 24</h2>
    <p>
        En los andenes de salida 13 al 24, la carga se preclasifica directamente en jaulas rodantes y pallets consolidados. El sistema de gestión de transporte (TMS) sustituye definitivamente las llamadas telefónicas y asignaciones manuales por algoritmos de optimización de rutas:
    </p>
    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th>Funcionalidad TMS</th>
                <th>Operación en Crisis (As-Is)</th>
                <th>Solución Escenario Excelente</th>
                <th>Impacto Directo</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Algoritmo de Ruteo</strong></td>
                <td>Rutas fijas por intuición del despachador</td>
                <td>Agrupación dinámica por densidad y ventanas horarias</td>
                <td>Aumenta llenado vehicular de 73% a 92%</td>
            </tr>
            <tr>
                <td><strong>Trazabilidad en Ruta</strong></td>
                <td>Sin visibilidad GPS; contacto telefónico</td>
                <td>Telemetría satelital en vivo y precintos digitales</td>
                <td>Disminuye reclamos de clientes en 94%</td>
            </tr>
            <tr>
                <td><strong>Prueba de Entrega (POD)</strong></td>
                <td>Guía de despacho física en papel firmada</td>
                <td>App móvil chofer con firma en pantalla y geofencing</td>
                <td>Elimina disputas por extravíos comerciales</td>
            </tr>
            <tr>
                <td><strong>Gestión Click &amp; Collect</strong></td>
                <td>Envío semanal consolidado (7 días espera)</td>
                <td>Cross-docking diario con slots garantizados</td>
                <td><strong>Click &amp; Collect en &lt; 2h en 27 tiendas</strong></td>
            </tr>
        </tbody>
    </table>

    <!-- ================================================================= -->
    <!-- PÁGINA 8: AUDITORÍA FINANCIERA DETALLADA ÁREA POR ÁREA            -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 7: Auditoría Financiera de Sobrecostos Área por Área</span>
    </div>

    <h1 class="sec-title">7. Auditoría Financiera: Desglose de Sobrecostos As-Is y Ahorros</h1>

    <p class="lead-paragraph">
        A continuación se presenta la matriz oficial de auditoría financiera departamental que detalla los <strong>$3.919 millones de sobrecostos anuales</strong> incurridos en la crisis As-Is y los <strong>$1.612 millones de ahorro neto anual</strong> capturados con la implementación del Escenario de Excelente:
    </p>

    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th style="width: 20%;">Área / Departamento</th>
                <th style="width: 16%;">Sobrecosto Anual Crisis</th>
                <th style="width: 36%;">Concepto del Despilfarro (Causa Raíz Operacional)</th>
                <th style="width: 16%;">Tecnología P1 a P8</th>
                <th style="width: 12%;">Ahorro Anual</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>📥 1. Inbound &amp; Andenes (1 al 12)</strong></td>
                <td class="num danger">CLP $167.505.000<br><span style="font-size: 6.8pt; color: #64748b;">($16,3M en junio)</span></td>
                <td>
                    &bull; <strong>Demurrage de andenes:</strong> $146,3M cobrados por navieras a 19 recepciones de importados por colas &gt;6h en Av. Vespucio.<br>
                    &bull; <strong>Descarga manual lenta:</strong> 4h por camión ($21,2M en HH improductivas por solo 65% adopción ASN).
                </td>
                <td>P3: Portal ASN &amp; YMS + Citas 2h obligatorias</td>
                <td class="num success">+$157.192.000</td>
            </tr>
            <tr>
                <td><strong>📦 2. Almacenamiento &amp; Racks (102k Pos)</strong></td>
                <td class="num danger">CLP $989.100.000<br><span style="font-size: 6.8pt; color: #64748b;">(Mermas + Caminatas)</span></td>
                <td>
                    &bull; <strong>Mermas y descalces de inventario:</strong> $388,9M en descuadres valorizados (IRA 93,8%; 104 SKU explican 80% del descalce).<br>
                    &bull; <strong>Caminatas improductivas:</strong> 61.598 HH perdidas ($585,2M) recorriendo 67,6 km/día por 114 SKU descalzados.<br>
                    &bull; <strong>Bodegas externas provisionales:</strong> $15,0M en arriendos.
                </td>
                <td>P1+P8: Desacople Central 102.060 pos + WMS 3D</td>
                <td class="num success">+$410.000.000</td>
            </tr>
            <tr>
                <td><strong>⚡ 3. Picking &amp; GTP (Goods-to-Person)</strong></td>
                <td class="num danger">CLP $1.881.657.000<br><span style="font-size: 6.8pt; color: #64748b;">(Extras + EST + Errores)</span></td>
                <td>
                    &bull; <strong>Horas Extras Desbordadas:</strong> $613,8M anuales ($67,2M en mes Cyber, +29,6% sobrecosto) con rendimiento decreciente por fatiga.<br>
                    &bull; <strong>Personal Externo Temporal (EST):</strong> $338,2M ($33,2M en junio, +18,2%) contratado de urgencia; error de picking subió a 2,44%.<br>
                    &bull; <strong>Errores de preparación:</strong> 50.251 errores a $18.500 c/u ($929,6M).
                </td>
                <td>P2+P6: 8 Puestos GTP + Pick-to-Light + 32 AMRs</td>
                <td class="num success">+$520.000.000</td>
            </tr>
            <tr>
                <td><strong>📦 4. Empaque &amp; Sorter (Packing 4.500 B/h)</strong></td>
                <td class="num danger">CLP $120.600.000<br><span style="font-size: 6.8pt; color: #64748b;">(Sobreembalaje + MHE)</span></td>
                <td>
                    &bull; <strong>Sobreembalaje y roturas:</strong> $655,9M en insumos (sobrecosto neto de +$31,7M; en junio subió a $66,8M, +21,4%) por cajas aplastadas.<br>
                    &bull; <strong>Mantenimiento correctivo MHE:</strong> +$21,0M por grúas y transpaletas sobreexigidas; mesas hidráulicas fuera de servicio (29% inactivas).
                </td>
                <td>P4+P5: Sorter Shoe zapatas + Right-Sizing</td>
                <td class="num success">+$85.000.000</td>
            </tr>
            <tr>
                <td><strong>🚚 5. Despacho &amp; TMS (Andenes 13 al 24)</strong></td>
                <td class="num danger">CLP $406.400.000<br><span style="font-size: 6.8pt; color: #64748b;">(Fletes spot + Fallidos)</span></td>
                <td>
                    &bull; <strong>Redespachos y entregas fallidas:</strong> 11,5% de tasa de fallas (984 pedidos rebotados). Pedido fallido escala a $29.628 vs $8.532 cumplido.<br>
                    &bull; <strong>Fletes spot de emergencia:</strong> Sobrecosto de +$287,6M en última milla ($569M en junio, +33,4%) por transporte urgente.<br>
                    &bull; <strong>Reprocesos y devoluciones:</strong> $753,8M anuales (+$43,8M sobrecosto).
                </td>
                <td>P4+P5: TMS Dinámico + App Chofer POD</td>
                <td class="num success">+$260.000.000</td>
            </tr>
            <tr>
                <td><strong>🛍️ 6. Omnicanal &amp; Tiendas (OMS / SAC)</strong></td>
                <td class="num danger">CLP $354.500.000<br><span style="font-size: 6.8pt; color: #64748b;">(SERNAC + Fuga Clientes)</span></td>
                <td>
                    &bull; <strong>Multas y compensaciones SERNAC:</strong> $184,5M pagados en cupones y devoluciones forzadas por 842 reclamos (entregas con 14 días atraso).<br>
                    &bull; <strong>Cancelaciones y quiebres:</strong> $124,0M en margen comercial perdido por 7 días de espera en tiendas (C&amp;C cayó al 11,5% OTIF).<br>
                    &bull; <strong>Call center externo contratado:</strong> $46,0M en soporte de crisis.
                </td>
                <td>P5+P6: C&amp;C &lt;2h en 27 tiendas + OMS integrado</td>
                <td class="num success">+$180.000.000</td>
            </tr>
        </tbody>
        <tfoot>
            <tr style="background: #0f172a; color: #ffffff; font-weight: 800;">
                <td style="color: #ffffff;">TOTALES CONSOLIDADOS</td>
                <td class="num" style="color: #f43f5e;">CLP $3.919.205.000</td>
                <td style="color: #94a3b8; font-size: 7.2pt;">Despilfarro total anual As-Is erradicado con la solución</td>
                <td style="color: #38bdf8;">Portafolio P1 a P8</td>
                <td class="num" style="color: #34d399;">+CLP $1.612.000.000/año</td>
            </tr>
        </tfoot>
    </table>

    <!-- ================================================================= -->
    <!-- PÁGINA 9: EVALUACIÓN ECONÓMICA, VAN, TIR Y SENSIBILIDAD           -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 8: Evaluación Económica &amp; Flujos de Caja</span>
    </div>

    <h1 class="sec-title">8. Evaluación Económica, Flujos de Caja y Retorno de Inversión (ROI)</h1>

    <p class="lead-paragraph">
        La evaluación económica del proyecto se efectuó bajo estándares corporativos estrictos, aplicando una tasa de descuento del 12% anual (WACC) y modelando los flujos netos de caja a 3 y 5 años con reserva de contingencia del 8%.
    </p>

    <div class="kpi-row avoid-break">
        <div class="kpi-card blue">
            <div class="kpi-card-lbl">CAPEX Base (P1 a P5)</div>
            <div class="kpi-card-val">CLP $766,8M</div>
            <div class="kpi-card-sub">Techo presupuestario $850M</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">EBITDA Neto Anual Base</div>
            <div class="kpi-card-val">+CLP $856,1M</div>
            <div class="kpi-card-sub">Ahorro bruto $1.033M - OPEX $177M</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">VAN a 3 Años (r=12%)</div>
            <div class="kpi-card-val">$1.289,4 M</div>
            <div class="kpi-card-sub">TIR 98,4% &bull; Payback 10,7 meses</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">EBITDA Escenario Integral</div>
            <div class="kpi-card-val">+CLP $1.612 M</div>
            <div class="kpi-card-sub">Payback consolidado 1,8 años</div>
        </div>
    </div>

    <h2 class="subsec-title">8.1. Desglose de Inversión (CAPEX) y Costos Operativos (OPEX)</h2>
    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th>Componente de Inversión</th>
                <th>CAPEX Directo (CLP)</th>
                <th>OPEX Anual (CLP)</th>
                <th>Concepto de Costo Operativo (Licencias / Mantenimiento)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>P1: Re-slotting ABC + 5S + Conteos Cíclicos</strong></td>
                <td class="num">$85.000.000</td>
                <td class="num">$12.000.000</td>
                <td>Etiquetado de piso, señalética reflectante, calibración de slotting.</td>
            </tr>
            <tr>
                <td><strong>P2: Upgrade WMS NextGen + Voice/RF</strong></td>
                <td class="num">$310.000.000</td>
                <td class="num">$75.000.000</td>
                <td>Licencias SaaS WMS Cloud, soporte 24/7, mantención terminales Zebra.</td>
            </tr>
            <tr>
                <td><strong>P3: Portal ASN &amp; YMS Proveedores</strong></td>
                <td class="num">$95.000.000</td>
                <td class="num">$24.000.000</td>
                <td>Plataforma web B2B de agendamiento y soporte EDI a proveedores.</td>
            </tr>
            <tr>
                <td><strong>P4: TMS Ruteo Dinámico + POD Móvil</strong></td>
                <td class="num">$150.000.000</td>
                <td class="num">$48.000.000</td>
                <td>Servidores de ruteo, licencias de mapas georreferenciados, telemetría.</td>
            </tr>
            <tr>
                <td><strong>P5: Right-Sizing Empaque &amp; Ergonomía D-Bulky</strong></td>
                <td class="num">$70.000.000</td>
                <td class="num">$18.000.000</td>
                <td>Mantenimiento de mesas hidráulicas, calibración básculas dinámicas.</td>
            </tr>
            <tr style="background: #f1f5f9; font-weight: 700;">
                <td><strong>SUBTOTAL PORTAFOLIO BASE (P1 a P5)</strong></td>
                <td class="num">$710.000.000</td>
                <td class="num">$177.000.000</td>
                <td>Inversión base obligatoria en 24 semanas.</td>
            </tr>
            <tr>
                <td><strong>Reserva de Contingencia (8%)</strong></td>
                <td class="num">$56.800.000</td>
                <td class="num">-</td>
                <td>Fondo de contingencia exigido por el Directorio de Finanzas.</td>
            </tr>
            <tr style="background: #e2e8f0; font-weight: 800;">
                <td><strong>TOTAL CAPEX BASE P1-P5</strong></td>
                <td class="num" style="color: #0369a1;">CLP $766.800.000</td>
                <td class="num">CLP $177.000.000</td>
                <td>Holgura de $83,2M respecto al techo presupuestario de $850M.</td>
            </tr>
            <tr>
                <td><strong>P6 + P7 + P8: Automatización AS/RS &amp; Solar</strong></td>
                <td class="num">$570.000.000</td>
                <td class="num">$87.000.000</td>
                <td>Pallet Shuttles, Lifters, Sorter Shoe y Planta Solar Fotovoltaica.</td>
            </tr>
            <tr style="background: #0f172a; color: #ffffff; font-weight: 900;">
                <td style="color: #ffffff;">TOTAL PROYECTO INTEGRAL EXCELENTE</td>
                <td class="num" style="color: #38bdf8;">CLP $1.336.800.000</td>
                <td class="num" style="color: #ffffff;">CLP $264.000.000</td>
                <td style="color: #a7f3d0; font-size: 7.2pt;">Ahorro neto $1.612M/año &bull; Payback 1,8 años &bull; VAN $1.842M a 5 años</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsec-title">8.2. Matriz de Sensibilidad Económica (3 Escenarios de Mercado)</h2>
    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th>Escenario Evaluado</th>
                <th>Hipótesis Operativa / Captura</th>
                <th>EBITDA Anual (CLP)</th>
                <th>VAN 3 Años (r=12%)</th>
                <th>TIR (%)</th>
                <th>Payback Simple</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Caso Pesimista (-25%)</strong></td>
                <td>Captura del 75% por retardo en adopción de RF en turno noche.</td>
                <td class="num">$597.822.750</td>
                <td class="num">$619.345.118</td>
                <td class="num">47,2%</td>
                <td class="num">16,4 meses</td>
            </tr>
            <tr>
                <td><strong>Caso Base (100% Target)</strong></td>
                <td>Cumplimiento total de ahorros proyectados en P1 a P5.</td>
                <td class="num" style="color: #0369a1;"><strong>$856.097.000</strong></td>
                <td class="num" style="color: #0369a1;"><strong>$1.289.400.543</strong></td>
                <td class="num" style="color: #0369a1;"><strong>98,4%</strong></td>
                <td class="num" style="color: #0369a1;"><strong>10,7 meses</strong></td>
            </tr>
            <tr>
                <td><strong>Caso Optimista (+15%)</strong></td>
                <td>Sinergia tarifaria con carriers y monetización 3PL del 35%.</td>
                <td class="num" style="color: #047857;">$1.011.061.550</td>
                <td class="num" style="color: #047857;">$1.661.642.420</td>
                <td class="num" style="color: #047857;">124,1%</td>
                <td class="num" style="color: #047857;">9,1 meses</td>
            </tr>
        </tbody>
    </table>

    <!-- ================================================================= -->
    <!-- PÁGINA 10: SOSTENIBILIDAD, FACTOR HUMANO Y ESG                     -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 9: Sostenibilidad, Ergonomía &amp; Dignificación Humana</span>
    </div>

    <h1 class="sec-title">9. Sostenibilidad Energética, Ergonomía y el Factor Humano (ESG)</h1>

    <p class="lead-paragraph">
        El verdadero éxito de un proyecto logístico no se mide únicamente en cajas por hora o retorno financiero; se valida en la calidad de vida de las personas que hacen funcionar la bodega cada día y en la huella ecológica que dejamos en nuestra comunidad de Pudahuel.
    </p>

    <div class="kpi-row avoid-break">
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Autosuficiencia Eléctrica</div>
            <div class="kpi-card-val">65% Solar</div>
            <div class="kpi-card-sub">250 kWp &bull; 550 paneles Tier-1</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Descarbonización Anual</div>
            <div class="kpi-card-val">-18,5 t CO2e</div>
            <div class="kpi-card-sub">385.000 kWh autogenerados/año</div>
        </div>
        <div class="kpi-card blue">
            <div class="kpi-card-lbl">Seguridad &amp; Ergonomía</div>
            <div class="kpi-card-val">0 Accidentes</div>
            <div class="kpi-card-sub">Cero trabajo manual en altura</div>
        </div>
        <div class="kpi-card emerald">
            <div class="kpi-card-lbl">Cumplimiento Ley 20.949</div>
            <div class="kpi-card-val">100% Norma</div>
            <div class="kpi-card-sub">Erradica cargas >25kg manuales</div>
        </div>
    </div>

    <h2 class="subsec-title">9.1. La Planta Solar Fotovoltaica CD Pudahuel (250 kWp)</h2>
    <p>
        La techumbre del CD Pudahuel dispone de 3.200 m² de cubierta orientada estratégicamente para aprovechar la alta radiación solar del valle central de Santiago. Se instaló una planta fotovoltaica de <strong>250 kWp</strong> compuesta por 550 paneles de silicio monocristalino Tier-1 de 455W de alta eficiencia:
    </p>
    <ul style="padding-left: 20px; margin-top: 4px; line-height: 1.6;">
        <li><strong>Generación Limpia de 385 MWh/año:</strong> La planta produce 385.000 kWh anuales, cubriendo el <strong>65% del consumo eléctrico total del CD</strong>, incluyendo la energización de los servidores WMS, las estaciones Goods-to-Person y la recarga de baterías de litio de la flota de 32 cobots AMR.</li>
        <li><strong>Ahorro en Facturación Eléctrica:</strong> Reduce la factura eléctrica del CD en más de <strong>CLP $85.000.000 al año</strong>, protegiendo a la empresa contra el alza de tarifas energéticas en el Sistema Eléctrico Nacional.</li>
        <li><strong>Impacto Ambiental Certificado (ESG):</strong> Evita la emisión de <strong>18,5 toneladas de CO2 equivalente al año</strong>, permitiendo a AndesHome certificar al CD Pudahuel bajo el estándar de "Green Logistics Warehouse" y cumplir los requerimientos de sustentabilidad exigidos por inversionistas institucionales.</li>
    </ul>

    <h2 class="subsec-title">9.2. Dignificación del Trabajo Logístico y Salud Ocupacional (SST)</h2>
    <p>
        En la crisis de junio, la Zona D-Bulky acumuló una alarmante tasa de 83,8 incidentes por cada 100.000 horas-hombre, con 12 eventos de alta severidad por lumbago agudo y caídas de objetos. El Escenario de Excelente transforma radicalmente el entorno laboral:
    </p>
    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th>Factor de Riesgo Laboral</th>
                <th>Condición Crítica (As-Is)</th>
                <th>Estándar en Escenario Excelente</th>
                <th>Beneficio Humano y Legal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Cargas Pesadas (&gt;25 kg)</strong></td>
                <td>38 SKU pesados levantados a pulso por operarios</td>
                <td>Mesas elevadoras hidráulicas automáticas y transpaletas de traslación eléctrica</td>
                <td>Cumplimiento irrestricto de la Ley 20.949 ("Ley del Saco"). Cero multas de la Dirección del Trabajo.</td>
            </tr>
            <tr>
                <td><strong>Trabajo en Altura</strong></td>
                <td>Operarios en canastillas o escalas recogiendo en niveles 4 y 5</td>
                <td>Los elevadores Lifters bajan la carga a piso; el operario siempre trabaja en el nivel 0,0m</td>
                <td>Erradicación del 100% de riesgos de caídas desde distinto nivel (ISO 45001).</td>
            </tr>
            <tr>
                <td><strong>Fatiga y Caminatas</strong></td>
                <td>67,6 km diarios a pie por persona con planillas</td>
                <td>Puestos Goods-to-Person con tapete ergonómico antifatiga y altura regulable</td>
                <td>El personal ya no camina; prepara pedidos con comodidad a la cintura.</td>
            </tr>
            <tr>
                <td><strong>Clima Laboral y Orgullo</strong></td>
                <td>Frustración, reproches por errores y turnos eternos</td>
                <td>Reconversión a Operadores Técnicos de Robótica Logística y Cobots</td>
                <td>Disminución del ausentismo del 8,4% a &lt;1,5%; orgullo de pertenencia en la empresa.</td>
            </tr>
        </tbody>
    </table>

    <!-- ================================================================= -->
    <!-- PÁGINA 11: PLAN MAESTRO 24 SEMANAS Y GESTIÓN DEL CAMBIO           -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 10: Plan Maestro de Implementación &amp; ADKAR</span>
    </div>

    <h1 class="sec-title">10. Plan Maestro de Implementación (24 Semanas) y Gestión del Cambio</h1>

    <p class="lead-paragraph">
        Uno de los mayores temores del Comité Operativo era que la transformación interrumpiera el abastecimiento de las tiendas. El plan maestro de implementación se diseñó bajo una estricta arquitectura de <strong>cero interrupción operacional (Zero-Downtime)</strong> a lo largo de 24 semanas, estabilizando el sistema 12 semanas antes del Peak Cyber 2027.
    </p>

    <h2 class="subsec-title">10.1. Cronograma Maestro por Fases y Hitos Críticos (WBS)</h2>
    <table class="rep-table avoid-break">
        <thead>
            <tr>
                <th style="width: 14%;">Semanas</th>
                <th style="width: 26%;">Fase del Proyecto</th>
                <th style="width: 38%;">Entregables Clave de Ingeniería y TI</th>
                <th style="width: 22%;">Gate de Aprobación</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Sem 1 a 4</strong></td>
                <td><strong>Fase 1: Preparación y Datos Maestros</strong></td>
                <td>Depuración de maestros SKU (EAN-13, peso, dimensiones volumétricas). Calibración de parámetros WMS.</td>
                <td>Gate 1: Certificación del 100% de maestros por TI y Finanzas.</td>
            </tr>
            <tr>
                <td><strong>Sem 5 a 10</strong></td>
                <td><strong>Fase 2: Quick Wins &amp; Re-slotting Físico</strong></td>
                <td>Reubicación física de los 114 SKU descalzados en turnos programados. Pintura epóxica de pasillo central de 3,50m.</td>
                <td>Gate 2: Reducción comprobada del 80% de caminatas inútiles.</td>
            </tr>
            <tr>
                <td><strong>Sem 11 a 18</strong></td>
                <td><strong>Fase 3: Montaje Tecnológico e Integración</strong></td>
                <td>Instalación de racks estructurales NCh2369, elevadores Lifters, portal ASN/YMS y TMS dinámico en staging.</td>
                <td>Gate 3: Pruebas de integración de interfaces ERP-WMS-TMS sin errores.</td>
            </tr>
            <tr>
                <td><strong>Sem 19 a 20</strong></td>
                <td><strong>Fase 4: Pilotos en Marcha Blanca</strong></td>
                <td>Marcha blanca de picking Goods-to-Person en Zona A-Rápida con 8 cobots AMR y carrier piloto en TMS.</td>
                <td>Gate 4: Verificación de productividad &ge;180 lín/h en ambiente real.</td>
            </tr>
            <tr>
                <td><strong>Sem 21 a 24</strong></td>
                <td><strong>Fase 5: Cutover y Estabilización</strong></td>
                <td><strong>Go-Live general por zonas sin detener el CD.</strong> Respeto irrestricto del Freeze Corporativo de TI de 4 semanas.</td>
                <td>Gate 5: Handover formal a Operaciones; cumplimiento de SLAs.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsec-title">10.2. Gestión del Cambio Organizacional (Modelo ADKAR)</h2>
    <p>
        La introducción de robots y automatización suele generar incertidumbre en los trabajadores si no se gestiona con cercanía y transparencia. Se aplicó el modelo ADKAR para acompañar a los 180 colaboradores del CD:
    </p>
    <div class="callout avoid-break">
        <ul style="padding-left: 15px; margin: 0; line-height: 1.6;">
            <li><strong>Awareness (Conciencia):</strong> Comunicación abierta con los sindicatos y jefaturas. Se explicó con claridad que la tecnología no viene a despedir personas, sino a eliminar el esfuerzo físico dañino y dignificar su labor.</li>
            <li><strong>Desire (Deseo):</strong> Se demostró en maquetas y simulaciones 3D cómo los operarios ya no tendrían que caminar 67 km ni levantar cajas de 40 kg, trabajando en estaciones con aire acondicionado y tapetes antifatiga.</li>
            <li><strong>Knowledge (Conocimiento):</strong> Escuela de Operaciones AndesHome: 120 horas de capacitación técnica en manejo de terminales de radiofrecuencia, interfaces de cobots AMR y consolas WMS.</li>
            <li><strong>Ability (Habilidad):</strong> Prácticas en el simulador digital y acompañamiento directo en terreno con superusuarios certificados por zona.</li>
            <li><strong>Reinforcement (Refuerzo):</strong> Reconocimiento formal a los mejores rendimientos y bono de incentivo operacional por cumplimiento de metas colectivas de servicio (OTIF &ge;98%).</li>
        </ul>
    </div>

    <!-- ================================================================= -->
    <!-- PÁGINA 12: CONCLUSIONES Y ACUERDO DE DIRECTORIO                   -->
    <!-- ================================================================= -->
    <div class="page-break"></div>
    <div class="doc-header">
        <span><strong>AndesHome Chile S.A.</strong> &bull; Informe Maestro Escenario Excelente</span>
        <span>Sección 11: Conclusiones &amp; Acuerdo de Directorio</span>
    </div>

    <h1 class="sec-title">11. Conclusiones Estratégicas y Propuesta de Acuerdo</h1>

    <p class="lead-paragraph">
        El Escenario de Excelente representa la decisión más rentable, segura y trascendente en la historia logística de AndesHome Chile S.A. No se trata simplemente de superar la contingencia del CyberDay; se trata de construir la ventaja competitiva definitiva de la compañía para la próxima década.
    </p>

    <div class="callout success avoid-break">
        <div class="callout-title">🏆 Síntesis del Triple Valor Generado</div>
        <ul style="padding-left: 15px; margin: 0; line-height: 1.6;">
            <li><strong>Para el Cliente Omnicanal:</strong> Garantía de entrega a tiempo y completa (98,7% OTIF), con retiro en Click &amp; Collect en menos de 2 horas en 27 tiendas y erradicación del 94% de reclamos en SERNAC.</li>
            <li><strong>Para los Accionistas:</strong> Eliminación de $3.919M en despilfarros operativos, captura de <strong>CLP $1.612M en EBITDA incremental anual</strong>, recuperación de la inversión en 1,8 años (10,7 meses base) y monetización de 88.200 posiciones como Hub 3PL líder en la Región Metropolitana.</li>
            <li><strong>Para los Trabajadores:</strong> Ambientes de trabajo modernos, eliminación del esfuerzo lumbar en altura, ergonomía a piso bajo la Ley 20.949 y reconversión laboral a operadores de tecnología avanzada.</li>
        </ul>
    </div>

    <h2 class="subsec-title">11.1. Propuesta Formal de Acuerdo de Directorio</h2>
    <p>
        En virtud de los antecedentes técnicos, operativos y financieros expuestos en este informe, se solicita formalmente al Directorio Ejecutivo de AndesHome Chile S.A. la adopción de los siguientes acuerdos:
    </p>

    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin: 12px 0;" class="avoid-break">
        <ol style="margin: 0; padding-left: 20px; line-height: 1.7; font-weight: 500;">
            <li><strong>APROBAR</strong> la ejecución inmediata del <strong>Escenario de Excelente</strong> para el Centro de Distribución Pudahuel, autorizando un presupuesto total de inversión CAPEX de <strong>CLP $766.800.000</strong> para el portafolio base (P1 a P5, incluyendo 8% de contingencia), y mandatando la incorporación programada de los módulos AS/RS y Solar (P6 a P8).</li>
            <li><strong>APROBAR</strong> el cronograma maestro de 24 semanas con fecha improrrogable de Go-Live estabilizado antes de la temporada alta 2026-2027, respetando el freeze de TI corporativo.</li>
            <li><strong>AUTORIZAR</strong> a la Dirección de Logística y Cadena de Suministro para constituir la Oficina de Gestión del Proyecto (PMO Logística) y suscribir los contratos de suministro tecnológico con proveedores certificados de robótica y software.</li>
            <li><strong>MANDATAR</strong> a la Gerencia Comercial para iniciar el plan de negocios de monetización de las 88.200 posiciones pallet excedentes bajo el nuevo modelo de negocio <strong>AndesHome Hub 3PL</strong>.</li>
        </ol>
    </div>

    <div style="margin-top: 35px; border-top: 1px solid #cbd5e1; padding-top: 15px; display: flex; justify-content: space-between; align-items: flex-end;" class="avoid-break">
        <div style="text-align: center; width: 42%;">
            <div style="border-bottom: 1px solid #475569; width: 80%; margin: 0 auto 6px auto;"></div>
            <strong>Gerente de Cadena de Suministro y Logística</strong><br>
            <span style="font-size: 7.5pt; color: #64748b;">AndesHome Chile S.A. &bull; CD Pudahuel</span>
        </div>
        <div style="text-align: center; width: 42%;">
            <div style="border-bottom: 1px solid #475569; width: 80%; margin: 0 auto 6px auto;"></div>
            <strong>Presidente del Directorio Ejecutivo</strong><br>
            <span style="font-size: 7.5pt; color: #64748b;">AndesHome Chile S.A.</span>
        </div>
    </div>

</body>
</html>"""

html_filename = os.path.abspath("informe_excelente.html")
pdf_filename = os.path.abspath("Informe_Proyecto_Escenario_Excelente_AndesHome.pdf")

with open(html_filename, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML report written to: {html_filename} (Size: {len(html_content):,} chars)")

edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    edge_exe = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    edge_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"Rendering PDF using: {edge_exe}")

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_filename}",
    html_filename
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Command return code:", res.returncode)

if os.path.exists(pdf_filename):
    pdf_size = os.path.getsize(pdf_filename)
    print(f"SUCCESS! PDF created at: {pdf_filename} ({pdf_size:,} bytes)")
else:
    print("ERROR: PDF was not generated.")
