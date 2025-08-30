import type { OrderResponse } from "../api/client";

export default function SuccessCard({ order }: { order: OrderResponse }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border p-6 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">注文番号</div>
        <div className="text-5xl font-black tracking-tight mt-2">
          {order.order_number}
        </div>
        <div className="mt-3 font-medium">{order.menu_name}</div>
      </div>
    </div>
  );
}
