import { motion } from "framer-motion";
import { Package, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";

const sampleOrders = [
  { id: "DK20260001", date: "Mar 5, 2026", status: "Delivered", total: 1598, items: 2 },
  { id: "DK20260002", date: "Mar 3, 2026", status: "Shipped", total: 2499, items: 1 },
  { id: "DK20260003", date: "Feb 28, 2026", status: "Processing", total: 899, items: 1 },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-green-500/10 text-green-600",
  Shipped: "bg-blue-500/10 text-blue-600",
  Processing: "bg-yellow-500/10 text-yellow-700",
};

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        <h1 className="font-display text-3xl text-foreground mb-6 flex items-center gap-2"><Package className="w-7 h-7 text-primary" /> MY ORDERS</h1>

        <div className="space-y-4">
          {sampleOrders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
              <div>
                <p className="font-display text-foreground">{order.id}</p>
                <p className="font-body text-xs text-muted-foreground">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="font-display text-lg text-foreground">₹{order.total}</p>
                <Button variant="outline" size="sm" className="mt-2 font-body text-xs">View Details</Button>
              </div>
            </motion.div>
          ))}
        </div>

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
