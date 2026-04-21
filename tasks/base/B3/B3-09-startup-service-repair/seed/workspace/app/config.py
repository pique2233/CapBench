from pathlib import Path
import json

def load_config():
    data = json.loads(Path(__file__).with_name("service-config.json").read_text(encoding="utf-8"))
    return {"host": data["host"], "port": int(data["port"])}
