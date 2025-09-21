import type { OrderStatus } from "../api/client";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "準備中",
  waitingPickup: "呼出中",
  completed: "受渡完了",
};
