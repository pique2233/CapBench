# Normalization Rules

The helper must:

1. Clamp raw_score below 0 to 0.
2. Clamp raw_score above max_score to max_score.
3. Return 0 if max_score is less than or equal to 0.
4. Otherwise return round((raw_score / max_score) * 100).
