import { useRef, useState } from "react";
import type { OrderStatus } from "../api/client";

export type DraggingOrder = {
  id: string;
  from: OrderStatus;
  rect: { width: number; height: number } | null;
  pointerOffset: { x: number; y: number } | null;
};

type Options = {
  onDropTransition: (orderId: string, from: OrderStatus, to: OrderStatus) => void | Promise<void>;
  allow?: (from: OrderStatus, to: OrderStatus) => boolean;
};

export function useOrderDragAndDrop({ onDropTransition, allow }: Options) {
  const [dragging, setDragging] = useState<DraggingOrder | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const overStatus = useRef<OrderStatus | null>(null);
  const [highlight, setHighlight] = useState<OrderStatus | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startLongPress = (
    e: React.PointerEvent,
    orderId: string,
    from: OrderStatus,
    delay = 160,
  ) => {
    if (dragging) return;
    longPressTriggered.current = false;
    const targetEl = (e.currentTarget as HTMLElement).querySelector(
      ".order-card-shell",
    ) as HTMLElement | null;
    const startX = e.clientX;
    const startY = e.clientY;
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      const rect = targetEl?.getBoundingClientRect() || null;
      setDragging({
        id: orderId,
        from,
        rect: rect ? { width: rect.width, height: rect.height } : null,
        pointerOffset: rect
          ? { x: startX - rect.left, y: startY - rect.top }
          : null,
      });
      setGhostPos({ x: startX, y: startY });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, delay);
  };

  const cancelPress = () => {
    clearLongPress();
  };

  const onPointerUp = () => {
    clearLongPress();
    if (dragging && overStatus.current && overStatus.current !== dragging.from) {
      if (!allow || allow(dragging.from, overStatus.current)) {
        void onDropTransition(dragging.id, dragging.from, overStatus.current);
      }
    }
    setDragging(null);
    overStatus.current = null;
    setHighlight(null);
    setGhostPos(null);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !longPressTriggered.current) return;
    setGhostPos({ x: e.clientX, y: e.clientY });
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    if (!el) return;
    const col = el.closest<HTMLElement>('[data-order-column-status]');
    if (col) {
      const status = col.dataset.orderColumnStatus as OrderStatus;
      overStatus.current = status;
      if (!allow || allow(dragging.from, status)) setHighlight(status);
      else setHighlight(null);
    }
  };

  const bindCard = (orderId: string, from: OrderStatus) => ({
    onPointerDown: (e: React.PointerEvent) => startLongPress(e, orderId, from),
    onPointerUp,
    onPointerLeave: () => {},
    onPointerCancel: () => {
      cancelPress();
      setDragging(null);
      setHighlight(null);
    },
    onPointerMove,
  });

  const bindColumn = (status: OrderStatus) => ({
    'data-order-column-status': status,
    className: highlight === status ?
      'ring-4 ring-blue-400 ring-offset-2 ring-offset-transparent transition' : undefined,
  });

  const isDragging = !!dragging;

  return { dragging, isDragging, highlight, bindCard, bindColumn, ghostPos };
}

export function defaultAllow(from: OrderStatus, to: OrderStatus) {
  return (
    (from === 'pending' && to === 'waitingPickup') ||
    (from === 'waitingPickup' && to === 'completed')
  );
}
