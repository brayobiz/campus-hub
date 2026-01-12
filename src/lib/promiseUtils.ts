// Helper utilities for promises with hard timeouts
// This ensures long-running or hung network calls cannot block the app indefinitely.
export async function withTimeout<T>(promise: Promise<T>, ms = 8000, errMsg = 'Operation timed out') {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errMsg)), ms);
  });

  try {
    const result = await Promise.race([promise, timeout]);
    return result as T;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
