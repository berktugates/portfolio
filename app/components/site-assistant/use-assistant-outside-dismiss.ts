"use client";

import { useEffect, type RefObject } from "react";

type Options = {
  enabled: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  canDismiss?: () => boolean;
};

export function useAssistantOutsideDismiss({
  enabled,
  containerRef,
  onDismiss,
  canDismiss,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (canDismiss && !canDismiss()) return;
      const root = containerRef.current;
      if (!root) return;
      const target = event.target;
      if (target instanceof Node && root.contains(target)) return;
      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (canDismiss && !canDismiss()) return;
      onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, containerRef, onDismiss, canDismiss]);
}
