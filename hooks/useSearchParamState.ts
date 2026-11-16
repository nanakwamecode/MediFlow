"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Sync a piece of state with a URL search parameter so it survives page refresh.
 * Returns [value, setter, clearer].
 */
export function useSearchParamState(
  key: string
): [string | null, (val: string) => void, () => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = searchParams.get(key);

  const setValue = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, val);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [key, pathname, router, searchParams]
  );

  const clearValue = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [key, pathname, router, searchParams]);

  return [value, setValue, clearValue];
}
