import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Veg Momo",
    price: 80,
    category: "Momos",
  },
  {
    id: "2",
    name: "Chicken Momo",
    price: 120,
    category: "Momos",
  },
  {
    id: "3",
    name: "Fried Momo",
    price: 140,
    category: "Momos",
  },
  {
    id: "4",
    name: "Paneer Momo",
    price: 150,
    category: "Momos",
  },
];

export const categories = ["All", "Momos", "Beverages", "Snacks"];

export type Order = {
  id: number;
  items: number;
  total: number;
  status: "paid" | "pending";
  createdAt: string; // ISO
  category: "Beverages" | "Snacks" | "Meals" | "Desserts";
  payment_method: "Offline" | "Online" | "Zomoto";
};

export type KPI = {
  revenue: number;
  orders: number;
  avgTicket: number;
  refunds: number;
};

export function generateOrders(): Order[] {
  // generate orders for yesterday + today across hours
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const orders: Order[] = [];
  let id = 1050;
  const cats: Order["category"][] = [
    "Beverages",
    "Snacks",
    "Meals",
    "Desserts",
  ];

  for (let d = 0; d < 2; d++) {
    for (let h = 8; h <= 21; h++) {
      // 2-5 orders per hour
      const count = 2 + ((h * (d + 1)) % 4);
      for (let i = 0; i < count; i++) {
        const dt = new Date(start);
        dt.setDate(start.getDate() + d);
        dt.setHours(h, Math.floor(Math.random() * 60), 0, 0);
        const items = 1 + (i % 4);
        const price = 60 + ((h * (i + 1)) % 120);
        const status: Order["status"] =
          Math.random() < 0.85 ? "paid" : "pending";
        const category = cats[(h + i) % cats.length];
        orders.unshift({
          id: ++id,
          items,
          total: items * price,
          status,
          createdAt: dt.toISOString(),
          category,
        });
      }
    }
  }

  return orders;
}

export function filterOrdersByRange(
  orders: Order[],
  range: "today" | "yesterday" | "last7"
) {
  const now = new Date();
  const from = new Date(now);
  const to = new Date(now);
  if (range === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (range === "yesterday") {
    from.setDate(from.getDate() - 1);
    from.setHours(0, 0, 0, 0);
    to.setDate(to.getDate() - 1);
    to.setHours(23, 59, 59, 999);
  } else {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  }
  return orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });
}

export function filterOrdersByDate(orders: Order[], date: Date) {
  const from = new Date(date);
  from.setHours(0, 0, 0, 0);
  const to = new Date(date);
  to.setHours(23, 59, 59, 999);
  return orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });
}

// export function computeKPIs(orders: Order[]): KPI {
//   const revenue = sum(
//     orders.filter((o) => o.status === "paid").map((o) => o.total)
//   );
//   const ordersCount = orders.length;
//   const avgTicket = ordersCount ? Math.round(revenue / ordersCount) : 0;
//   const refunds = 0; // mock demo; no refunds in dataset
//   return { revenue, orders: ordersCount, avgTicket, refunds };
// }
export function computeKPIs(orders: Order[]): KPI {
  // Total paid revenue
  const revenue = sum(
    orders.filter((o) => o.status === "paid").map((o) => o.total)
  );

  const ordersCount = orders.length;
  const avgTicket = ordersCount ? Math.round(revenue / ordersCount) : 0;

  // ---- Payment Method Revenue Breakdown ----
  let offlineRevenue = 0;
  let onlineRevenue = 0;
  let zomotoRevenue = 0;
  // let mixedRevenue = 0;

  orders.forEach((o) => {
    if (o.status !== "paid") return;

    switch (o.payment_method) {
      case "Offline":
        offlineRevenue += o.total;
        break;

      case "Online":
        onlineRevenue += o.total;
        break;
        
      case "Zomoto":
        zomotoRevenue += o.total;
        break;

      // case "Mixed":
      //   mixedRevenue += o.total;
      //   break;
    }
  });

  return {
    revenue,
    offlineRevenue,
    onlineRevenue,
    zomotoRevenue,
    // mixedRevenue,
    orders: ordersCount,
    avgTicket,
    refunds: 0, // still mock
  };
}

function sum(arr: number[]) {
  return Math.round(arr.reduce((a, b) => a + b, 0));
}
