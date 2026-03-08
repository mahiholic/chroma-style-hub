import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ orders: 0, customers: 0, revenue: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("id, total, created_at, status, customer_name, order_number"),
        supabase.from("customers").select("id"),
        supabase.from("products").select("id"),
      ]);

      const orders = ordersRes.data || [];
      const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

      setStats({
        orders: orders.length,
        customers: (customersRes.data || []).length,
        revenue,
        products: (productsRes.data || []).length,
      });

      setRecentOrders(orders.slice(0, 5));

      // Build chart data from last 7 days
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });

      const chart = days.map((day) => {
        const dayOrders = orders.filter((o) => o.created_at?.startsWith(day));
        return {
          date: new Date(day).toLocaleDateString("en", { weekday: "short" }),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((s, o) => s + Number(o.total || 0), 0),
        };
      });
      setChartData(chart);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-accent" },
    { title: "Total Customers", value: stats.customers, icon: Users, color: "text-success" },
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { title: "Products", value: stats.products, icon: TrendingUp, color: "text-secondary" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-primary/20 text-primary",
    processing: "bg-accent/20 text-accent",
    shipped: "bg-brand-teal/20 text-brand-teal",
    delivered: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="font-display text-2xl tracking-wide">DASHBOARD OVERVIEW</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.title}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-body">{s.title}</p>
                  <p className="text-2xl font-display">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">SALES ANALYTICS</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">ORDER TRENDS</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">RECENT ORDERS</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground font-body text-sm py-8 text-center">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Order #</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Total</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{o.order_number}</td>
                        <td className="py-3">{o.customer_name}</td>
                        <td className="py-3">₹{Number(o.total).toLocaleString()}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className={statusColor[o.status] || ""}>
                            {o.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
