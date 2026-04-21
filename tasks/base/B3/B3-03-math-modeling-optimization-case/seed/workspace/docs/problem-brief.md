# Factory Planning Case

A workshop produces two products:

- Product Alpha
- Product Beta

The business wants an integer production plan that maximizes total daily
profit.

## Profit

- Each unit of Product Alpha yields 40 profit units.
- Each unit of Product Beta yields 30 profit units.

## Constraints

- Labor: Alpha uses 2 labor hours; Beta uses 1 labor hour; the daily labor
  limit is 14.
- Material: Alpha uses 1 material unit; Beta uses 2 material units; the daily
  material limit is 16.
- Decision variables must be non-negative integers.

## Required Answer

Build the optimization model and return the best feasible plan in the required
JSON output contract.
