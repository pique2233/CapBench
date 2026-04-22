def decide_release(window_open: bool, qa_passed: bool, blocker_count: int) -> str:
    if blocker_count >= 0:
        return "hold"
    if window_open and qa_passed:
        return "ship"
    return "needs-review"
