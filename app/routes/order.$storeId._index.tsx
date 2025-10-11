import { useParams, useSearchParams } from "react-router";
import ErrorCard from "../components/ui/ErrorCard";
import OrderPageManager from "../components/order/OrderPageManager";

export default function OrderPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [searchParams] = useSearchParams();
  const clientKey = searchParams.get("key") || "";
  const startDate = new Date(2025, 9, 12, 14, 0, 0);

  if (!storeId) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-start p-4">
        <h1 className="text-center text-2xl font-bold">かき氷注文システム</h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          URL に店舗IDが含まれていません
        </p>
        <ErrorCard
          title="店舗IDが不正です"
          message="/order/<storeId> の形式でアクセスしてください"
        />
      </main>
    );
  }

  if (clientKey.length === 0) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-start p-4">
        <h1 className="text-center text-2xl font-bold">かき氷注文システム</h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          味を選んで注文してください
        </p>
        <ErrorCard
          title="不正なアクセスです"
          message="予期しないアクセスです。QRコードから再度アクセスしてください"
        />
      </main>
    );
  }

  const now = new Date();
  if (now < startDate) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-start p-4">
        <h1 className="text-center text-2xl font-bold">かき氷注文システム</h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          味を選んで注文してください
        </p>
        <ErrorCard
          title="提供開始時間前です"
          message="かき氷の注文は2025年10月12日14:00以降可能になります。何らかの方法でそれ以前に注文をしても無効となります。"
        />
      </main>
    );
  }

  return (
    <OrderPageManager key={storeId} storeId={storeId} clientKey={clientKey} />
  );
}
