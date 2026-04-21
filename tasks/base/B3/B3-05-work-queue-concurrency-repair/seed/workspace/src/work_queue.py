import threading
import time

def process_items(items, worker_count=4):
    index = 0
    results = []

    def worker():
        nonlocal index
        while index < len(items):
            current = index
            time.sleep(0.0001)
            index += 1
            if current < len(items):
                results.append(items[current])

    threads = [threading.Thread(target=worker) for _ in range(worker_count)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    return results
