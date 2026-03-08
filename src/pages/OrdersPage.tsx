import { motion } from "framer-motion";
import { Package, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";

const statusColor: Record<string, string> = {
  delivered: "bg-green-500/10 text-green-600",
  shipped: "bg-blue-500/10 text-blue-600",
  processing: "bg-yellow-500/10 text-yellow-700",
  pending: "bg-orange-500/10 text-orange-600",
  cancelled: "bg-red-500/10 text-red-600",
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const result = await Promise.race([
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .then(res => res),
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("Timeout") }), 8000)
        ),
      ]);
      if (result.error) throw result.error;
      return result.data || [];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        <h1 className="font-display text-3xl text-foreground mb-6 flex items-center gap-2"><Package className="w-7 h-7 text-primary" /> MY ORDERS</h1>

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
            <p className="font-body text-muted-foreground mb-4">No orders yet</p>
            <Link to="/"><Button className="font-display">START SHOPPING</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any, i: number) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-foreground">{order.order_number}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-body font-semibold capitalize ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-foreground">₹{order.total}</p>
                  <p className="font-body text-xs text-muted-foreground capitalize">{order.payment_method}</p>
                </div>
              </motion.div>
            ))}
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
