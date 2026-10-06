# INFORME DE DIAGNÓSTICO ORGANIZACIONAL (EA1)
## Optimización Integral del Centro de Distribución Pudahuel ante la Expansión Omnicanal — AndesHome Chile S.A.

**Asignatura:** GLA1104 | Taller de Logística y Cadena de Suministro  
**Metodología:** Basada en Desafíos (18 Semanas) | Evaluación Evaluativa 1 (EA1)  
**Fecha de Emisión:** Octubre 2026  
**Alcance del Análisis:** Evaluación del desempeño histórico 2025-2026 (Base de Datos v2: 29 hojas analizadas)  

---

## 1. Resumen Ejecutivo

AndesHome Chile S.A. enfrenta una crisis operacional severa tras la ejecución del evento **CyberDay (1-3 de junio de 2026)**. La operación del Centro de Distribución (CD) Pudahuel excede su capacidad de proceso efectiva, generando un deterioro sistemático de los niveles de servicio y un aumento descontrolado en los costos operativos.

### 1.1. Principales Hallazgos Cuantitativos
1. **Colapso del Nivel de Servicio (OTIF):** El OTIF mensual cayó desde **92,3% en julio 2025** a un crítico **80,9% en junio 2026** (meta $\ge 96,0\%$). Durante la ventana peak de CyberDay, el OTIF real de la muestra representativa cayó a **43,5%** (y **11,5% en Click & Collect**), debido al desbordamiento del canal e-commerce.
2. **Acumulación Estructural de Backlog:** El volumen de pedidos no despachados creció de **69 pedidos el 1 de enero de 2026** a **15.387 pedidos al 30 de junio de 2026** (equivalente a 4,32 días completos de demanda). El backlog creció en el **95,6% de los días** del primer semestre.
3. **Escalamiento del Costo Unitario:** El costo logístico por pedido aumentó de **CLP 5.880 en julio 2025** a **CLP 7.920 en junio 2026** (+34,7%), impulsado por sobretiempos, reprocesos, reintentos de despacho y demurrage. En la muestra de pedidos, los envíos fallidos promedian un costo de **CLP 29.628** vs **CLP 8.532** para los pedidos cumplidos (un recargo del +247%).
4. **Dock-to-Stock ineficiente:** El tiempo transcurrido desde el arribo del camión hasta la disponibilidad en stock subió de **10,8 horas a 22,6 horas** en junio 2026 (meta $\le 8,0\text{ h}$). La baja adopción de **ASN (65,3%)** y **Citas de Andén (65,0%)** genera esperas promedio de 63,4 a 65,2 minutos en los arribos no programados.
5. **Desalineación Crítica de Layout (Slotting Mismatch):** El **25,3% de los SKU (114 de 450)** están ubicados en zonas que no responden a su velocidad de rotación o tipo de producto, concentrando el **30,9% de las visitas de picking**. Esto genera un exceso de recorrido ineficiente de **67,6 km/día** (+12,9% sobre el ideal) e ineficiencias equivalentes a **23,5 horas-hombre de caminata diaria**.
6. **Riesgo Ocupacional (SST) y Ergonomía:** Se registraron 120 incidentes en los últimos 12 meses (12 de alta severidad, 53 días perdidos). La zona **D-Bulky** concentra el **83,8 incidentes por cada 100.000 HH**, donde 38 de 64 SKU pesados (>25 kg) se manipulan de forma manual sin ayuda mecánica operativa.
7. **Rendimiento Decreciente de Horas Extra:** La adición de horas extra durante peak muestra un impacto marginal nulo o negativo en áreas saturadas. En A-Rápida y D-Bulky, las horas extra tienen una correlación negativa con las líneas preparadas por hora debido a congestión en pasillos, fatiga y aumento del error de picking a **2,44% en peak** (vs 0,69% normal).

---

## 2. Contexto, Gobierno y Auditoría de Datos

### 2.1. Alcance Operacional
AndesHome opera una red de **58 tiendas**, canal E-commerce (RM y Regiones), Click & Collect y despachos Direct-to-Consumer Bulky, abastecidos desde el CD Pudahuel (31.500 m², 20.400 posiciones pallet).

### 2.2. Tensiones entre Stakeholders
* **Directorio:** Exige OTIF $\ge 96\%$, CAPEX $\le \text{CLP 850 MM}$ en 36 semanas sin detener la operación.
* **Operaciones CD:** Teme que el rediseño tecnológico/proceso interrumpa la continuidad del CD durante la temporada alta 2026-2027.
* **Finanzas:** Exige la eliminación de duplicidad de beneficios y validación rigurosa del retorno económico (tasa de descuento 12% anual).
* **TI:** Exige datos depurados y prohíbe despliegues sin pruebas de integración (advierte freeze corporativo de 4 semanas en semana 10).
* **Prevención de Riesgos:** Condiciona cualquier cambio en layout a la erradicación del manejo manual >25 kg en D-Bulky.

### 2.3. Auditoría de Calidad de Datos (Data Quality)
Se identificaron 12 anomalías críticas en los registros que requieren depuración previa al rediseño:
* **DQ-02 (SKU_Master):** SKU-0118 de alta rotación carece de EAN-13 (código interno), elevando el error de picking en un +25% vs SKU estandarizados (1,10% vs 0,88%).
* **DQ-03 / DQ-04 (Inventario):** SKU-0023 presenta una diferencia física >15%; 82 SKU (18,2%) no han sido contados en los últimos 100 días. 130 de 161 SKU A llevan >30 días sin conteo cíclico.
* **DQ-07 (Rutas):** RUT-0106 reporta utilización volumétrica >100% debido a datos maestros de cubicaje imprecisos.
* **DQ-11 (Pedidos_Diarios):** Inconsistencia en pedidos totales entre hojas: `KPI_Mensual` reporta 171.400 pedidos en junio 2026, mientras `Pedidos_Diarios` suma 141.874 pedidos (brecha de 29.526 pedidos no consolidados o registrados en contingencia).

---

## 3. Arquitectura del Proceso Actual (SIPOC y VSM)

### 3.1. Diagrama SIPOC

```
[Proveedores (30)] ---> [Inbound (24 andenes)] ---> [Almacenamiento (A,B,C,D)] ---> [Picking/Packing] ---> [Transporte (3 Carriers)] ---> [Clientes / Tiendas]
  - Nac./Imp.              - Recepción/QC             - 20.400 Pallets              - Olas RF/Papel           - LogiExpress, RutaSur         - 58 Tiendas
  - 65% ASN                - Staging                  - Slotting desalineado        - Embalaje manual         - TransAndes                   - E-com / C&C
```

### 3.2. Value Stream Mapping (VSM) Actual — Diagnóstico Cuantitativo de Tiempos
A partir del análisis integrado de los datasets de Pedidos, Recepciones y Rutas, se obtiene la siguiente estructura del flujo de valor:

```mermaid
flowchart LR
    A["Inbound / Arribo<br/>(Cita/ASN)"] -->|Espera: 33,4 min| B["Descarga y QC<br/>Proc: 105,2 min"]
    B -->|Staging / Wait| C["Putaway a Rack<br/>Proc: 95,4 min"]
    C -->|Inv. Lead Time: 22,5 días| D["Picking Olas<br/>Proc: 5,6 h (E-com) / 7,9 h (Tiendas)"]
    D -->|Cola Packing: 2,2 h| E["Packing & Label<br/>Proc: 3,3 h"]
    E -->|Demora Despacho: 14,4 h (E-com)| F["Carga & Ruta última milla<br/>Proc: 6,0 h"]
```

#### Resumen de Tiempos de Flujo por Canal (Promedios Operativos):
* **E-commerce Domicilio RM:** Tiempo de proceso puro = 8,9 h | Tiempo de cola/espera en CD = 16,6 h | **Ciclo Total = 35,6 h** (Promesa: 48 h).
* **Click & Collect:** Tiempo de proceso puro = 7,2 h | Tiempo de cola/espera en CD = 4,1 h | **Ciclo Total = 20,4 h** (Promesa: 24 h).
* **Reposición Tiendas:** Tiempo de proceso puro = 9,8 h | Tiempo de cola/espera en CD = 8,9 h | **Ciclo Total = 26,0 h** (Promesa: 30 h).
* **E-commerce Regiones (Muestra):** Ciclo medio = **53,5 h** (Promesa: 72 a 120 h).

*En eventos Peak (CyberDay), las colas de espera en packing y despacho se multiplicaron por **10x**, llevando el tiempo en cola a **28,0 horas en E-commerce** y elevando el ciclo promedio a **78,2 horas**, generando un colapso masivo de la promesa de servicio.*

---

## 4. KPIs y Análisis Cuantitativo

### 4.1. Análisis del Pedido Perfecto (Estándar APQC)
El indicador de Pedido Perfecto global de la muestra (3.000 órdenes) se descompone en los cuatro factores estandarizados:

$$\text{Pedido Perfecto} = \% \text{A tiempo} \times \% \text{Completo} \times \% \text{Sin daño} \times \% \text{Doc. correcta}$$

$$\text{Pedido Perfecto} = 82,3\% \times 95,1\% \times 99,2\% \times 99,6\% = 77,4\% \quad (\text{Reportado Muestra: } 81,3\%)$$

#### Desglose por Canal y Evento Peak:

| Canal / Escenario | OTIF (% A Tiempo $\times$ Completo) | A Tiempo (%) | Completo (%) | Sin Daño (%) | Pedido Perfecto (%) | Costo Prom. Pedido (CLP) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bulky domicilio** | 86,6% | 91,8% | 94,8% | 99,6% | 86,1% | $11.031 |
| **Click & Collect** | 75,1% | 78,4% | 95,3% | 99,1% | 73,7% | $12.227 |
| **E-commerce domicilio** | 85,1% | 88,6% | 95,5% | 99,2% | 84,0% | $11.419 |
| **Reposición tiendas** | 77,8% | 81,9% | 94,2% | 99,3% | 77,6% | $16.647 |
| **Operación Normal** | **87,5%** | **90,9%** | **96,3%** | **99,2%** | **86,5%** | **$11.090** |
| **Operación Peak Cyber** | **43,5%** | **48,9%** | **87,5%** | **99,1%** | **42,3%** | **$21.107** |

*El costo logístico unitario se duplica (+90,3%) durante la ventana Peak Cyber debido al despacho a deshoras, reintentos y contratación de capacidad urgente.*

---

### 4.2. Inbound y Desempeño de Proveedores
* **Evaluación Dock-to-Stock:** El tiempo medio global es **3,90 horas** en la hoja `Recepciones` (muestra de 320 recepciones), pero en el agregado mensual de `KPI_Mensual` sube a **22,6 horas en junio 2026** por congestión de staging y falta de putaway oportuno.
* **Efecto de ASN y Cita de Andén:**
  * **Con ASN y Cita (43,1% del total):** Dock-to-Stock = **3,16 horas** | Espera = **17,5 min**.
  * **Sin ASN y Sin Cita (12,8% del total):** Dock-to-Stock = **5,79 horas** (+83,2%) | Espera = **65,2 min** (+272%).
* **Impacto Financiero de Esperas (Demurrage):** 19 recepciones de proveedores importados acumularon **CLP 146.319.000** en cobros por demurrage.
* **Proveedores Críticos:** 8 proveedores representan el 85,2% de la compra anual con cumplimiento de ASN inferior al 80%. Destacan `Proveedor 22` (ASN 21,7%, D2S 21,8 h) y `Proveedor 16` (ASN 28,2%, D2S 21,8 h).

---

### 4.3. Inventario, Slotting Mismatch y Requerimiento Ergónomico

```
ZONIFICACIÓN DE PICKING VS UBICACIÓN ACTUAL (SKU_Master)
+-------------------------------------------------------------------------+
| Zona A-Rápida (35m)  : 84 SKU actuales | Ideal: 105 SKU (Falta cap.)   |
| Zona B-Media  (72m)  : 125 SKU actuales| Ideal: 120 SKU                |
| Zona C-Lenta  (118m) : 154 SKU actuales| Ideal: 147 SKU (SKU A ocultos) |
| Zona D-Bulky  (154m) : 87 SKU actuales | Ideal: 78 SKU                 |
+-------------------------------------------------------------------------+
```

1. **Exactitud de Inventario (IRA):**
   * IRA Físico/Sistema en Unidades: **97,74%** global (junio cae a 93,8%, meta $\ge 99,2\%$).
   * IRA Valorizado: **97,33%**, con una discrepancia valorizada absoluta de **CLP 388,9 millones** (104 SKU explican el 80% de la pérdida económica).
   * Solo el **27,1% de los SKU** cumple con la meta $\ge 99,2\%$.
2. **Evaluación de Slotting Mismatch:**
   * 114 SKU (25,3%) están fuera de su zona óptima.
   * **12 SKU de Alta Rotación (Clase A)** están almacenados en la **Zona C-Lenta (118 metros)** y **10 SKU Clase A** en **Zona D-Bulky (154 metros)**.
   * **Top SKU Mismatched:** `SKU-0003` (Ferretería A) ubicado en D-Bulky genera un exceso de caminata de **14.256 m/día**; `SKU-0005` (Cocina A) en C-Lenta genera **9.977 m/día** adicionales.
3. **Manejo Manual de Carga (MMC >25 kg):**
   * 64 SKU superan los 25 kg. 38 SKU se manipulan manualmente en D-Bulky sin ayuda mecánica funcional (violación de la normativa de la Dirección del Trabajo).

---

### 4.4. Productividad y Cuellos de Botella Operacionales
Del análisis de 1.464 registros de turnos y zonas en `Productividad`:
* **Productividad por Zona:**
  * **A-Rápida:** 46,8 líneas/hora-hombre | Viaje: 22,7% | Inactividad: 7,9%.
  * **B-Media:** 37,6 líneas/hora-hombre | Viaje: 31,7% | Inactividad: 7,8%.
  * **C-Lenta:** 27,8 líneas/hora-hombre | Viaje: 42,9% | Inactividad: 8,1%.
  * **D-Bulky:** 17,3 líneas/hora-hombre | Viaje: 39,1% | Inactividad: 8,2%.
* **Productividad por Turno:** Mañana (37,9 lin/h) vs Tarde (36,2 lin/h) vs Noche (32,5 lin/h). El turno Noche presenta mayor ausentismo (**8,4%**) y menor cobertura de superusuarios en WMS/RF.
* **Costo de Ineficiencias de Tiempo:**
  * Horas de Viaje acumuladas (4 meses): **61.598 horas** = **CLP 585,2 millones**.
  * Horas Inactivas acumuladas: **15.316 horas** = **CLP 145,5 millones**.
  * Costo por Errores de Picking (50.251 errores en 4 meses a CLP 18.500/error): **CLP 929,6 millones**.

---

### 4.5. Transporte, Última Milla y Devoluciones
* **Utilización de Flota:** Utilización ponderada volumétrica = **73,6%**, en peso = **71,8%**. 139 de 420 rutas (33,1%) presentan utilización $<70\%$ tanto en peso como en volumen.
* **Efectividad en Primera Entrega:** Promedio = **88,5%** (11,5% de entregas fallidas = 984 intentos fallidos en la muestra, costo directo de reintento **CLP 16,2 millones**).
* **Análisis de Devoluciones (900 eventos, CLP 51,2 millones):**
  1. **Daño en Transporte:** 183 casos (36,1% del costo total de devoluciones).
  2. **Producto Equivocado:** 218 casos (18,5% del costo total).
  3. **Entrega Tardía:** 143 casos (13,0% del costo total).
  * *El 67,6% del costo de devoluciones es directamente controlable por mejoras en packing, picking y transporte.*
* **Análisis de Reclamos de Clientes (700 casos, NPS promedio = 5,06):**
  * El 68,0% de los clientes reclamantes son **Detractores (NPS $\le$ 6)**.
  * Principales motivos: Entrega tardía (30,7%), Producto dañado (17,6%), Producto equivocado (15,6%). El **95,3% de las causas raíz pertenecen a Operaciones**.

---

## 5. Análisis de Causa Raíz

### 5.1. Diagrama Causa-Efecto (Ishikawa)

```
MÉTODOS Y PROCESOS                   MAQUINARIA Y SISTEMAS
- Olas fijas sin priorización         - WMS legado sin algoritmos slotting
- Citas/ASN por Excel y mail          - RF parcial, papel contingencia
- Slotting desalineado (25% SKU)      - Transpaletas/Mesas fuera de servicio
                                                                            \
                                                                             +---> CAUSA RAÍZ CENTRAL:
                                                                             |     PÉRDIDA DE CAPACIDAD DE PROCESO
                                                                             |     Y COLAPSO DEL OTIF EN PEAK
                                                                            /
PERSONAS Y DOTE                     DATOS Y MEDIO AMBIENTE
- 8,4% ausentismo en turno noche      - Maestro SKU con imprecisión cubicaje
- Brecha digital en temporales        - Acumulación staging en recepción
- Horas extra con fatiga              - Congestión en pasillos A-Rápida
```

### 5.2. Los 5 Porqués (Ejemplo: Pérdida de Servicio en Peak)
1. **¿Por qué cayó el OTIF a 80,9% en junio?** Porque el 17,3% de los pedidos no se despachó a tiempo ni completo.
2. **¿Por qué no se despacharon a tiempo?** Porque se generó un backlog de 15.387 pedidos que sobrepasó la capacidad diaria del CD.
3. **¿Por qué colapsó la capacidad diaria?** Porque la productividad de picking cayó de 35,7 a 29,7 lin/h por congestión y exceso de recorrido.
4. **¿Por qué se congestionó el picking y aumentaron los recorridos?** Porque 114 SKU de alta rotación están mal ubicados (C-Lenta/D-Bulky) y el personal temporal cometió 2,44% de errores.
5. **¿Por qué los SKU están mal ubicados y el personal comete errores?** Porque la empresa no posee un WMS moderno con re-slotting dinámico ni un programa continuo de capacitación y control de datos maestros.

---

## 6. Sostenibilidad, Ergonomía y Cumplimiento Normativo

### 6.1. Evaluación de Impacto Ambiental (ESG)
* **Emisiones CO2e por Pedido:** Subió de **1,79 kg CO2e en julio 2025** a **2,22 kg CO2e en junio 2026** (meta $\le 1,545\text{ kg}$, reducción del 20%).
* **Consumo Energético y Diésel:** El CD consumió 896.619 litros de diésel en 12 meses (2.402,8 t CO2e). La energía solar autogenerada representa solo el **7,4%** del consumo eléctrico total (430.067 kWh solar vs 5.392.711 kWh red).
* **Gestión de Residuos (Ley 20.920 REP):** Se generaron 948,7 toneladas de cartón y 247,7 toneladas de plástico. La tasa de valorización promedio fue del **62,4%**, con meses críticos (marzo 2026) cayendo al 44,9%.

### 6.2. Seguridad Laboral (SST) y Ergonomía
* **Incidentes:** 120 incidentes en el año (50 cuasi accidentes, 21 golpes, 17 sobreesfuerzos, 12 colisiones MHE).
* **Zona Crítica D-Bulky:** Registra 26 incidentes y 16 días perdidos, con una tasa de **83,8 incidentes/100k HH**. Las causas principales son la ausencia de mesas elevadoras operativas (disponibilidad de mesas es solo 71%) y la manipulación manual de cargas entre 26 kg y 55 kg.

---

## 7. Priorización de Problemas (Matriz Impacto - Urgencia - Controlabilidad)

| ID | Problema Priorizado | Impacto Financiero / Servicio | Urgencia | Controlabilidad | Prioridad |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **P-01** | Desalineación de Slotting y excesos de recorrido | Alto (CLP 585M viaje) | Alta | Alta | **Crítica (1)** |
| **P-02** | Ineficiencia WMS/RF y errores de picking | Alto (CLP 929M errores) | Alta | Media | **Crítica (2)** |
| **P-03** | Cuello de botella Inbound por falta de ASN/Cita | Alto (CLP 146M demurrage) | Alta | Alta | **Alta (3)** |
| **P-04** | Suboptimización de rutas y entregas fallidas | Medio (CLP 16M fallidas) | Media | Alta | **Alta (4)** |
| **P-05** | Daños en transporte y sobreembalaje | Medio (CLP 18M daños) | Media | Alta | **Media (5)** |
| **P-06** | Riesgos SST por MMC manual en D-Bulky | Alto (Riesgo legal DT) | Alta | Alta | **Crítica (6)** |

---

## 8. Conclusiones y Requerimientos de Diseño Futuro (EA2 / EA3)

### 8.1. Conclusión del Diagnóstico
El CD Pudahuel no carece de espacio físico total (ocupación promedio 90,7%), sino de **capacidad de proceso, calidad de datos y disciplina operativa**. El deterioro del OTIF y el aumento de costos se explican por la amplificación sistémica de ineficiencias: datos maestros deficientes $\rightarrow$ desalineación de slotting $\rightarrow$ recorridos excesivos $\rightarrow$ congestión en pasillos $\rightarrow$ errores y demoras $\rightarrow$ uso ineficiente de horas extra $\rightarrow$ acumulaciones en packing/despacho $\rightarrow$ entregas tardías y devoluciones.

### 8.2. Criterios de Diseño Futuro (Restricciones del Desafío)
Para la fase de Propuestas de Solución (EA2) y Plan de Implementación (EA3), la alternativa seleccionada deberá cumplir estrictamente con:
1. **Presupuesto CAPEX:** $\le \text{CLP 850.000.000}$ (incluyendo reserva de contingencia).
2. **Plazo de Estabilización:** $\le 36\text{ semanas}$ (operativo antes del Peak Cyber 2027).
3. **Continuidad Operacional:** Despliegue por fases sin detener las operaciones del CD.
4. **Metas Obligatorias:** OTIF $\ge 96,0\%$, Exactitud de Inventario $\ge 99,2\%$, Precisión de Picking $\ge 99,5\%$, Reducción de Costo/Pedido $\ge 12\%$, Reducción de $\text{CO}_2\text{e}$/Pedido $\ge 20\%$, Ergonomía D-Bulky 100% regulada.
