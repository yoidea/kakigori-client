import { useEffect, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "~/hooks/useLocalStorage";
import { STORAGE_KEY, API_KEY_STORAGE_KEY } from "~/constants/localStorage";

export type StoreConfig = {
  storeId: string;
  apiKey: string;
};

type Props = {
  onSaved: (StoreConfig: StoreConfig) => void;
  storageKey?: string;
  apiKeyStorageKey?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
};

export default function StoreIdForm({
  onSaved,
  storageKey = STORAGE_KEY,
  apiKeyStorageKey = API_KEY_STORAGE_KEY,
  title = "店舗IDとAPIキーを入力",
  description = "ダッシュボードを利用するには店舗IDとAPIキーを設定してください",
  submitLabel = "保存",
}: Props) {
  const [config, setConfig] = useState<StoreConfig>({
    storeId: "",
    apiKey: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const v = getLocalStorageItem(storageKey);
      const k = getLocalStorageItem(apiKeyStorageKey);
      if (v) setConfig((c) => ({ ...c, storeId: v }));
      if (k) setConfig((c) => ({ ...c, apiKey: k }));
    } catch {
      // ignore
    }
  }, [storageKey, apiKeyStorageKey]);

  const save = () => {
    if (!config.storeId.trim() || !config.apiKey.trim()) return;
    setSaving(true);
    try {
      setLocalStorageItem(storageKey, config.storeId.trim());
      setLocalStorageItem(apiKeyStorageKey, config.apiKey.trim());
      onSaved({ storeId: config.storeId.trim(), apiKey: config.apiKey.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-center">{title}</h2>
        <p className="mt-1 text-center text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <label className="w-1/2 flex">
          <span className="text-md my-auto mr-2 font-medium text-gray-700 dark:text-gray-300">
            店舗ID:
          </span>
          <input
            value={config.storeId}
            onChange={(e) =>
              setConfig((c) => ({ ...c, storeId: e.target.value }))
            }
            placeholder="store-001 など"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-zinc-900"
          />
        </label>
        <label className="w-1/2 flex">
          <span className="text-md my-auto mr-2 font-medium text-gray-700 dark:text-gray-300">
            APIキー:
          </span>
          <input
            value={config.apiKey}
            onChange={(e) =>
              setConfig((c) => ({ ...c, apiKey: e.target.value }))
            }
            placeholder="APIキーを入力"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-zinc-900"
          />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving || !config.storeId.trim() || !config.apiKey.trim()}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold disabled:opacity-50"
        >
          {saving ? "保存中..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
