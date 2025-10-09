import { useEffect, useState } from "react";
import AdminOrdersBoard from "../components/admin/AdminOrdersBoard";
import StoreIdForm, { type StoreConfig } from "../components/StoreIdForm";
import {
  getLocalStorageItem,
  clearLocalStorageItem,
} from "../hooks/useLocalStorage";
import { API_KEY_STORAGE_KEY, STORAGE_KEY } from "../constants/localStorage";

export default function StorePage() {
  const [config, setConfig] = useState<StoreConfig | null>(null);

  useEffect(() => {
    setConfig({
      storeId: getLocalStorageItem(STORAGE_KEY) || "",
      apiKey: getLocalStorageItem(API_KEY_STORAGE_KEY) || "",
    });
  }, []);

  const logout = () => {
    clearLocalStorageItem(STORAGE_KEY);
    setConfig(null);
  };

  return (
    <main className="mx-auto max-w-6xl p-4 min-h-[100dvh] flex flex-col">
      <h1 className="text-2xl font-bold text-center">店舗ダッシュボード</h1>
      {!config?.storeId || !config?.apiKey ? (
        <StoreIdForm
          storageKey={STORAGE_KEY}
          apiKeyStorageKey={API_KEY_STORAGE_KEY}
          onSaved={setConfig}
          title="店舗IDとAPIキーを設定"
          description="店舗IDとAPIキーを保存すると注文管理ダッシュボードを利用できます"
          submitLabel="保存してダッシュボードへ"
        />
      ) : (
        <>
          <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
            店舗ID: <span className="font-mono">{config.storeId}</span>
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
          <AdminOrdersBoard storeId={config.storeId} apiKey={config.apiKey} />
        </>
      )}
    </main>
  );
}
