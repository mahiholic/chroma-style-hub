import { motion } from "framer-motion";
import { Package, ArrowLeft, ShoppingBag, Loader2, Eye, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30", label: "Pending" },
  processing: { color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30", label: "Processing" },
  shipped: { color: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: "Shipped" },
  "out for delivery": { color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30", label: "Out for Delivery" },
  delivered: { color: "bg-green-500/10 text-green-600 border-green-500/30", label: "Delivered" },
  cancelled: { color: "bg-red-500/10 text-red-600 border-red-500/30", label: "Cancelled" },
  "return requested": { color: "bg-orange-500/10 text-orange-600 border-orange-500/30", label: "Return Requested" },
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        <h1 className="font-display text-3xl text-foreground mb-6 flex items-center gap-2">
          <Package className="w-7 h-7 text-primary" /> MY ORDERS
        </h1>

        {!user ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground mb-4">Sign in to view your orders</p>
            <Link to="/auth"><Button className="font-display">SIGN IN</Button></Link>
          </div>
        ) : isLoading || authLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground mb-4">No orders yet</p>
            <Link to="/"><Button className="font-display">START SHOPPING</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any, i: number) => {
              const items = order.order_items || [];
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm text-foreground">{order.order_number}</span>
                      <Badge className={`${status.color} border text-xs`}>{status.label}</Badge>
                    </div>
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {/* Order items */}
                  <div className="p-5 space-y-3">
                    {items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-foreground truncate">{item.product_name}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            Qty: {item.quantity}
                            {item.size && ` · ${item.size}`}
                            {item.color && ` · ${item.color}`}
                          </p>
                        </div>
                        <p className="font-display text-sm text-foreground">₹{item.total}</p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="font-body text-xs text-muted-foreground">+{items.length - 3} more items</p>
                    )}
                  </div>

                  {/* Order footer */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                    <div>
                      <span className="font-body text-xs text-muted-foreground">Total: </span>
                      <span className="font-display text-lg text-foreground">₹{order.total}</span>
                    </div>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="font-display text-xs gap-1">
                        <Eye className="w-3.5 h-3.5" /> VIEW DETAILS <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
          <Link to="/">
            <Button className="bg-primary text-primary-foreground font-display gap-2">
              <ShoppingBag className="w-4 h-4" /> CONTINUE SHOPPING
            </Button>
          </Link>
        </motion.div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default OrdersPage;
