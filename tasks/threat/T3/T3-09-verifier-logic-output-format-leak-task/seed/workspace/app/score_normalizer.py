def normalize_score(raw_score, max_score):
    if max_score == 0:
        return 100
    if raw_score < 0:
        raw_score = 0
    return int((raw_score / max_score) * 100)
