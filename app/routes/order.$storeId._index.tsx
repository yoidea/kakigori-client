import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchMenu, createOrder, type MenuItem } from "../api/client";
import Placeholder from "../components/Placeholder";
import ErrorCard from "../components/ErrorCard";

export default function OrderPage() {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // 店舗IDをパス引数から取得してメニューを取得
  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const items = await fetchMenu(storeId);
        setMenu(items);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  // 送信ボタンクリックで注文の送信
  const handleOrder = async () => {
    if (!storeId || !selected) return;
    setSubmitting(true);
    setErr(null);
    try {
      const data = await createOrder(storeId, selected);
      // 注文IDを受け取ったら完了画面に遷移
      navigate(`/order/${storeId}/receipt/${data.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-sm p-4 min-h-[100dvh] flex flex-col justify-start">
      <h1 className="text-2xl font-bold text-center">かき氷注文システム</h1>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
        味を選んで注文してください
      </p>

      {loading ? (
        <Placeholder />
      ) : err ? (
        <ErrorCard title="通信に失敗しました" message={err} />
      ) : (
        <div className="mt-6 space-y-4">
          <fieldset className="space-y-3">
            {menu.length === 0 ? (
              <p className="text-center text-gray-500">メニューがありません</p>
            ) : (
              menu.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition active:scale-[0.99] ${
                    selected === item.id
                      ? "border-blue-600 ring-2 ring-blue-600/20"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="menu"
                    className="mt-1 h-5 w-5 accent-blue-600"
                    checked={selected === item.id}
                    onChange={() => setSelected(item.id)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </div>
                    )}
                  </div>
                </label>
              ))
            )}
          </fieldset>

          <button
            type="button"
            onClick={handleOrder}
            disabled={!selected || submitting}
            className="w-full rounded-2xl bg-blue-600 text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "送信中..." : "この内容で注文する"}
          </button>
        </div>
      )}
    </main>
  );
}
