import { useEffect, useState } from "react";
import AdminOrdersBoard from "../components/AdminOrdersBoard";
import StoreIdForm, {
  getStoredStoreId,
  clearStoredStoreId,
} from "../components/StoreIdForm";

const STORAGE_KEY = "kakigori.storeId";

export default function StorePage() {
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    setStoreId(getStoredStoreId(STORAGE_KEY));
  }, []);

  const logout = () => {
    clearStoredStoreId(STORAGE_KEY);
    setStoreId(null);
  };

  return (
    <main className="mx-auto max-w-4xl p-4 min-h-[100dvh] flex flex-col">
      <h1 className="text-2xl font-bold text-center">店舗ダッシュボード</h1>
      {!storeId ? (
        <StoreIdForm
          storageKey={STORAGE_KEY}
          onSaved={(id) => setStoreId(id)}
          title="店舗IDを設定"
          description="店舗IDを保存すると注文管理ダッシュボードを利用できます"
          submitLabel="保存してダッシュボードへ"
        />
      ) : (
        <>
          <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
            店舗ID: <span className="font-mono">{storeId}</span>
          </div>
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              className="rounded-2xl border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm"
              onClick={logout}
            >
              変更する
            </button>
          </div>
          <AdminOrdersBoard storeId={storeId} />
        </>
      )}
    </main>
  );
}
