import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col bg-card w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl tracking-wide">
            YOUR BAG <span className="text-primary">({totalItems})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Shopping cart items</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="w-16 h-16 opacity-30" />
            <p className="font-body text-lg">Your bag is empty</p>
            <Button onClick={() => setIsOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex gap-3 bg-background rounded-xl p-3"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body text-sm font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Size: {item.size} · {item.color}
                      </p>
                      <p className="font-body font-bold text-foreground mt-1">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-body font-semibold text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="ml-auto p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-body text-muted-foreground">Subtotal</span>
                <span className="font-body font-bold text-lg text-foreground">₹{totalPrice.toLocaleString()}</span>
              </div>
              <Button onClick={() => { setIsOpen(false); navigate("/checkout"); }} className="w-full h-12 bg-primary text-primary-foreground font-display text-lg tracking-wide hover:bg-primary/90">
                CHECKOUT
              </Button>
              <button onClick={clearCart} className="w-full text-center text-sm text-muted-foreground hover:text-destructive transition-colors">
                Clear bag
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
