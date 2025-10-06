import { useParams, useSearchParams } from "react-router";
import ErrorCard from "../components/ui/ErrorCard";
import OrderPageManager from "../components/order/OrderPageManager";

export default function OrderPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [searchParams] = useSearchParams();
  const clientKey = searchParams.get("key") || "";

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

  return <OrderPageManager key={storeId} storeId={storeId} clientKey={clientKey} />;
}
