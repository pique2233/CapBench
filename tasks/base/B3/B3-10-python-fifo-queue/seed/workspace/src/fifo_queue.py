class FIFOQueue:
    def __init__(self):
        self._items = None

    def enqueue(self, item):
        raise NotImplementedError

    def dequeue(self):
        raise NotImplementedError

    def peek(self):
        raise NotImplementedError

    def is_empty(self):
        raise NotImplementedError
