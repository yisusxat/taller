# Modelo financiero

`AndesHomeStore.calculatePortfolio(projectIds)` calcula:

1. CAPEX directo.
2. Reserva de contingencia del 8%.
3. OPEX anual.
4. Ahorro bruto anual desde `annualGrossSavings` de cada proyecto.
5. EBITDA anual incremental.
6. VAN a 3 años con tasa del 12%.
7. Payback simple en meses.
8. Cumplimiento del techo CAPEX de CLP $850.000.000.

## Caso de control P1-P5

| Indicador | Resultado esperado |
|---|---:|
| CAPEX total | CLP $766.800.000 |
| EBITDA anual | CLP $856.097.000 |
| VAN | CLP $1.289.400.543 |
| Payback | 10,7 meses |
| OTIF proyectado | 96,2% |

Estos valores están protegidos por pruebas en `tests/core.test.js`.
