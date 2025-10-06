import { useEffect, useMemo, useState, useCallback } from "react";
import type { OrderResponse, OrderStatus } from "../../api/client";
import { ORDER_STATUS_LABEL } from "../../constants/orderStatus";
import {
  completeOrder,
  fetchOrders,
  updateOrderToWaitingPickup,
} from "../../api/client";
import {
  useOrderDragAndDrop,
  defaultAllow,
} from "../../hooks/useOrderDragAndDrop";
import { useOrderSelection } from "../../hooks/useOrderSelection";
import { AdminOrdersColumn } from "./AdminOrdersColumn";
import ErrorCard from "../ui/ErrorCard";

type Props = {
  storeId: string;
  pollMs?: number;
};

export default function AdminOrdersBoard({ storeId, pollMs = 4000 }: Props) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const { selected, toggle, selectAll, clear, isAllSelected } =
    useOrderSelection();

  const { bindCard, bindColumn, highlight, ghostPos, dragging } =
    useOrderDragAndDrop({
      allow: defaultAllow,
      onDropTransition: async (orderId, from, to) => {
        try {
          if (from === to) return;
          if (to === "waitingPickup" && from === "pending") {
            await updateOrderToWaitingPickup(storeId, orderId);
          } else if (to === "completed" && from === "waitingPickup") {
            await completeOrder(storeId, orderId);
          }
          await load();
        } catch (e) {
          setErr(e instanceof Error ? e.message : String(e));
        }
      },
    });

  const load = useCallback(async () => {
    try {
      setErr(null);
      const list = await fetchOrders(storeId);
      setOrders(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => {
      void load();
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs, load]);

  const grouped = useMemo(() => {
    const map: Record<OrderStatus, OrderResponse[]> = {
      pending: [],
      waitingPickup: [],
      completed: [],
    };
    for (const o of orders) map[o.status].push(o);
    (Object.keys(map) as OrderStatus[]).forEach((k) => {
      map[k].sort((a, b) => a.order_number - b.order_number);
    });
    return map;
  }, [orders]);

  const handleToggleAll = useCallback(
    (status: OrderStatus, orders: OrderResponse[]) => {
      if (isAllSelected(status, orders)) clear(status);
      else selectAll(status, orders);
    },
    [isAllSelected, clear, selectAll],
  );

  const bulkToWaiting = async () => {
    const ids = Array.from(selected.pending);
    if (ids.length === 0) return;
    try {
      await Promise.all(
        ids.map((id) => updateOrderToWaitingPickup(storeId, id)),
      );
      clear("pending");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  const bulkComplete = async () => {
    const ids = Array.from(selected.waitingPickup);
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => completeOrder(storeId, id)));
      clear("waitingPickup");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">注文管理</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={bulkToWaiting}
            disabled={selected.pending.size === 0}
            className="rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
          >
            呼出にする ({selected.pending.size})
          </button>
          <button
            type="button"
            onClick={bulkComplete}
            disabled={selected.waitingPickup.size === 0}
            className="rounded-2xl bg-emerald-600 text-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
          >
            受渡完了 ({selected.waitingPickup.size})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-center text-gray-500">読み込み中...</div>
      ) : err ? (
        <ErrorCard title="注文一覧の取得に失敗しました" message={err} />
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["pending", "waitingPickup", "completed"] as OrderStatus[]).map(
            (status) => {
              const ordersForStatus = grouped[status];
              return (
                <AdminOrdersColumn
                  key={status}
                  status={status}
                  title={ORDER_STATUS_LABEL[status]}
                  orders={ordersForStatus}
                  selected={selected[status]}
                  onToggle={toggle}
                  onToggleAll={handleToggleAll}
                  bindColumn={bindColumn}
                  bindCard={bindCard}
                  highlight={highlight}
                  showBulkToggle={status !== "completed"}
                  isAllSelected={isAllSelected(status, ordersForStatus)}
                />
              );
            },
          )}
        </div>
      )}
      {dragging && ghostPos && dragging.rect && (
        <div
          className="pointer-events-none fixed z-50 opacity-70"
          style={{
            left: ghostPos.x - (dragging.pointerOffset?.x || 0),
            top: ghostPos.y - (dragging.pointerOffset?.y || 0),
            width: dragging.rect.width,
            height: dragging.rect.height,
            transition: "transform 40ms linear",
          }}
        >
          <div className="order-card-shell rounded-2xl border border-blue-400/60 bg-white dark:bg-zinc-800 shadow-lg grid place-items-center h-full animate-pulse">
            <GhostOrderNumber orders={orders} draggingId={dragging.id} />
          </div>
        </div>
      )}
    </section>
  );
}

function GhostOrderNumber({
  orders,
  draggingId,
}: {
  orders: OrderResponse[];
  draggingId: string;
}) {
  const order = orders.find((o) => o.id === draggingId);
  if (!order)
    return (
      <span className="text-3xl font-black tracking-tight text-blue-600">
        ...
      </span>
    );
  return (
    <span className="text-4xl font-black tracking-tight text-blue-600">
      {order.order_number}
    </span>
  );
}
