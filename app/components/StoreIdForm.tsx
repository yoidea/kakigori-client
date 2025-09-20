import { useEffect, useState } from "react";

type Props = {
  onSaved?: (storeId: string) => void;
  storageKey?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
};

const DEFAULT_KEY = "kakigori.storeId";

export default function StoreIdForm({
  onSaved,
  storageKey = DEFAULT_KEY,
  title = "店舗IDを入力",
  description = "ダッシュボードを利用するには店舗IDを設定してください",
  submitLabel = "保存",
}: Props) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey);
      if (v) setValue(v);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const save = () => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      localStorage.setItem(storageKey, value.trim());
      onSaved?.(value.trim());
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

      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="store-001 など"
          className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving || !value.trim()}
          className="rounded-2xl bg-blue-600 text-white px-4 py-2 font-semibold disabled:opacity-50"
        >
          {saving ? "保存中..." : submitLabel}
        </button>
      </div>
    </div>
  );
}

export function getStoredStoreId(storageKey: string = DEFAULT_KEY): string | null {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function clearStoredStoreId(storageKey: string = DEFAULT_KEY) {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
}
