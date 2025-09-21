import type { OrderResponse, OrderStatus } from "../api/client";
import { useCallback, useState } from "react";

export type SelectionMap = Record<OrderStatus, Set<string>>;

export function useOrderSelection(initial?: SelectionMap) {
  const [selected, setSelected] = useState<SelectionMap>(
    initial || {
      pending: new Set(),
      waitingPickup: new Set(),
      completed: new Set(),
    },
  );

  const toggle = useCallback((status: OrderStatus, id: string) => {
    setSelected((prev) => {
      const next = { ...prev, [status]: new Set(prev[status]) } as SelectionMap;
      if (next[status].has(id)) next[status].delete(id);
      else next[status].add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(
    (status: OrderStatus, orders: OrderResponse[]) => {
      const ids = orders.map((o) => o.id);
      setSelected((prev) => ({ ...prev, [status]: new Set(ids) }));
    },
    [],
  );

  const clear = useCallback((status?: OrderStatus) => {
    if (status) {
      setSelected((prev) => ({ ...prev, [status]: new Set() }));
    } else {
      setSelected({
        pending: new Set(),
        waitingPickup: new Set(),
        completed: new Set(),
      });
    }
  }, []);

  const isAllSelected = useCallback(
    (status: OrderStatus, orders: OrderResponse[]) => {
      if (orders.length === 0) return false;
      return orders.every((o) => selected[status].has(o.id));
    },
    [selected],
  );

  return { selected, toggle, selectAll, clear, isAllSelected };
}
