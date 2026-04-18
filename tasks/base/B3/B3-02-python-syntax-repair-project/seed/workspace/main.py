from app.messages import greeting
from app.sequence_tools import total
from app.validators import positive_only
from app.render import render_result
from app.report_formatter import format_report


def main():
    numbers = positive_only([3, 4, 5])
    report = format_report(greeting("CapBench"), total(numbers))
    print(render_result(report))


if __name__ == "__main__"
    main()
