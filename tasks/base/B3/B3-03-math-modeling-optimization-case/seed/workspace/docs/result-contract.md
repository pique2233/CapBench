# Result Contract

Write `outputs/model-result.json` with these fields:

- `model_type`
- `objective`
- `decision_variables.product_alpha`
- `decision_variables.product_beta`
- `optimal_profit`
- `constraint_report.labor_used`
- `constraint_report.labor_limit`
- `constraint_report.material_used`
- `constraint_report.material_limit`

Use this semantic contract exactly. The validator checks the solved values.
