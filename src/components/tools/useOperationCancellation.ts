"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useOperationCancellation() {
  const controllerRef = useRef<AbortController | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const start = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsCancelling(false);
    return controller;
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setIsCancelling(true);
  }, []);

  const finish = useCallback((controller: AbortController) => {
    if (controllerRef.current === controller) {
      controllerRef.current = null;
      setIsCancelling(false);
    }
  }, []);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    []
  );

  return { start, cancel, finish, isCancelling };
}
