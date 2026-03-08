import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, Truck, MapPin, CreditCard, Phone, Clock,
  CheckCircle, Circle, XCircle, RotateCcw, Star, Loader2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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

const timelineSteps = ["pending", "processing", "shipped", "out for delivery", "delivered"];

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-6 h-6 transition-colors ${interactive ? "cursor-pointer hover:text-primary" : ""} ${
          star <= rating ? "fill-primary text-primary" : "text-border"
        }`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewProductId, setReviewProductId] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!orderId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["order-reviews", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_reviews")
        .select("*")
        .eq("order_id", orderId!);
      if (error) throw error;
      return data || [];
    },
    enabled: !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled", cancel_reason: cancelReason || "Customer requested cancellation" })
        .eq("id", orderId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast({ title: "Order Cancelled", description: "Your order has been cancelled successfully" });
      setShowCancelConfirm(false);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const returnMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "return requested", return_reason: returnReason, return_requested_at: new Date().toISOString() })
        .eq("id", orderId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast({ title: "Return Requested", description: "Your return request has been submitted" });
      setShowReturnForm(false);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("order_reviews").insert({
        order_id: orderId!,
        product_id: reviewProductId,
        user_id: user!.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-reviews", orderId] });
      toast({ title: "Review Submitted! 🎉", description: "Thanks for your feedback" });
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNavbar />
        <div className="text-center py-20">
          <h1 className="font-display text-2xl text-foreground mb-4">Order Not Found</h1>
          <Link to="/orders"><Button className="font-display">BACK TO ORDERS</Button></Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const items = (order as any).order_items || [];
  const status = statusConfig[order.status] || statusConfig.pending;
  const canCancel = ["pending", "processing", "shipped"].includes(order.status);
  const isDelivered = order.status === "delivered";
  const deliveryDate = order.delivery_date ? new Date(order.delivery_date) : null;
  const canReturn = isDelivered && deliveryDate && (Date.now() - deliveryDate.getTime()) < 7 * 86400000;
  const currentStepIndex = timelineSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Order Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-2xl text-foreground">{order.order_number}</h1>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <Badge className={`${status.color} border text-sm px-3 py-1`}>{status.label}</Badge>
          </div>
        </motion.div>

        {/* Order Timeline */}
        {order.status !== "cancelled" && order.status !== "return requested" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-6 mb-4">
            <h2 className="font-display text-lg text-foreground mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> ORDER TIMELINE
            </h2>
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
                style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (timelineSteps.length - 1)) * 100 : 0}%` }}
              />
              {timelineSteps.map((step, i) => {
                const done = i <= currentStepIndex;
                const active = i === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    } ${active ? "ring-4 ring-primary/20" : ""}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </div>
                    <span className={`font-body text-[10px] mt-2 capitalize text-center max-w-[70px] ${done ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 mb-4">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> ITEMS ({items.length})
          </h2>
          <div className="space-y-4">
            {items.map((item: any) => {
              const reviewed = reviews.some((r: any) => r.product_id === (item.product_id || item.product_name));
              return (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground">{item.product_name}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Qty: {item.quantity} · ₹{item.price} each
                      {item.size && ` · Size: ${item.size}`}
                      {item.color && ` · Color: ${item.color}`}
                    </p>
                    <p className="font-display text-sm text-foreground mt-1">₹{item.total}</p>
                    {/* Review button per item */}
                    {isDelivered && !reviewed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs font-display text-primary hover:text-primary/80 gap-1 p-0 h-auto"
                        onClick={() => {
                          setReviewProductId(item.product_id || item.product_name);
                          setShowReviewForm(true);
                        }}
                      >
                        <Star className="w-3.5 h-3.5" /> WRITE REVIEW
                      </Button>
                    )}
                    {reviewed && (
                      <span className="text-xs text-green-600 font-body flex items-center gap-1 mt-2">
                        <CheckCircle className="w-3 h-3" /> Reviewed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Info Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> SHIPPING ADDRESS
            </h3>
            <p className="font-body text-sm text-muted-foreground">{order.shipping_address || "Not provided"}</p>
            <div className="mt-3 space-y-1">
              <p className="font-body text-sm text-foreground">{order.customer_name}</p>
              <p className="font-body text-xs text-muted-foreground">{order.customer_email}</p>
              {order.phone && (
                <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {order.phone}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> PAYMENT
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="text-foreground capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-foreground capitalize">{order.payment_status}</span>
              </div>
              <div className="flex justify-between font-body text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between font-body text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-display text-base border-t border-border pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₹{order.total}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-4">
          {/* Cancel */}
          {canCancel && !showCancelConfirm && (
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirm(true)}
              className="w-full font-display text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
            >
              <XCircle className="w-4 h-4" /> CANCEL ORDER
            </Button>
          )}

          {showCancelConfirm && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-display text-sm">
                <AlertTriangle className="w-4 h-4" /> Are you sure you want to cancel?
              </div>
              <Textarea
                placeholder="Reason for cancellation (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="font-body"
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="font-display"
                >
                  {cancelMutation.isPending ? "CANCELLING..." : "YES, CANCEL ORDER"}
                </Button>
                <Button variant="outline" onClick={() => setShowCancelConfirm(false)} className="font-display">
                  NO, KEEP IT
                </Button>
              </div>
            </div>
          )}

          {/* Return */}
          {canReturn && !showReturnForm && (
            <Button
              variant="outline"
              onClick={() => setShowReturnForm(true)}
              className="w-full font-display text-orange-600 border-orange-500/30 hover:bg-orange-500/5 gap-2"
            >
              <RotateCcw className="w-4 h-4" /> RETURN PRODUCT
            </Button>
          )}

          {isDelivered && deliveryDate && (Date.now() - deliveryDate.getTime()) >= 7 * 86400000 && (
            <p className="font-body text-xs text-muted-foreground text-center">Return window has expired (7 days after delivery)</p>
          )}

          {showReturnForm && (
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5 space-y-3">
              <p className="font-display text-sm text-orange-700">Return Request</p>
              <Textarea
                placeholder="Why do you want to return? (required)"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="font-body"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => returnMutation.mutate()}
                  disabled={returnMutation.isPending || !returnReason.trim()}
                  className="font-display bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {returnMutation.isPending ? "SUBMITTING..." : "SUBMIT RETURN REQUEST"}
                </Button>
                <Button variant="outline" onClick={() => setShowReturnForm(false)} className="font-display">
                  CANCEL
                </Button>
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-display text-lg text-foreground">WRITE A REVIEW</h3>
              <div>
                <label className="font-body text-sm font-semibold text-foreground mb-2 block">Rating</label>
                <StarRating rating={reviewRating} onRate={setReviewRating} interactive />
              </div>
              <Textarea
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="font-body"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => reviewMutation.mutate()}
                  disabled={reviewMutation.isPending || reviewRating === 0}
                  className="font-display bg-primary text-primary-foreground"
                >
                  {reviewMutation.isPending ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)} className="font-display">
                  CANCEL
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default OrderDetailPage;
