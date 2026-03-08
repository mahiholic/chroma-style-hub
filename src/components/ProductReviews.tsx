import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProductReviews, type Review } from "@/data/products";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: number | string;
  productRating: number;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors ${interactive ? "cursor-pointer hover:text-primary" : ""} ${
          star <= rating ? "fill-primary text-primary" : "text-border"
        }`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const ProductReviews = ({ productId, productRating }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(getProductReviews(typeof productId === 'number' ? productId : 0));
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : productRating;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const handleSubmit = () => {
    if (!newName.trim() || !newComment.trim() || newRating === 0) {
      toast.error("Please fill all fields and select a rating");
      return;
    }
    const review: Review = {
      id: Date.now(),
      userName: newName,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    };
    setReviews([review, ...reviews]);
    setNewName("");
    setNewComment("");
    setNewRating(0);
    setShowForm(false);
    toast.success("Review submitted! 🎉");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 border-t border-border pt-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl text-foreground">RATINGS & REVIEWS</h2>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" className="font-display border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          {showForm ? "CANCEL" : "WRITE A REVIEW"}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center bg-card rounded-2xl border border-border p-6">
          <span className="font-display text-5xl text-foreground">{avgRating}</span>
          <StarRating rating={Math.round(Number(avgRating))} />
          <span className="text-sm text-muted-foreground mt-2 font-body">{reviews.length} reviews</span>
        </div>
        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="font-body text-sm text-muted-foreground w-4">{star}</span>
              <Star className="w-4 h-4 fill-primary text-primary" />
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-body text-sm text-muted-foreground w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h3 className="font-display text-xl text-foreground mb-4">YOUR REVIEW</h3>
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm font-semibold text-foreground mb-2 block">Rating</label>
              <StarRating rating={newRating} onRate={setNewRating} interactive />
            </div>
            <Input placeholder="Your Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="font-body" />
            <Textarea placeholder="Write your review here..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="font-body" rows={4} />
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground font-display hover:bg-primary/90">SUBMIT REVIEW</Button>
          </div>
        </motion.div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold text-foreground">{review.userName}</span>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs text-success font-semibold">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-xs text-muted-foreground font-body">{review.date}</span>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
            <button className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
              <ThumbsUp className="w-3.5 h-3.5" /> Helpful
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductReviews;
