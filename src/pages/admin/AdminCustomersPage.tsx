import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  const fetchCustomers = async () => {
    let q = supabase.from("customers").select("*").order("created_at", { ascending: false });
    if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    const { data } = await q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setCustomers(data || []);
  };

  useEffect(() => { fetchCustomers(); }, [search, page]);

  const viewCustomer = async (c: any) => {
    setSelected(c);
    const { data } = await supabase.from("orders").select("*").eq("customer_id", c.id).order("created_at", { ascending: false });
    setCustomerOrders(data || []);
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
        <h2 className="font-display text-2xl tracking-wide">CUSTOMERS</h2>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-10 font-body" />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b text-left text-muted-foreground bg-muted/50">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3 hidden md:table-cell">Phone</th>
                    <th className="p-3 hidden lg:table-cell">Address</th>
                    <th className="p-3">Orders</th>
                    <th className="p-3 hidden md:table-cell">Total Spent</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No customers found</td></tr>
                  ) : customers.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3 text-muted-foreground">{c.email}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{c.phone || "—"}</td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs max-w-[200px] truncate">
                        {[c.address, c.city, c.state, c.zip].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="p-3">{c.total_orders}</td>
                      <td className="p-3 hidden md:table-cell">₹{Number(c.total_spent).toLocaleString()}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" onClick={() => viewCustomer(c)}>
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
          <Button variant="outline" size="sm" disabled={customers.length < PAGE_SIZE} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{selected?.name}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4 font-body text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-muted-foreground">Email</p><p>{selected.email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p>{selected.phone || "—"}</p></div>
                  <div><p className="text-muted-foreground">Total Orders</p><p className="font-medium">{selected.total_orders}</p></div>
                  <div><p className="text-muted-foreground">Total Spent</p><p className="font-medium">₹{Number(selected.total_spent).toLocaleString()}</p></div>
                </div>
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p>{[selected.address, selected.city, selected.state, selected.zip].filter(Boolean).join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Order History</p>
                  {customerOrders.length === 0 ? (
                    <p className="text-muted-foreground">No orders</p>
                  ) : (
                    <div className="space-y-2">
                      {customerOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{o.order_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{Number(o.total).toLocaleString()}</p>
                            <Badge variant="secondary" className={`${statusColor[o.status]} text-xs`}>{o.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
