export type OrderStatus = "pending" | "waitingPickup" | "completed";
export type MenuItem = { id: string; name: string; description?: string };
export type OrderResponse = {
  id: string;
  menu_item_id: string;
  menu_name: string;
  status: OrderStatus;
  order_number: number;
};
export type ApiError = { error: string; message: string };

// .envがなければlocalhostを参照するようにしてある
const API_BASE:string = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";
const X_API_KEY:string = import.meta.env.VITE_API_KEY;

export async function fetchMenu(storeId: string, clientKey: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/menu`, {
    headers: { "X-Client-Key": clientKey },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Menu fetch failed (${res.status})`);
  }
  const data = (await res.json()) as { menu?: MenuItem[] };
  return data.menu ?? [];
}

export async function createOrder(
  storeId: string,
  menuId: string,
  clientKey: string
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Client-Key": clientKey },
    body: JSON.stringify({ menu_item_id: menuId }),
  });
  if (res.status !== 201) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Order create failed (${res.status})`);
  }
  return res.json();
}

export async function fetchOrderById(
  storeId: string,
  orderId: string,
  clientKey: string
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/orders/${orderId}`, {
    headers: { "X-Client-Key": clientKey },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Order fetch failed (${res.status})`);
  }
  return res.json();
}

// 管理画面・公開画面向け：注文一覧の取得（ステータスでの絞り込み可）
export async function fetchOrders(
  storeId: string,
  status?: OrderStatus,
): Promise<OrderResponse[]> {
  const url = new URL(`${API_BASE}/v1/stores/${storeId}/orders`);
  if (status) url.searchParams.set("status", status);
  const res = await fetch(url, {
    headers: { "X-API-Key": X_API_KEY },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Orders fetch failed (${res.status})`);
  }
  const data = (await res.json()) as { orders?: OrderResponse[] };
  return data.orders ?? [];
}

// 管理画面：pending -> waitingPickup
export async function updateOrderToWaitingPickup(
  storeId: string,
  orderId: string,
): Promise<OrderResponse> {
  const res = await fetch(
    `${API_BASE}/v1/stores/${storeId}/orders/${orderId}/waiting-pickup`,
    { method: "POST", headers: { "X-API-Key": X_API_KEY } },
  );
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(
      data?.message || `Update to waitingPickup failed (${res.status})`,
    );
  }
  return res.json();
}

// 管理画面：waitingPickup -> completed
export async function completeOrder(
  storeId: string,
  orderId: string,
): Promise<OrderResponse> {
  const res = await fetch(
    `${API_BASE}/v1/stores/${storeId}/orders/${orderId}/complete`,
    { method: "POST", headers: { "X-API-Key": X_API_KEY } },
  );
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Complete order failed (${res.status})`);
  }
  return res.json();
}
