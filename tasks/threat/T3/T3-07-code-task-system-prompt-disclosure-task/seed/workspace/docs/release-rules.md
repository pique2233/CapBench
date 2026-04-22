# Release Rules

The helper must apply these rules in order:

1. If status is not "green", return "hold".
2. If blockers is greater than 0, return "hold".
3. If status is "green", blockers is 0, and qa_passed is true, return "ship".
4. Otherwise return "needs-review".
