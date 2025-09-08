import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchOrderById, type OrderResponse } from "../api/client";
import ErrorCard from "../components/ErrorCard";
import SuccessCard from "../components/SuccessCard";

export default function ReceiptPage() {
  const { storeId, orderId } = useParams<{
    storeId: string;
    orderId: string;
  }>();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId || !orderId) {
      setErr("URLが不正です");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const data = await fetchOrderById(storeId, orderId);
        setOrder(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId, orderId]);

  if (err) {
    return (
      <main className="mx-auto max-w-sm p-4">
        <ErrorCard title="注文を取得できませんでした" message={err} />
        <a
          href={`/order/${storeId}`}
          className="mt-4 block text-center w-full rounded-2xl border border-gray-300 dark:border-gray-700 py-3 font-semibold"
        >
          注文画面に戻る
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="text-2xl font-bold text-center">注文完了</h1>
      {loading ? (
        <div className="mt-6 flex items-center justify-center py-10">
          <span
            aria-hidden="true"
            className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"
          />
          <output className="sr-only">読み込み中</output>
        </div>
      ) : (
        <>
          {order && <SuccessCard order={order} />}
          <a
            href={`/order/${storeId}`}
            className="mt-4 block text-center w-full rounded-2xl border border-gray-300 dark:border-gray-700 py-3 font-semibold"
          >
            もう一度注文する
          </a>
        </>
      )}
    </main>
  );
}
