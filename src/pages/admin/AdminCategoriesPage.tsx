import { useEffect, useRef, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCategories, type StoreCategory } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryForm {
  name: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: CategoryForm = { name: "", image_url: "", is_active: true };

const toSlug = (value: string) => value
  .normalize("NFKD")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const AdminCategoriesPage = () => {
  const { data: categories = [], isLoading, isError } = useCategories(true);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<StoreCategory | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    const fetchProductCounts = async () => {
      const { data, error } = await supabase.from("products").select("category_id");
      if (error || cancelled) return;
      const counts: Record<string, number> = {};
      for (const product of data || []) {
        if (product.category_id) counts[product.category_id] = (counts[product.category_id] || 0) + 1;
      }
      setProductCounts(counts);
    };
    void fetchProductCounts();
    return () => { cancelled = true; };
  }, [categories]);

  const refreshCategories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
      queryClient.invalidateQueries({ queryKey: ["db-products"] }),
    ]);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (category: StoreCategory) => {
    setEditing(category);
    setForm({ name: category.name, image_url: category.image_url || "", is_active: category.is_active });
    setDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Choose an image file", variant: "destructive" });
      return;
    }

    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `categories/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setForm((current) => ({ ...current, image_url: data.publicUrl }));
    setUploading(false);
    event.target.value = "";
    toast({ title: "Category image uploaded" });
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const slug = editing?.slug || toSlug(name);
    if (!name || !slug) {
      toast({ title: "Category name required", description: "Enter a name using letters or numbers.", variant: "destructive" });
      return;
    }

    const payload = { name, slug, image_url: form.image_url || null, is_active: form.is_active };
    const result = editing
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (result.error) {
      toast({ title: "Could not save category", description: result.error.message, variant: "destructive" });
      return;
    }

    toast({ title: editing ? "Category updated" : "Category created" });
    setDialogOpen(false);
    await refreshCategories();
  };

  const handleToggle = async (category: StoreCategory, isActive: boolean) => {
    const { error } = await supabase.from("categories").update({ is_active: isActive }).eq("id", category.id);
    if (error) {
      toast({ title: "Could not update category", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: isActive ? "Category activated" : "Category deactivated" });
    await refreshCategories();
  };

  const handleDelete = async (category: StoreCategory) => {
    const count = productCounts[category.id] || 0;
    if (count > 0) {
      toast({ title: "Category still has products", description: "Reassign its products before deleting it.", variant: "destructive" });
      return;
    }
    if (!window.confirm(`Delete ${category.name}?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) {
      toast({ title: "Could not delete category", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Category deleted" });
    await refreshCategories();
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-wide">MANAGE CATEGORIES</h2>
            <p className="mt-1 text-sm text-muted-foreground">Categories with assigned products must be emptied before deletion.</p>
          </div>
          <Button onClick={openNew} className="gap-2" disabled={isLoading}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>

        {isError && <p className="py-8 text-center text-sm text-destructive">Could not load categories. Please refresh and try again.</p>}
        {!isError && !isLoading && categories.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No categories yet. Add your first category to start listing products.</div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const count = productCounts[category.id] || 0;
            return (
              <Card key={category.id} className="overflow-hidden">
                <div className="aspect-[16/7] bg-muted">
                  {category.image_url
                    ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
                    : <div className="flex h-full items-center justify-center font-display text-3xl text-muted-foreground">{category.name}</div>}
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-body text-base font-semibold">{category.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">/category/{category.slug}</p>
                    </div>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">{count} products</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Edit category"
                        aria-label={`Edit ${category.name}`}
                        onClick={() => openEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={category.is_active}
                        onCheckedChange={(checked) => void handleToggle(category, checked)}
                        aria-label={`${category.is_active ? "Deactivate" : "Activate"} ${category.name}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title={count > 0 ? "Reassign products before deleting" : "Delete category"}
                        aria-label={`Delete ${category.name}`}
                        onClick={() => void handleDelete(category)}
                        disabled={count > 0}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "EDIT CATEGORY" : "ADD CATEGORY"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category-name" className="text-sm font-medium">Category name</label>
                <Input id="category-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Winter Wear" />
              </div>
              <p className="text-xs text-muted-foreground">Page address: /category/{editing?.slug || toSlug(form.name) || "category-name"}</p>
              <div className="space-y-2">
                <span className="text-sm font-medium">Category image</span>
                {form.image_url && <img src={form.image_url} alt="Category preview" className="h-32 w-full rounded border border-border object-cover" />}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
                  <ImagePlus className="h-4 w-4" /> {uploading ? "Uploading…" : form.image_url ? "Replace image" : "Upload image"}
                </Button>
              </div>
              <div className="flex items-center justify-between rounded border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Visible in store</p>
                  <p className="text-xs text-muted-foreground">Inactive categories are hidden from customers.</p>
                </div>
                <Switch checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} aria-label="Category visible in store" />
              </div>
              <Button onClick={() => void handleSave()} disabled={uploading} className="w-full">
                {editing ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;