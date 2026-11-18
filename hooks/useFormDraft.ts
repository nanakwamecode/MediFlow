"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Persists form draft state to sessionStorage so it survives page refresh.
 */
export function useFormDraft<T extends Record<string, unknown>>(
  key: string,
  initialValues: T
): [T, (updates: Partial<T> | ((prev: T) => T)) => void, () => void] {
  const storageKey = `mediflow_draft_${key}`;

  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValues;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        return { ...initialValues, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return initialValues;
  });

  const updateState = useCallback(
    (updates: Partial<T> | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof updates === "function" ? updates(prev) : { ...prev, ...updates };
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setState(initialValues);
  }, [storageKey, initialValues]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setState({ ...initialValues, ...JSON.parse(saved) });
      } else {
        setState(initialValues);
      }
    } catch {
      setState(initialValues);
    }
  }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, updateState, clearDraft];
}
