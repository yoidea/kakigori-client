import { useEffect, useState } from "react";

type ConnectionNoticeProps = {
  onConfirm: () => void;
  onBack: () => void;
  worstUIEnabled: boolean;
};

export default function ConnectionNotice({
  onConfirm,
  onBack,
  worstUIEnabled,
}: ConnectionNoticeProps) {
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowDialog(false);
    }, 3500);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="mt-6 flex flex-1 flex-col items-center">
      {showDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]" />
          <div className="relative flex flex-col items-center border border-gray-300 bg-white px-8 py-8">
            <p className="text-sm font-semibold text-gray-800">
              インターネット接続確認中...
            </p>
            <div
              className="mt-5 h-12 w-12 rounded-full border-[6px] border-gray-300 border-t-blue-500"
              style={{
                animation: "spin 2.8s steps(9,end) infinite",
                filter: "drop-shadow(0 0 2px rgba(0,0,0,0.15))",
              }}
              aria-label="通信中"
              aria-busy="true"
              role="status"
            />
          </div>
        </div>
      ) : (
      <div className="w-full bg-white p-6 text-center">
        <img src="/dinosaur.png" alt="接続OK" className="mx-auto w-20" />
        <p className="text-lg font-normal text-gray-900">
          インターネットに接続されています
        </p>
        <div className="relative mt-8 flex h-24 w-full items-center justify-center">
          <button
            type="button"
            onClick={onConfirm}
            disabled={showDialog}
            className={
              worstUIEnabled
                ? "absolute bottom-2 left-3 flex h-[12px] w-[32px] items-center justify-center text-[6px] font-semibold uppercase tracking-widest text-gray-700 transition"
                : "flex h-10 min-w-[140px] items-center justify-center border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {worstUIEnabled ? "進む▶" : "確認する"}
            <span className="sr-only">注文確認画面に進む</span>
          </button>
          <button
            type="button"
            className="absolute bottom-2 right-3 items-center justify-center text-[6px] font-semibold uppercase tracking-widest text-gray-700 transition cursor-pointer"
            onClick={onBack}
          >
            {worstUIEnabled ? "◀戻る" : "確認する"}
          </button>
        </div>
        <p
          role="note"
          className="mt-32 mx-auto max-w-sm text-left text-[10px] text-gray-500"
        >
          画像素材について：本ページの恐竜画像は Chromium プロジェクトの Dino ゲーム画像を加工したものです。© The Chromium Authors / BSD-3-Clause ライセンスに基づき利用・改変しています。Google LLC や貢献者の名前を本サイトの宣伝・推奨には使用していません。
        </p>
      </div>
      )}
    </section>
  );
}
