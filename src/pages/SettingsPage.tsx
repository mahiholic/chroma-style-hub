import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Lock, Palette, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StoreNavbar from "@/components/StoreNavbar";
import StoreFooter from "@/components/StoreFooter";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({ orders: true, offers: true, newArrivals: false });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });

  const handleNotifToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast({ title: `${!notifications[key] ? "Enabled" : "Disabled"} ${key} notifications` });
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast({ title: "Missing fields", description: "Please fill in all password fields", variant: "destructive" });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    toast({ title: "Password updated! 🔒" });
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        <h1 className="font-display text-3xl text-foreground mb-6 flex items-center gap-2"><Settings className="w-7 h-7 text-primary" /> SETTINGS</h1>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 mb-4">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> NOTIFICATIONS</h2>
          <div className="space-y-3">
            {([["orders", "Order Updates"], ["offers", "Offers & Promotions"], ["newArrivals", "New Arrivals"]] as const).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="font-body text-foreground">{label}</span>
                <button
                  onClick={() => handleNotifToggle(key)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications[key] ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${notifications[key] ? "left-6" : "left-0.5"}`} />
                </button>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 mb-4">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> CHANGE PASSWORD</h2>
          <div className="space-y-3">
            <Input type="password" placeholder="Current Password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className="font-body" />
            <Input type="password" placeholder="New Password" value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} className="font-body" />
            <Input type="password" placeholder="Confirm New Password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="font-body" />
            <Button onClick={handlePasswordChange} className="bg-primary text-primary-foreground font-display">UPDATE PASSWORD</Button>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> APPEARANCE</h2>
          <p className="font-body text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
          <div className="flex gap-3">
            <button onClick={() => { document.documentElement.classList.remove("dark"); toast({ title: "Light mode ☀️" }); }}
              className="w-12 h-12 rounded-xl bg-white border-2 border-border hover:border-primary transition-colors" />
            <button onClick={() => { document.documentElement.classList.add("dark"); toast({ title: "Dark mode 🌙" }); }}
              className="w-12 h-12 rounded-xl bg-gray-900 border-2 border-border hover:border-primary transition-colors" />
          </div>
        </motion.div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default SettingsPage;
