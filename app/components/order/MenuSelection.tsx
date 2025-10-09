import "animate.css";
import { useState, useId } from "react";
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
  worstUIEnabled: boolean;
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
  const [emphasis, setEmphasis] = useState(false);
  const [fontsize, setFontsize] = useState(1);
  const id = useId();
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
          <fieldset className={`space-y-3 text-${fontsize}xl`}>
            {menu.length === 0 ? (
              <p className="text-center text-gray-500">メニューがありません</p>
            ) : (
              menu.map((item) => {
                const [primaryLabel = item.name, secondaryRaw = ""] =
                  item.name.split(" ");
                const flavor = secondaryRaw.split("味")[0] ?? "";
                const accentLabel = flavor ? ` ${flavor}` : "";

                const highlightedDescription = (() => {
                  if (!item.description || !flavor) return item.description;
                  if (!item.description.includes(flavor))
                    return item.description;
                  const parts = item.description.split(flavor);
                  return parts.flatMap((part, index) =>
                    index === parts.length - 1
                      ? [part]
                      : [
                          part,
                          <span
                            key={`${item.id}-desc-${index}`}
                            className="text-worst-accent font-bold"
                          >
                            {flavor}
                          </span>,
                        ],
                  );
                })();

                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 border p-4 transition active:scale-[0.99] ${
                      selectedMenuId === item.id
                        ? "cursor-pointer border-blue-600 ring-2 ring-blue-600/20"
                        : "cursor-pointer border-gray-300"
                    } ${
                      selectedMenuId === item.id && emphasis
                        ? "animate__animated animate__infinite animate__tada"
                        : ""
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
                      <div className="font-semibold">
                        {primaryLabel}
                        {flavor && (
                          <span className="text-worst-accent font-bold">
                            {accentLabel}
                          </span>
                        )}
                        味
                      </div>
                      {highlightedDescription && (
                        <div className="text-sm text-worst-primary">
                          {highlightedDescription}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </fieldset>

          <button
            type="button"
            onClick={() => {
              setEmphasis(!emphasis);
            }}
            className="w-full bg-worst-accent py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            強調
          </button>
          <button
            type="button"
            onClick={() => {
              setFontsize(fontsize < 5 ? fontsize + 1 : 1);
            }}
            className="w-full bg-worst-accent py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            文字サイズ変更
          </button>

          <section
            aria-labelledby={`terms-heading-${id}`}
            className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700"
          >
            <h2 id={`terms-heading-${id}`} className="mb-2 font-semibold">
              利用規約
            </h2>
            <div className="max-h-80 overflow-y-auto leading-12 pr-1">
              <p className="mb-2">
                本サービスは、かき氷のモバイル注文を簡単に行っていただくためのものです。ご注文の確定後は、
                店舗の運営状況等により提供までに時間を要する場合があります。表示される注文番号は控えとしてご提示ください。
              </p>
              <p className="mb-2">
                当サービスの利用に関連して生じたいかなる損害についても、運営は一切の責任を負いません。
                利用を継続される場合、本規約に同意いただいたものとみなします。
              </p>
            </div>
          </section>

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
