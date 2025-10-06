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
      {loading ? (
        <Placeholder />
      ) : error ? (
        <>
          <ErrorCard title="メニューを取得できません" message={error} />
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 w-full border border-gray-300 py-3 font-semibold"
          >
            再読み込みする
          </button>
        </>
      ) : (
        <div className="mt-6 space-y-4">
          <fieldset className="space-y-3">
            {menu.length === 0 ? (
              <p className="text-center text-gray-500">
                メニューがありません
              </p>
            ) : (
              menu.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 border p-4 transition active:scale-[0.99] ${
                    selectedMenuId === item.id
                      ? "cursor-pointer border-blue-600 ring-2 ring-blue-600/20"
                      : "cursor-pointer border-gray-300"
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
                    <div className="font-semibold">{item.name.split(" ")[0]}<span className="text-worst-accent font-bold">{" "+item.name.split(" ")[1].split("味")[0]}</span>味</div>
                    {item.description && (
                        <div className="text-sm text-worst-primary">
                        {(() => {
                          const flavor = item.name.split(" ")[1]?.split("味")[0] || "";
                          if (!flavor || !item.description) return item.description;
                          if (!item.description.includes(flavor)) return item.description;
                          const parts = item.description.split(flavor);
                          return parts.flatMap((p, i) =>
                          i === parts.length - 1
                            ? [p]
                            : [p, <span key={i} className="text-worst-accent font-bold">{flavor}</span>]
                          );
                        })()}
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
            className="w-full bg-worst-accent py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
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
