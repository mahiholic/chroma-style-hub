import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Key } from "lucide-react";

const AdminSettingsPage = () => {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully" });
      setNewPassword("");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <h2 className="font-display text-2xl tracking-wide">SETTINGS</h2>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-body">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="text-xs text-muted-foreground font-mono">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-body">
            <Input
              type="password"
              placeholder="New Password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={handlePasswordChange} disabled={loading} className="font-display">
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
