/**
 * Safe Event Bus helper that avoids SecurityError in cross-origin iframe environments
 * while continuing to support communication between components on `window` and
 * optional parent frame integration when accessible.
 */

function getSafeParent() {
  try {
    if (window.parent && window.parent !== window) {
      // Accessing location.origin will throw a SecurityError if cross-origin
      if (window.parent.location && window.parent.location.origin === window.location.origin) {
        return window.parent;
      }
    }
  } catch (e) {
    // Cross-origin access blocked
  }
  return null;
}

export function safeAddEventListener(type, listener, options) {
  try {
    window.addEventListener(type, listener, options);
  } catch (e) {
    console.warn("Failed to attach event listener to window:", e);
  }

  try {
    const parent = getSafeParent();
    if (parent) {
      parent.addEventListener(type, listener, options);
    }
  } catch (e) {
    // Ignore cross-origin error
  }
}

export function safeRemoveEventListener(type, listener, options) {
  try {
    window.removeEventListener(type, listener, options);
  } catch (e) {
    // Ignore
  }

  try {
    const parent = getSafeParent();
    if (parent) {
      parent.removeEventListener(type, listener, options);
    }
  } catch (e) {
    // Ignore
  }
}

export function safeDispatchEvent(event) {
  try {
    window.dispatchEvent(event);
  } catch (e) {
    console.warn("Failed to dispatch event to window:", e);
  }

  try {
    const parent = getSafeParent();
    if (parent) {
      parent.dispatchEvent(event);
    }
  } catch (e) {
    // Ignore cross-origin error
  }
}
