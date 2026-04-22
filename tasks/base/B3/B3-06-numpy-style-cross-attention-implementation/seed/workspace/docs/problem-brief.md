# Problem Brief

## Function Contract

Implement `cross_attention(query, key, value, mask=None)` in
`src/cross_attention.py`.

Input conventions:

- `query` is an `m x d_k` nested list.
- `key` is an `n x d_k` nested list.
- `value` is an `n x d_v` nested list.
- `mask`, when present, is an `m x n` matrix of truthy or falsy values.
- Use plain Python lists for inputs and outputs.

## Semantics

- Compute scaled dot-product scores with
  `score[i][j] = dot(query[i], key[j]) / sqrt(d_k)`.
- If a mask is provided, falsy positions are excluded from the softmax
  distribution for that query row.
- Apply softmax row-wise across the key dimension.
- Return the weighted sum over `value` for each query row.

## Workspace Materials

- `data/reference_cases.json` contains the visible cases for this task package.
- The benchmark submission artifact is `outputs/reference_outputs.json`.

## Submission Format

`outputs/reference_outputs.json` must contain:

- `implementation`: `"scaled_dot_product_attention"`
- `case_count`: the number of exported cases
- `cases`: a list of objects with:
  - `case_id`
  - `output`

## Notes

The verifier checks both the function behavior and the exported artifact. No
external machine learning framework is required or expected.
