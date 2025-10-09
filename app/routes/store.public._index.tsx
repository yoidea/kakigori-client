import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PublicOrdersBoard from "../components/PublicOrdersBoard";
import { getLocalStorageItem } from "../hooks/useLocalStorage";
import { API_KEY_STORAGE_KEY, STORAGE_KEY } from "../constants/localStorage";
import { DISPLAY_MODE, type DisplayMode } from "../constants/displayMode";

export default function StorePublicPage() {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [mode, setMode] = useState<DisplayMode>(DISPLAY_MODE.decimal);

  useEffect(() => {
    const id = getLocalStorageItem(STORAGE_KEY);
    const apiKey = getLocalStorageItem(API_KEY_STORAGE_KEY);
    if (!id || !apiKey) {
      navigate("/store");
      return;
    }
    setStoreId(id);
    setApiKey(apiKey);
  }, [navigate]);

  useEffect(() => {
    const modes = [
      DISPLAY_MODE.decimal,
      DISPLAY_MODE.binary,
      DISPLAY_MODE.chinese,
    ] as const;
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % modes.length;
      setMode(modes[index]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!storeId || !apiKey) return null;

  return (
    <main
      className={`mx-auto max-w-6xl p-4 min-h-[100dvh] flex flex-col relative transition-all duration-700 ${
        mode === DISPLAY_MODE.binary
          ? "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 animate-gradient-move"
          : mode === DISPLAY_MODE.chinese
            ? "bg-red-600"
            : "bg-white dark:bg-zinc-900"
      }`}
    >
      <PublicOrdersBoard storeId={storeId} mode={mode} apiKey={apiKey} />
      <img
        src="/icon.jpg"
        alt="アイコン"
        className="absolute right-8 bottom-8 w-64 h-64"
      />
    </main>
  );
}
