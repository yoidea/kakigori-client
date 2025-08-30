export default function MissingPage() {
  return (
    <main className="mx-auto max-w-sm p-4 min-h-[100dvh] flex flex-col justify-start">
      <h1 className="text-2xl font-bold text-center">かき氷注文システム</h1>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
        味を選んで注文してください
      </p>
      <ErrorCard
        title="店舗IDが不正です"
        message="URL は /order/<storeId> の形式"
      />
    </main>
  );
}

function ErrorCard({ title, message }: { title: string; message?: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
      <div className="font-semibold">{title}</div>
      {message && <div className="text-sm mt-1">{message}</div>}
    </div>
  );
}
