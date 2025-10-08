import type { OrderResponse } from "../../api/client";

const STATUS_BADGE: Record<
  OrderResponse["status"],
  { label: string; color: string }
> = {
  pending: {
    label: "準備中",
    color:
      "bg-amber-100 text-amber-800 border border-amber-200 " +
      "dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/40",
  },
  waitingPickup: {
    label: "呼出中",
    color:
      "bg-blue-100 text-blue-800 border border-blue-200 " +
      "dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800/40",
  },
  completed: {
    label: "受渡完了",
    color:
      "bg-emerald-100 text-emerald-800 border border-emerald-200 " +
      "dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800/40",
  },
};

export default function SuccessCard({ order }: { order: OrderResponse }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border p-6 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">注文番号</div>
        <div className="text-5xl font-black tracking-tight mt-2">
          {order.order_number}
        </div>
        <div className="mt-3 font-medium">{order.menu_name}</div>
        <div
          className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[order.status].color}`}
        >
          {STATUS_BADGE[order.status].label}
        </div>
      </div>
    </div>
  );
}
