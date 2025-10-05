type ConnectionNoticeProps = {
  onConfirm: () => void;
};

export default function ConnectionNotice({ onConfirm }: ConnectionNoticeProps) {
  return (
    <section className="mt-6 flex flex-1 flex-col items-center">
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          インターネットに接続されています
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          なぜかこの画面で確認ボタンを押さないと先に進めません。
        </p>
        <div className="relative mt-8 flex h-24 w-full items-center justify-center">
          <button
            type="button"
            onClick={onConfirm}
            className="absolute bottom-2 right-3 flex h-[16px] w-[48px] items-center justify-center rounded-[2px] border border-gray-400 bg-white text-[10px] font-semibold uppercase tracking-widest text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-200"
          >
            確認
            <span className="sr-only">注文確認画面に進む</span>
          </button>
        </div>
      </div>
    </section>
  );
}
