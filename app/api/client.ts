export type MenuItem = { id: string; name: string; description?: string };
export type OrderResponse = {
  id: string;
  menu_item_id: string;
  menu_name: string;
  order_number: number;
  status?: string;
};
export type ApiError = { error: string; message: string };

// .envがなければlocalhostを参照するようにしてある
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function fetchMenu(storeId: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/menu`);
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
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/orders`);
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Order fetch failed (${res.status})`);
  }
  const data = (await res.json()) as { orders?: OrderResponse[] };
  const targetOrder = (data.orders ?? []).find((o) => o.id === orderId);
  if (!targetOrder) {
    throw new Error("Order not found");
  }
  return targetOrder;
}
