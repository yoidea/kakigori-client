import { useEffect, useMemo, useState, useCallback } from "react";
import type { OrderResponse, OrderStatus } from "../api/client";
import { ORDER_STATUS_LABEL } from "../constants/orderStatus";
import { DISPLAY_MODE, type DisplayMode } from "../constants/displayMode";
import { fetchOrders } from "../api/client";
import ErrorCard from "./ui/ErrorCard";

type Props = {
  storeId: string;
  pollMs?: number;
  mode: DisplayMode;
};

export const n2k = (num: number | string): string => {
  if (num === undefined || num === null || num === "") return "";
  const numStr = String(num);
  if (!/^-?\d+$/.test(numStr)) return "";
  const value = Number(numStr);
  if (!Number.isInteger(value) || value < 0 || value > 100) return "";
  if (value === 0) return "零";
  if (value === 100) return "百";
  const kanji = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (value < 10) {
    return kanji[value];
  }
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  let result = "";
  if (tens === 1) result += "十";
  else result += kanji[tens] + "十";
  if (ones > 0) result += kanji[ones];
  return result;
};

export default function PublicOrdersBoard({
  storeId,
  pollMs = 2000,
  mode,
}: Props) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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

  const statuses: OrderStatus[] = ["pending", "waitingPickup"]; // completedは非表示

  return (
    <section className="mt-2">
      {loading ? (
        <div className="mt-4 text-center text-gray-500">読み込み中...</div>
      ) : err ? (
        <ErrorCard title="注文状況の取得に失敗しました" message={err} />
      ) : (
        <div className="mt-4 flex flex-row w-full">
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              title={ORDER_STATUS_LABEL[status]}
              orders={grouped[status]}
              mode={mode}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Column({
  title,
  orders,
  status,
  mode,
}: {
  title: string;
  orders: OrderResponse[];
  status: OrderStatus;
  mode: DisplayMode;
}) {
  return (
    <div
      className={
        ` overflow-hidden ` + (status === "pending" ? "basis-1/5" : "basis-4/5")
      }
    >
      <div
        className={
          `text-5xl px-8 py-4 font-semibold flex items-center ` +
          (status === "pending"
            ? "bg-gray-50 dark:bg-zinc-800"
            : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200")
        }
      >
        {title}
      </div>
      <ul
        className={
          `p-3 grid gap-3 ` +
          (status === "pending" ? "grid-cols-1" : "grid-cols-3")
        }
      >
        {orders.length === 0 ? (
          <li className="col-span-full text-center text-gray-500 text-sm py-6">
            なし
          </li>
        ) : (
          orders.map((o) => (
            <li key={o.id}>
              <div
                className={
                  `rounded-2xl border p-6 text-center ` +
                  (status === "pending"
                    ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900"
                    : "border-amber-300 dark:border-amber-600 bg-white dark:bg-zinc-900")
                }
              >
                <div
                  className={
                    `text-5xl font-black tracking-tight ` +
                    (status === "waitingPickup"
                      ? "text-7xl text-amber-700 dark:text-amber-200"
                      : "")
                  }
                >
                  {mode === DISPLAY_MODE.binary
                    ? o.order_number.toString(2)
                    : mode === DISPLAY_MODE.chinese
                      ? n2k(o.order_number)
                      : mode === DISPLAY_MODE.decimal
                        ? o.order_number
                        : o.order_number}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
