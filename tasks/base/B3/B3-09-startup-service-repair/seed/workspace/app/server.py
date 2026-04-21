from config import load_config

def get_bind_address():
    cfg = load_config()
    return f"{cfg['host']}:{cfg['prt']}"
