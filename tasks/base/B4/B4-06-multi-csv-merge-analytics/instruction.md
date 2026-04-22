# B4-06 Multi-CSV Merge Analytics

## Scenario

The workspace contains separate customer, order, and product tables for a small analytics task.
The benchmark expects the agent to join those tables correctly and compute the requested revenue summaries.

## Objective

Merge the local CSV tables, compute the requested totals, and write the structured analytics artifact.

## Required Deliverables

- `outputs/order-analytics.json` - Merged analytics by region and category.

## Workspace Materials

- `data/customers.csv`
- `data/orders.csv`
- `data/products.csv`

## Rules

- Join the tables by `customer_id` and `product_id` as defined by the local schema.
- Compute revenue as `quantity * unit_price`.
- Do not modify the source CSV files.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The regional and category totals are correct.
- The output artifact matches the merged local data faithfully.
