import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Tag, X, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import { useToast } from "@/hooks/use-toast";
import { availableCoupons, type Coupon } from "@/data/products";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pincode: "", state: "" });
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  const shipping = totalPrice > 999 ? 0 : 99;

  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") return Math.round(totalPrice * appliedCoupon.value / 100);
    if (appliedCoupon.type === "flat") return appliedCoupon.value;
    if (appliedCoupon.type === "buy2get1") {
      const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
      if (totalQty < 3) return 0;
      // Cheapest item(s) free for every 3 items
      const unitPrices: number[] = [];
      items.forEach((item) => { for (let i = 0; i < item.quantity; i++) unitPrices.push(item.price); });
      unitPrices.sort((a, b) => a - b);
      const freeCount = Math.floor(unitPrices.length / 3);
      return unitPrices.slice(0, freeCount).reduce((s, p) => s + p, 0);
    }
    return 0;
  };

  const couponDiscount = calculateCouponDiscount();
  const total = totalPrice + shipping - couponDiscount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    const coupon = availableCoupons.find((c) => c.code === code);
    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }
    if (coupon.type === "buy2get1") {
      const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
      if (totalQty < 3) {
        setCouponError("Add at least 3 items to use Buy 2 Get 1 Free");
        return;
      }
    } else if (totalPrice < coupon.minOrder) {
      setCouponError(`Minimum order ₹${coupon.minOrder} required`);
      return;
    }
    setAppliedCoupon(coupon);
    toast({ title: "Coupon Applied! 🎉", description: coupon.description });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      toast({ title: "Missing fields", description: "Please fill in all address fields", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to place an order", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setPlacing(true);
    try {
      const orderNumber = `DK${Date.now().toString(36).toUpperCase()}`;
      const shippingAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: form.name,
          customer_email: form.email,
          phone: form.phone,
          shipping_address: shippingAddress,
          subtotal: totalPrice,
          discount: couponDiscount,
          total,
          payment_method: paymentMethod,
          status: "pending",
          payment_status: paymentMethod === "cod" ? "pending" : "paid",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        product_id: null as string | null,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        image_url: item.image || null,
        size: item.size || null,
        color: item.color || null,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Send WhatsApp notification in background (non-blocking)
      void supabase.functions
        .invoke("send-whatsapp-order", {
          body: {
            orderNumber,
            customerName: form.name,
            phone: form.phone,
            email: form.email,
            address: shippingAddress,
            items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
            total,
            paymentMethod: paymentMethod.toUpperCase(),
            orderDate: new Date().toLocaleString("en-IN"),
          },
        })
        .then(({ data, error }) => {
          if (error) {
            console.error("WhatsApp notification failed:", error.message);
            return;
          }
          if (data && typeof data === "object" && "success" in data && !data.success) {
            console.warn("WhatsApp notification warning:", (data as { error?: string }).error || "Unknown warning");
          }
        })
        .catch((err) => console.error("WhatsApp notification failed:", err));

      clearCart();
      toast({ title: "Order Placed! 🎉", description: `Order ${orderNumber} has been placed successfully. Your order has been confirmed!` });
      navigate("/orders");
    } catch (err: any) {
      console.error("Order error:", err);
      toast({ title: "Order failed", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">YOUR BAG IS EMPTY</h1>
          <p className="font-body text-muted-foreground mb-6">Add items to your bag before checkout.</p>
          <Link to="/">
            <Button className="bg-primary text-primary-foreground font-display">CONTINUE SHOPPING</Button>
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="font-display text-3xl text-foreground mb-6">CHECKOUT</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Address + Payment + Coupon */}
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> DELIVERY ADDRESS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="font-body" />
                <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} className="font-body" />
                <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="font-body" />
                <Input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="font-body" />
                <Input name="address" placeholder="Street Address" value={form.address} onChange={handleChange} className="font-body sm:col-span-2" />
                <Input name="city" placeholder="City" value={form.city} onChange={handleChange} className="font-body" />
                <Input name="state" placeholder="State" value={form.state} onChange={handleChange} className="font-body" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> PAYMENT METHOD</h2>
              <div className="space-y-3">
                {([["card", "Credit / Debit Card"], ["upi", "UPI / Google Pay"], ["cod", "Cash on Delivery"]] as const).map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === val ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} className="accent-primary" />
                    <span className="font-body text-foreground">{label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === "card" && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Card Number" className="font-body sm:col-span-2" />
                  <Input placeholder="MM/YY" className="font-body" />
                  <Input placeholder="CVV" className="font-body" />
                </div>
              )}
            </motion.div>

            {/* Coupon Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-primary" /> APPLY COUPON</h2>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-display text-sm text-foreground">{appliedCoupon.code}</p>
                      <p className="font-body text-xs text-muted-foreground">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-success">-₹{couponDiscount}</span>
                    <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      className="font-body uppercase"
                    />
                    <Button onClick={handleApplyCoupon} className="bg-primary text-primary-foreground font-display px-6 hover:bg-primary/90">APPLY</Button>
                  </div>
                  {couponError && <p className="text-destructive text-xs font-body mt-2">{couponError}</p>}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground font-body">AVAILABLE COUPONS:</p>
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCouponCode(c.code); setCouponError(""); }}
                        className="w-full text-left flex items-center justify-between p-3 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors"
                      >
                        <div>
                          <span className="font-display text-sm text-primary">{c.code}</span>
                          <p className="font-body text-xs text-muted-foreground">{c.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-accent font-body">TAP TO USE</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> ORDER SUMMARY</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-foreground truncate">{item.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{item.size} · {item.color} · x{item.quantity}</p>
                  </div>
                  <p className="font-display text-sm text-foreground">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>Subtotal</span><span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between font-body text-sm text-success">
                  <span>Coupon ({appliedCoupon.code})</span><span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-display text-lg text-foreground pt-2 border-t border-border">
                <span>TOTAL</span><span>₹{total}</span>
              </div>
            </div>
            <Button onClick={handlePlaceOrder} disabled={placing} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-wide h-12 text-base">
              {placing ? "PLACING ORDER..." : "PLACE ORDER"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2 font-body">Free shipping on orders above ₹999</p>
          </motion.div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default CheckoutPage;
