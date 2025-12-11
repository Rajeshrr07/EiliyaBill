"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !newPassword) {
      toast.error("Email and new password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update password");
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully!");
      setEmail("");
      setNewPassword("");
      setOpen(false);
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);
      toast.error("Server error");
    }

    setLoading(false);
  }

  return (
    <>
      {/* Forgot Password Link */}
      <Button
        variant="ghost"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:bg-transparent px-0"
        onClick={() => setOpen(true)}
        type="button"
      >
        Forgot password?
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button onClick={submit} className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
