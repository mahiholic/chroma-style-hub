import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["men", "women", "accessories", "general"];

const emptyProduct = { name: "", description: "", price: 0, original_price: 0, category: "general", image_url: "", stock: 0, is_active: true };

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyProduct);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    let q = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (search) q = q.ilike("name", `%${search}%`);
    const { data } = await q;
    setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openNew = () => { setEditing(null); setForm(emptyProduct); setDialogOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: p.price, original_price: p.original_price || 0, category: p.category, image_url: p.image_url || "", stock: p.stock, is_active: p.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Missing fields", description: "Name and price required", variant: "destructive" });
      return;
    }
    if (editing) {
      await supabase.from("products").update(form).eq("id", editing.id);
      toast({ title: "Product updated" });
    } else {
      await supabase.from("products").insert(form);
      toast({ title: "Product created" });
    }
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="font-display text-2xl tracking-wide">PRODUCTS</h2>
          <Button onClick={openNew} className="gap-2 font-body"><Plus className="w-4 h-4" /> Add Product</Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 font-body" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-12 font-body">No products found. Add your first product!</p>
          ) : products.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              {p.image_url && (
                <div className="aspect-square bg-muted">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-body font-medium text-sm line-clamp-2">{p.name}</h3>
                  <Badge variant="outline" className="text-xs capitalize shrink-0">{p.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg">₹{Number(p.price).toLocaleString()}</span>
                  {p.original_price > p.price && (
                    <span className="text-xs line-through text-muted-foreground">₹{Number(p.original_price).toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Stock: {p.stock}</span>
                  <Badge variant={p.is_active ? "default" : "secondary"} className="text-xs">
                    {p.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="flex-1 gap-1 font-body text-xs">
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive gap-1 font-body text-xs">
                    <Trash2 className="w-3 h-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "EDIT PRODUCT" : "ADD PRODUCT"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 font-body">
              <Input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                <Input type="number" placeholder="Original Price" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} />
              </div>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <label className="text-sm">Active</label>
              </div>
              <Button onClick={handleSave} className="w-full font-display">{editing ? "UPDATE" : "CREATE"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
