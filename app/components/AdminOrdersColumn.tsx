import type { OrderResponse, OrderStatus } from "../api/client";

export type ColumnProps = {
  title: string;
  orders: OrderResponse[];
  status: OrderStatus;
  selected: Set<string>;
  onToggle: (status: OrderStatus, id: string) => void;
  onToggleAll: (status: OrderStatus, orders: OrderResponse[]) => void;
  bindColumn: (status: OrderStatus) => any;
  bindCard: (orderId: string, from: OrderStatus) => any;
  highlight: OrderStatus | null;
  showBulkToggle: boolean;
  isAllSelected: boolean;
};

export function AdminOrdersColumn({
  title,
  orders,
  status,
  selected,
  onToggle,
  onToggleAll,
  bindColumn,
  bindCard,
  highlight,
  showBulkToggle,
  isAllSelected,
}: ColumnProps) {
  const columnBind = bindColumn(status);
  return (
    <div
      {...columnBind}
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-zinc-900 transition ${
        columnBind.className || ""
      } ${highlight && highlight === status ? "scale-[1.01]" : ""}`}
    >
      <div className="px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-zinc-800">
        <div className="font-semibold">{title}</div>
        {showBulkToggle && orders.length > 0 && (
          <div className="flex items-center text-xs">
            <button
              className="rounded-xl border border-gray-300 dark:border-gray-600 px-2 py-0.5"
              onClick={() => onToggleAll(status, orders)}
            >
              {isAllSelected ? "解除" : "全選択"}
            </button>
          </div>
        )}
      </div>
      <ul className="p-3 flex flex-col gap-3">
        {orders.length === 0 ? (
          <li className="col-span-2 text-center text-gray-500 text-sm py-6">なし</li>
        ) : (
          orders.map((o) => (
            <li key={o.id} className="relative" {...bindCard(o.id, status)}>
              {status !== "completed" && (
                <label className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 px-2 py-1">
                  <input
                    type="checkbox"
                    className="accent-blue-600 h-6 w-6 cursor-pointer"
                    checked={selected.has(o.id)}
                    onChange={() => onToggle(status, o.id)}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                </label>
              )}
              <div className="order-card-shell rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm active:scale-[0.98] select-none touch-none">
                <div className="text-4xl font-black tracking-tight">{o.order_number}</div>
                <div className="mt-2 text-sm text-gray-700 truncate">{o.menu_name}</div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
