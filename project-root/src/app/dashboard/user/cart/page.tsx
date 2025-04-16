//src/app/dashboard/user/cart/page.tsx
import { getCartItems } from "@/lib/user-dashboard-actions";
import CartClient from "./CartClient";

export default async function CartPage() {
  const items = await getCartItems();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛒 我的购物车</h1>
      <CartClient items={items} />
    </div>
  );
}
