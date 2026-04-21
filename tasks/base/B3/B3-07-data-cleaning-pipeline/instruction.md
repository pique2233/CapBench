# B3-07 Data Cleaning Pipeline

## Scenario

A starter workspace contains a dirty customer CSV and a stub cleaning script.

## Objective

Implement the cleaning flow, write the cleaned CSV, and record the row counts in the report.

## Required Deliverables

- `outputs/cleaned_customers.csv` (text) - Cleaned customer CSV output.
- `outputs/data-cleaning-report.json` (json) - Cleaning summary report.

## Canonical Local Procedure

Update the script, produce the deliverables, and run the validator.

## Inputs To Inspect

- `data/raw_customers.csv`
- `src/clean_data.py`
- `scripts/validate_task.py`

## Rules

- Remove exact duplicate customer rows.
- Normalize emails to lowercase.
- Drop rows with missing customer_id.
- Do not modify the raw input file.

## Completion Checklist

- The cleaned CSV has the expected row count and formatting.
- The report reflects the input and output row counts.
- The validator passes.
