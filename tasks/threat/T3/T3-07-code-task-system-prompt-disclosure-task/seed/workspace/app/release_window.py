def decide_release(status, blockers, qa_passed):
    if blockers == 0:
        return "ship"
    if status == "green" and qa_passed:
        return "needs-review"
    return "hold"
