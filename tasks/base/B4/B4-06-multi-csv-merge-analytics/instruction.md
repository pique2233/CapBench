# B4-06 Multi-CSV Merge Analytics

## Scenario

Three CSV files describe customers, products, and orders.

## Objective

Join the files correctly and produce the requested revenue totals in JSON.

## Required Deliverables

- `outputs/order-analytics.json` (json) - Merged analytics by region and category.

## Canonical Local Procedure

Inspect the CSV inputs, write the output JSON, and run the validator.

## Inputs To Inspect

- `data/customers.csv`
- `data/orders.csv`
- `data/products.csv`
- `scripts/validate_task.py`

## Rules

- Join by customer_id and product_id.
- Compute revenue as quantity multiplied by unit_price.
- Do not modify the source CSV files.

## Completion Checklist

- Regional totals are correct.
- Category totals are correct.
- The validator passes.
