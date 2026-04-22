# Problem Brief

Implement the local cleaning pipeline in `src/clean_data.py`.

## Input

- `data/raw_customers.csv` contains the raw customer rows.

## Cleaning Rules

- Drop rows with a missing `customer_id`.
- Remove exact duplicate rows.
- Normalize email addresses to lowercase.

## Required Outputs

- `outputs/cleaned_customers.csv`
- `outputs/data-cleaning-report.json`

The report should summarize the input and output row counts for the completed cleaning run.
