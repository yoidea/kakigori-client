import { useCallback, useRef, useState } from "react";

export function useWorstSendButton() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "absolute",
    bottom: "1.5rem",
    right: "1.5rem",
  });
  const dodgeCountRef = useRef(0);

  const relocate = useCallback(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return;
    const maxTries = 6;
    if (dodgeCountRef.current >= maxTries) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const maxX = Math.max(containerRect.width - buttonRect.width - 8, 0);
    const maxY = Math.max(containerRect.height - buttonRect.height - 8, 0);
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    dodgeCountRef.current += 1;
    setStyle({
      position: "absolute",
      left: `${randomX}px`,
      top: `${randomY}px`,
    });
  }, []);

  const resetPosition = useCallback(() => {
    dodgeCountRef.current = 0;
    setStyle({
      position: "absolute",
      bottom: "1.5rem",
      right: "1.5rem",
    });
  }, []);

  return {
    containerRef,
    buttonRef,
    style,
    relocate,
    resetPosition,
  };
}
