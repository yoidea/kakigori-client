import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PublicOrdersBoard from "../components/PublicOrdersBoard";
import { getStoredStoreId } from "../components/StoreIdForm";

const STORAGE_KEY = "kakigori.storeId";

export default function StorePublicPage() {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const id = getStoredStoreId(STORAGE_KEY);
    if (!id) {
      navigate("/store");
      return;
    }
    setStoreId(id);
  }, [navigate]);

  if (!storeId) return null;

  return (
    <main className="mx-auto max-w-6xl p-4 min-h-[100dvh] flex flex-col">
      <PublicOrdersBoard storeId={storeId} />
      <img
        src="/icon.jpg"
        alt="アイコン"
        className="absolute right-8 bottom-8 w-64 h-64"
      />
    </main>
  );
}
