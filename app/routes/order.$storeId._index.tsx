import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchMenu, createOrder, type MenuItem } from "../api/client";
import Placeholder from "../components/Placeholder";
import ErrorCard from "../components/ErrorCard";
import MenuNumberToast from "../components/MenuNumberToast";
import { useRef } from "react";


export default function OrderPage() {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [flashNumber, setFlashNumber] = useState<number | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tapScale, setTapScale] = useState<Record<string, number>>({});

  // 店舗IDをパス引数から取得してメニューを取得
  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const items = await fetchMenu(storeId);
        setMenu(items);
        if (items[0]) {
          setSelected(items[0].id);
          setSelectedNumber(1);
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  // 送信ボタンクリックで注文の送信
  const handleOrder = async () => {
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

  // 一瞬表示用トースト（番号）
  const showNumberOnce = (n: number) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlashNumber(n);
    flashTimer.current = window.setTimeout(() => setFlashNumber(null), 1000);
  };

  // 選択肢クリックでサイズ拡大
  function bumpLabel(id: string) {
    setTapScale((prev) => {
      const current = prev[id] ?? 1;
      const next = Math.min(current + 0.06, 10);
      return { ...prev, [id]: next };
    });
  }

  // カードをタップしたとき：拡大＋選択同期＋番号トースト
  const onCardTap = (index: number) => {
    const item = menu[index];
    if (!item) return;
    setTapScale((prev) => {
      const cur = prev[item.id] ?? 1;
      const next = Math.min(cur + 0.06, 1.5);
      return { ...prev, [item.id]: next };
    });
  };

  // スライダー操作：番号→選択同期＋番号トースト
  const onSliderChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const n = Math.max(1, Math.min(menu.length, Number(e.target.value)));
    setSelectedNumber(n);
    const item = menu[n - 1];
    if (item) setSelected(item.id);
    showNumberOnce(n);
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
              menu.map((item, i) => (
                <label
                  key={item.id}
                  onClick={() => onCardTap(i)}
                  style={{ transform: `scale(${tapScale[item.id] ?? 1})` }}
                  className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer
                              transition-transform duration-200 will-change-transform
                              ${
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
                    onChange={() => {
                      showNumberOnce(i + 1);
                    }}
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
            onClick={() => setSelected("")}
            disabled={!selected || submitting}
            className="w-full rounded-2xl bg-blue-600 text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            選択を解除
          </button>
      
      {flashNumber && <MenuNumberToast number={flashNumber} />}

      
      {menu.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/90 dark:bg-zinc-900/80 backdrop-blur border-t">
          <div className="mx-auto max-w-sm px-4 py-3">
            <label className="flex items-center gap-3">
              <div className="text-sm font-medium w-16 text-center">
                No.{selectedNumber}
              </div>
              <input
                type="range"
                min={1}
                max={menu.length}
                step={1}
                value={selectedNumber}
                onChange={onSliderChange}
                className="w-full accent-blue-600"
                aria-label="メニュー番号"
              />
            </label>
          </div>
        </div>
      )} 
        </div>
      )}
    </main>
  );
}
