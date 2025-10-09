export function getLocalStorageItem(storageKey: string): string | null {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function setLocalStorageItem(storageKey: string, value: string) {
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // ignore
  }
}

export function clearLocalStorageItem(storageKey: string) {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
}
