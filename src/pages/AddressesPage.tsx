import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const AddressesPage = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", name: "John Doe", phone: "9876543210", address: "123 Street, Apartment 4B", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setAddresses([...addresses, { ...form, id: Date.now().toString() }]);
    setForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setShowForm(false);
    toast({ title: "Address added! 📍" });
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast({ title: "Address removed" });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        <h1 className="font-display text-3xl text-foreground mb-6 flex items-center gap-2"><MapPin className="w-7 h-7 text-primary" /> MY ADDRESSES</h1>

        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <motion.div key={addr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display text-foreground">{addr.name}</p>
                  <p className="font-body text-sm text-muted-foreground mt-1">{addr.address}</p>
                  <p className="font-body text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="font-body text-sm text-muted-foreground">Phone: {addr.phone}</p>
                </div>
                <button onClick={() => handleDelete(addr.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {showForm ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 mt-4">
            <h2 className="font-display text-lg text-foreground mb-4">ADD NEW ADDRESS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="font-body" />
              <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="font-body" />
              <Input name="address" placeholder="Street Address" value={form.address} onChange={handleChange} className="font-body sm:col-span-2" />
              <Input name="city" placeholder="City" value={form.city} onChange={handleChange} className="font-body" />
              <Input name="state" placeholder="State" value={form.state} onChange={handleChange} className="font-body" />
              <Input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="font-body" />
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleAdd} className="bg-primary text-primary-foreground font-display">SAVE ADDRESS</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="font-body">Cancel</Button>
            </div>
          </motion.div>
        ) : (
          <Button onClick={() => setShowForm(true)} className="mt-4 bg-primary text-primary-foreground font-display gap-2">
            <Plus className="w-4 h-4" /> ADD NEW ADDRESS
          </Button>
        )}
      </div>
      <StoreFooter />
    </div>
  );
};

export default AddressesPage;
