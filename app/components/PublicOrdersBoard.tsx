import { useEffect, useMemo, useState } from "react";
import type { OrderResponse, OrderStatus } from "../api/client";
import { fetchOrders } from "../api/client";
import ErrorCard from "./ErrorCard";

type Props = {
  storeId: string;
  pollMs?: number;
};

export default function PublicOrdersBoard({ storeId, pollMs = 10000000 }: Props) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const list = await fetchOrders(storeId);
      setOrders(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    const id = setInterval(() => {
      load();
    }, pollMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, pollMs]);

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

  const statuses: OrderStatus[] = ["pending", "waitingPickup"]; // completedは非表示

  return (
    <section className="mt-2">
      {loading ? (
        <div className="mt-4 text-center text-gray-500">読み込み中...</div>
      ) : err ? (
        <ErrorCard title="注文状況の取得に失敗しました" message={err} />
      ) : (
        <div className="mt-4 flex flex-row gap-4 w-full">
          {statuses.map((status) => (
            <Column key={status} status={status} title={statusLabel(status)} orders={grouped[status]} />
          ))}
        </div>
      )}
    </section>
  );
}

function statusLabel(s: OrderStatus) {
  switch (s) {
    case "pending":
      return "準備中";
    case "waitingPickup":
      return "呼出中";
    case "completed":
      return "受渡完了";
  }
}

function Column({
  title,
  orders,
  status,
}: {
  title: string;
  orders: OrderResponse[];
  status: OrderStatus;
}) {
  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-zinc-900 ` + (status === "pending" ? "basis-1/3" : "basis-2/3")}>
      <div className="px-4 py-2 font-semibold bg-gray-50 dark:bg-zinc-800">{title}</div>
      <ul className={`p-3 grid gap-3 ` + (status === "pending" ? "grid-cols-1" : "grid-cols-2")}>
        {orders.length === 0 ? (
          <li className="col-span-full text-center text-gray-500 text-sm py-6">なし</li>
        ) : (
          orders.map((o) => (
            <li key={o.id}>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
                <div className="text-4xl font-black tracking-tight">{o.order_number}</div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
