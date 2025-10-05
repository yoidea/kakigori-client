import type { MenuItem } from "../../api/client";
import ErrorCard from "../ui/ErrorCard";
import Placeholder from "../ui/Placeholder";

type MenuSelectionProps = {
  menu: MenuItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedMenuId: string | null;
  onSelect: (menuId: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  orderError: string | null;
};

export default function MenuSelection({
  menu,
  loading,
  error,
  onRetry,
  selectedMenuId,
  onSelect,
  onSubmit,
  submitting,
  orderError,
}: MenuSelectionProps) {
  return (
    <section className="mt-6 flex flex-1 flex-col">
      <p className="text-center text-gray-600 dark:text-gray-300">
        ここまで来たあなたには、通常の注文画面をお届けします
      </p>

      {loading ? (
        <Placeholder />
      ) : error ? (
        <>
          <ErrorCard title="メニューを取得できません" message={error} />
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 w-full rounded-2xl border border-gray-300 py-3 font-semibold dark:border-gray-700"
          >
            再読み込みする
          </button>
        </>
      ) : (
        <div className="mt-6 space-y-4">
          <fieldset className="space-y-3">
            {menu.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                メニューがありません
              </p>
            ) : (
              menu.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition active:scale-[0.99] ${
                    selectedMenuId === item.id
                      ? "cursor-pointer border-blue-600 ring-2 ring-blue-600/20"
                      : "cursor-pointer border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="menu"
                    className="mt-1 h-5 w-5 accent-blue-600"
                    checked={selectedMenuId === item.id}
                    onChange={() => onSelect(item.id)}
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
            onClick={onSubmit}
            disabled={!selectedMenuId || submitting}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "送信中..." : "この内容で注文する"}
          </button>
          {orderError && (
            <ErrorCard title="注文の送信に失敗しました" message={orderError} />
          )}
        </div>
      )}
    </section>
  );
}
