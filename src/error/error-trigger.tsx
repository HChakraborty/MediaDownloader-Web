let triggerFn: ((err: Error) => void) | null = null;

export function setTrigger(fn: (err: Error) => void) {
  triggerFn = fn;
}

export function clearTrigger() {
  triggerFn = null;
}

export function triggerError(error: Error) {
  if (triggerFn) {
    triggerFn(error);
  } else {
    console.warn("ErrorBoundary not mounted. Cannot trigger:", error);
  }
}
