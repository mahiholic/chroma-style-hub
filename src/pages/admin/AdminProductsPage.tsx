import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category_id: string;
  image_urls: string[];
  stock: number;
  is_active: boolean;
  available_sizes: string[];
  available_colors: string[];
}

const emptyProduct = (categoryId = ""): ProductForm => ({
  name: "",
  description: "",
  price: 0,
  original_price: null,
  category_id: categoryId,
  image_urls: [],
  stock: 0,
  is_active: true,
  available_sizes: [],
  available_colors: [],
});

const splitOptions = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<ProductForm>(emptyProduct());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    let query = supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false });
    if (search.trim()) query = query.ilike("name", `%${search.trim()}%`);
    const { data, error } = await query;
    if (error) {
      toast({ title: "Could not load products", description: error.message, variant: "destructive" });
      return;
    }
    setProducts(data || []);
  };

  useEffect(() => { void fetchProducts(); }, [search]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct(categories.find((category) => category.is_active)?.id || ""));
    setDialogOpen(true);
  };

  const openEdit = (product: any) => {
    setEditing(product);
    const images = Array.isArray(product.image_urls) && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
        ? [product.image_url]
        : [];
    setForm({
      name: product.name,
      description: product.description || "",
      price: Number(product.price),
      original_price: product.original_price === null ? null : Number(product.original_price),
      category_id: product.category_id || "",
      image_urls: images,
      stock: Number(product.stock || 0),
      is_active: Boolean(product.is_active),
      available_sizes: product.available_sizes || [],
      available_colors: product.available_colors || [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast({ title: "Invalid file", description: "Choose image files only.", variant: "destructive" });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filePath = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error } = await supabase.storage.from("product-images").upload(filePath, file);
        if (error) throw new Error(error.message);
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
      setForm((current) => ({ ...current, image_urls: [...current.image_urls, ...uploadedUrls] }));
      toast({ title: `${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} uploaded` });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (imageUrl: string) => {
    setForm((current) => ({ ...current, image_urls: current.image_urls.filter((url) => url !== imageUrl) }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.price <= 0) {
      toast({ title: "Missing fields", description: "Product name and a price greater than zero are required.", variant: "destructive" });
      return;
    }
    const selectedCategory = categories.find((category) => category.id === form.category_id);
    if (!selectedCategory || (!editing && !selectedCategory.is_active)) {
      toast({ title: "Choose an active category", description: "Create or activate a category before adding products.", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price,
      original_price: form.original_price && form.original_price > 0 ? form.original_price : null,
      category: selectedCategory.slug,
      category_id: selectedCategory.id,
      image_url: form.image_urls[0] || null,
      image_urls: form.image_urls,
      stock: form.stock,
      is_active: form.is_active,
      available_sizes: form.available_sizes,
      available_colors: form.available_colors,
    };

    setSaving(true);
    const result = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (result.error) {
      toast({ title: "Could not save product", description: result.error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Product updated" : "Product created" });
    setDialogOpen(false);
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete product", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    await fetchProducts();
  };

  const availableCategories = categories.filter((category) => category.is_active || category.id === form.category_id);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl tracking-wide">PRODUCTS</h2>
            <p className="mt-1 text-sm text-muted-foreground">Products appear only in their assigned category.</p>
          </div>
          <Button onClick={openNew} className="gap-2" disabled={categoriesLoading || !categories.some((category) => category.is_active)}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {categories.length === 0 && !categoriesLoading && (
          <div className="flex flex-col items-start gap-2 border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Create a category before adding products.</p>
            <Button asChild variant="outline"><Link to="/admin/categories">Manage Categories</Link></Button>
          </div>
        )}

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length === 0 ? (
            <p className="col-span-full py-12 text-center text-muted-foreground">No products found. Add your first product.</p>
          ) : products.map((product) => {
            const image = product.image_urls?.[0] || product.image_url;
            return (
              <Card key={product.id} className="overflow-hidden">
                {image && <div className="aspect-square bg-muted"><img src={image} alt={product.name} className="h-full w-full object-cover" /></div>}
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
                    <Badge variant="outline" className="shrink-0 text-xs">{product.categories?.name || product.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg">₹{Number(product.price).toLocaleString()}</span>
                    {product.original_price > product.price && <span className="text-xs text-muted-foreground line-through">₹{Number(product.original_price).toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                    <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                      {product.stock > 0 ? "Available" : "Out of stock"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={product.is_active ? "default" : "secondary"} className="text-xs">
                      {product.is_active ? "Active" : "Hidden"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)} className="gap-1 text-xs">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => void handleDelete(product.id)} className="gap-1 text-xs text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "EDIT PRODUCT" : "ADD PRODUCT"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" min="0" placeholder="Selling price" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
                <Input type="number" min="0" placeholder="Original price (optional)" value={form.original_price ?? ""} onChange={(event) => setForm({ ...form, original_price: event.target.value ? Number(event.target.value) : null })} />
              </div>

              <Select value={form.category_id} onValueChange={(value) => setForm({ ...form, category_id: value })}>
                <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}{category.is_active ? "" : " (inactive)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <p className="text-sm font-medium">Product images</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
                  <ImagePlus className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload images"}
                </Button>
                {form.image_urls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {form.image_urls.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded border border-border">
                        <img src={image} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" />
                        <Button type="button" variant="ghost" size="icon" aria-label={`Remove image ${index + 1}`} onClick={() => removeImage(image)} className="absolute right-1 top-1 h-7 w-7 bg-background/90">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input type="number" min="0" placeholder="Stock quantity" value={form.stock} onChange={(event) => setForm({ ...form, stock: Math.max(0, Number(event.target.value)) })} />
                <div className="flex items-center justify-center">
                  <Badge variant={form.stock > 0 ? "secondary" : "destructive"}>{form.stock > 0 ? "Available" : "Out of stock"}</Badge>
                </div>
              </div>
              <Input placeholder="Available sizes, comma separated" value={form.available_sizes.join(", ")} onChange={(event) => setForm({ ...form, available_sizes: splitOptions(event.target.value) })} />
              <Input placeholder="Available colours, comma separated" value={form.available_colors.join(", ")} onChange={(event) => setForm({ ...form, available_colors: splitOptions(event.target.value) })} />

              <div className="flex items-center justify-between rounded border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Visible in store</p>
                  <p className="text-xs text-muted-foreground">Hide a product without deleting it.</p>
                </div>
                <Switch checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} aria-label="Product visible in store" />
              </div>
              <Button onClick={() => void handleSave()} disabled={saving || uploading} className="w-full">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
