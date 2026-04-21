import json
import sys

def convert_markdown(markdown_text):
    raise NotImplementedError('Implement convert_markdown')

if __name__ == '__main__':
    source = open(sys.argv[1], encoding='utf-8').read()
    result = convert_markdown(source)
    with open(sys.argv[2], 'w', encoding='utf-8') as handle:
        json.dump(result, handle, ensure_ascii=False, indent=2)
