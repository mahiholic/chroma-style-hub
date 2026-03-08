import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 10;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchOrders = async () => {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (search) q = q.or(`customer_name.ilike.%${search}%,order_number.ilike.%${search}%,customer_email.ilike.%${search}%`);
    const { data } = await q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setOrders(data || []);
  };

  useEffect(() => { fetchOrders(); }, [search, statusFilter, page]);

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    toast({ title: "Status updated" });
    fetchOrders();
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status });
  };

  const viewOrder = async (order: any) => {
    setSelectedOrder(order);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id);
    setOrderItems(data || []);
  };

  const exportCSV = () => {
    const headers = ["Order#,Customer,Email,Phone,Address,Status,Payment,Total,Date"];
    const rows = orders.map((o) =>
      `${o.order_number},${o.customer_name},${o.customer_email},${o.phone || ""},${o.shipping_address || ""},${o.status},${o.payment_status},${o.total},${new Date(o.created_at).toLocaleDateString()}`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  const statusColor: Record<string, string> = {
    pending: "bg-primary/20 text-primary",
    processing: "bg-accent/20 text-accent",
    shipped: "bg-brand-teal/20 text-brand-teal",
    delivered: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="font-display text-2xl tracking-wide">ORDERS</h2>
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2 font-body">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-10 font-body" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-[180px] font-body">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b text-left text-muted-foreground bg-muted/50">
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3 hidden md:table-cell">Email</th>
                    <th className="p-3 hidden lg:table-cell">Phone</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 hidden md:table-cell">Payment</th>
                    <th className="p-3 hidden lg:table-cell">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No orders found</td></tr>
                  ) : orders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium">{o.order_number}</td>
                      <td className="p-3">{o.customer_name}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{o.customer_email}</td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground">{o.phone || "—"}</td>
                      <td className="p-3">₹{Number(o.total).toLocaleString()}</td>
                      <td className="p-3">
                        <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                          <SelectTrigger className="h-7 text-xs w-[110px]">
                            <Badge variant="secondary" className={`${statusColor[o.status]} text-xs`}>{o.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs capitalize">{o.payment_status}</Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" onClick={() => viewOrder(o)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-body text-muted-foreground">Page {page + 1}</span>
          <Button variant="outline" size="sm" disabled={orders.length < PAGE_SIZE} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">ORDER {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4 font-body text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedOrder.customer_name}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p>{selectedOrder.customer_email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p>{selectedOrder.phone || "—"}</p></div>
                  <div><p className="text-muted-foreground">Payment</p><p className="capitalize">{selectedOrder.payment_method} • {selectedOrder.payment_status}</p></div>
                </div>
                <div>
                  <p className="text-muted-foreground">Shipping Address</p>
                  <p>{selectedOrder.shipping_address || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Items</p>
                  {orderItems.length === 0 ? <p className="text-muted-foreground">No items</p> : (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-muted/50 text-left"><th className="p-2">Product</th><th className="p-2">Qty</th><th className="p-2">Price</th><th className="p-2">Total</th></tr></thead>
                        <tbody>
                          {orderItems.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="p-2">{item.product_name}</td>
                              <td className="p-2">{item.quantity}</td>
                              <td className="p-2">₹{Number(item.price).toLocaleString()}</td>
                              <td className="p-2">₹{Number(item.total).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="text-xl font-display">₹{Number(selectedOrder.total).toLocaleString()}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
