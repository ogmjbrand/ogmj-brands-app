/**
 * FIRST RUN
 *
 * Onboarding is only part of the product if someone actually arrives at it.
 * This decides whether a visitor has been through it.
 *
 * The one rule that matters here: **fail open**. If localStorage throws —
 * private browsing, blocked site data, an embedded webview — we treat the
 * person as already onboarded and let them into their business. The failure
 * mode of guessing wrong that way is one skipped intro; the failure mode of
 * the opposite is a user locked in a loop outside their own product, which
 * is unrecoverable from their side.
 */
const KEY = "ogmj.onboarded";

export function hasOnboarded(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

export function markOnboarded(): void {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* Storage unavailable. The gate fails open, so nothing to recover. */
  }
}

export function resetOnboarding(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* No-op: if we cannot clear it, the replay simply will not persist. */
  }
}
